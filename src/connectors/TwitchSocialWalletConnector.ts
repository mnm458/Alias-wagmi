import { AbstractWeb3AuthWalletConnector } from './AbstractWeb3AuthWalletConnector.js'
import { LoginProvider } from '../utilities/provider.js'

export class TwitchSocialWalletConnector extends AbstractWeb3AuthWalletConnector {
    id = 'twitch'
    name = 'Twitch'
    loginProvider = 'twitch' as LoginProvider
}