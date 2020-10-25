import { InjectedConnector } from "@web3-react/injected-connector";
import { PortisConnector } from "@web3-react/portis-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

const supportedNetworks = [1, 42];

const MetaMask = new InjectedConnector({supportedChainIds: supportedNetworks});

const Coinbase = new WalletLinkConnector({
    url: "warp.exchange",
    appName: "Warp",
    appLogoUrl: undefined
})

const portisAppId = "TODO: Get Portis ID";

const Portis = new PortisConnector({
    dAppId: portisAppId,
    networks: supportedNetworks
})

export default {
    MetaMask,
    Coinbase,
    Portis
}
