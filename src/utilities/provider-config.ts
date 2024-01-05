import { Web3AuthNoModalOptions } from "@web3auth/no-modal";
import { OpenloginAdapterOptions } from "@web3auth/openlogin-adapter";
import { UserInfo } from "@web3auth/base";

export declare const CHAIN_ID_TO_NODE: {
    [key: number]: string;
};

export type ChainId = keyof typeof CHAIN_ID_TO_NODE;
export type ZeroDevWeb3AuthOptions = {
    web3authOptions?: Partial<Web3AuthNoModalOptions>;
    adapterSettings?: Partial<OpenloginAdapterOptions['adapterSettings']>;
};
export type ZeroDevWeb3AuthInitOptions = {
    onConnect?: (userInfo: Partial<UserInfo>) => Promise<void> | void;
};
export interface ProjectConfiguration {
    projects: Array<{
        id: string;
        chainId: number;
    }>;
    newSignature?: string;
    signature?: string;
    authenticationProviders: Array<{
        config: any;
        provider: string;
        verifierId: string | null;
    }>;
}
export type ZeroDevWeb3AuthEvents = 'onConnect';