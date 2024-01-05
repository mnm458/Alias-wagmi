import { AbstractWeb3AuthWalletConnector } from './AbstractWeb3AuthWalletConnector.js'
import { LoginProvider } from '../utilities/provider.js'

export class TwitterSocialWalletConnector extends AbstractWeb3AuthWalletConnector {
    id = 'twitter'
    name = 'Twitter'
    loginProvider = 'twitter' as LoginProvider
}