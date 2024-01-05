import { AbstractWeb3AuthWalletConnector } from './AbstractWeb3AuthWalletConnector.js'
import { LoginProvider } from '../utilities/provider.js'

export class GoogleSocialWalletConnector extends AbstractWeb3AuthWalletConnector {
    id = 'google'
    name = 'Google'
    loginProvider = 'google' as LoginProvider
}