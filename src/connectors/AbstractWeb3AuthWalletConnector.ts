import { AccountParams, AliasConnector } from "./AliasConnector.js";
import AliasWeb3Auth from '../utilities/provider.js'
import { LoginProvider } from "../utilities/provider.js";
import {AliasWeb3AuthInitOptions } from "../utilities/provider-config.js";
import { AliasWeb3AuthOptions } from "../utilities/provider-config.js";
import { getConfig } from '@wagmi/core';
import type { Chain } from 'wagmi/chains';
import { connect } from 'wagmi/actions'
import { LocalAccountSigner, SmartAccountSigner } from "@alchemy/aa-core";
import { getRPCProviderOwner } from '../utilities/helpers.js'

export type AbstractWeb3AuthWalletConnectorOptions = Omit<Partial<AccountParams>, "owner" | "disconnect"> & Partial<AliasWeb3AuthOptions>

export abstract class AbstractWeb3AuthWalletConnector extends AliasConnector {
    abstract loginProvider: LoginProvider
    owner: SmartAccountSigner | undefined;
    web3Auth: AliasWeb3Auth | undefined
    
    constructor(
        {chains = [], options}: {chains?: Chain[]; options: AbstractWeb3AuthWalletConnectorOptions},
    ) {
        super({chains, options})
        this.getChainId().then(chainId => {
            if (this.options.projectIds) {
                const web3AuthInitOptions: AliasWeb3AuthInitOptions = {}
                this.web3Auth = AliasWeb3Auth.getInstance(this.options.projectIds, chainId, {
                    adapterSettings: options.adapterSettings,
                    web3authOptions: options.web3authOptions
                })
                if (
                    getConfig().storage?.getItem(`${this.loginProvider}-connecting`)
                    ||
                    (options.shimDisconnect && getConfig().storage?.getItem(this.shimDisconnectKey))
                ) {
                    web3AuthInitOptions['onConnect'] = async (userInfo: any) => {
                        const typeOfLogin = userInfo.typeOfLogin
                        if (this.loginProvider === typeOfLogin || (this.loginProvider === 'auth0' && typeOfLogin === 'jwt'))  {
                            if (this.web3Auth?.provider) {
                                this.owner = getRPCProviderOwner(this.web3Auth.provider)
                            }
                            connect(({chainId, connector: this})).catch(() => {})
                        }
                        getConfig().storage?.setItem(`${this.loginProvider}-connecting`, false)
                    }
                }
                this.web3Auth.initialize(web3AuthInitOptions, this.loginProvider)
            }
        }).catch(() => {})
    }

    async isAuthorized() {
        return false
    }

    //@ts-expect-error
    async connect({ chainId }) {
        if (!this.owner) {
            let provider = this.web3Auth?.provider
            if (this.web3Auth?.status === 'connected') {
                const typeOfLogin = (await this.web3Auth?.getUserInfo())?.typeOfLogin
                if (typeOfLogin !== this.loginProvider && (this.loginProvider !== 'auth0' || typeOfLogin !== 'jwt')) {
                    await this.web3Auth?.logout()
                    provider = null
                }
            }
            if (!this.web3Auth?.connected) {
                getConfig().storage?.setItem(`${this.loginProvider}-connecting`, true)
                provider = await this.web3Auth?.login(this.loginProvider)
                setTimeout(() => {
                    getConfig().storage?.setItem(`${this.loginProvider}-connecting`, false)
                }, 1000)
            }
            if (provider) {
                this.owner = getRPCProviderOwner(provider)
            }
        }
        return await super.connect({ chainId })
    }

    async getOptions() {
        if (this.owner) {
            this.options.owner = this.owner
        }
        const options = await super.getOptions()
        options.disconnect = async () => {
            await this.web3Auth?.logout()
            this.owner = undefined
        }
        return options
    }
}