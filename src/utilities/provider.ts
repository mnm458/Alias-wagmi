import { Web3AuthNoModal } from "@web3auth/no-modal";
import { AliasWeb3AuthInitOptions, ProjectConfiguration, ChainId, AliasWeb3AuthOptions, AliasWeb3AuthEvents } from "./provider-config.js";
export type LoginProvider = 'google' | 'facebook' | 'discord' | 'twitch' | 'twitter' | 'github' | 'jwt' | 'auth0';
declare class AliasWeb3Auth extends Web3AuthNoModal {
    static zeroDevWeb3Auth: AliasWeb3Auth;
    eventHandlers: {
        [event in AliasWeb3AuthEvents]: {
            [loginProvider: string]: () => void;
        };
    };
    initiated: boolean | Promise<void>;
    zeroDevOptions: AliasWeb3AuthOptions;
    projectIds: string[];
    chainId?: ChainId;
    authenticationProviders: ProjectConfiguration['authenticationProviders'];
    constructor(projectIds: string[], chainId?: ChainId, zeroDevOptions?:AliasWeb3AuthOptions);
    initialize(initOptions: AliasWeb3AuthInitOptions, loginProvider: LoginProvider): Promise<void>;
    login(loginProvider: LoginProvider, extra?: {
        jwt: string;
    }): Promise<import("@web3auth/base").IProvider | null>;
    static getInstance(projectIds: string[], chainId?: ChainId, zeroDevOptions?: AliasWeb3AuthOptions): AliasWeb3Auth;
}
export default AliasWeb3Auth;