import { Web3AuthNoModal } from "@web3auth/no-modal";
import { ZeroDevWeb3AuthInitOptions, ProjectConfiguration, ChainId, ZeroDevWeb3AuthOptions, ZeroDevWeb3AuthEvents } from "./provider-config.js";
export type LoginProvider = 'google' | 'facebook' | 'discord' | 'twitch' | 'twitter' | 'github' | 'jwt' | 'auth0';
declare class AliasWeb3Auth extends Web3AuthNoModal {
    static zeroDevWeb3Auth: AliasWeb3Auth;
    eventHandlers: {
        [event in ZeroDevWeb3AuthEvents]: {
            [loginProvider: string]: () => void;
        };
    };
    initiated: boolean | Promise<void>;
    zeroDevOptions: ZeroDevWeb3AuthOptions;
    projectIds: string[];
    chainId?: ChainId;
    authenticationProviders: ProjectConfiguration['authenticationProviders'];
    constructor(projectIds: string[], chainId?: ChainId, zeroDevOptions?: ZeroDevWeb3AuthOptions);
    initialize(initOptions: ZeroDevWeb3AuthInitOptions, loginProvider: LoginProvider): Promise<void>;
    login(loginProvider: LoginProvider, extra?: {
        jwt: string;
    }): Promise<import("@web3auth/base").IProvider | null>;
    static getInstance(projectIds: string[], chainId?: ChainId, zeroDevOptions?: ZeroDevWeb3AuthOptions): AliasWeb3Auth;
}
export default AliasWeb3Auth;
//# sourceMappingURL=ZeroDevWeb3Auth.d.ts.map