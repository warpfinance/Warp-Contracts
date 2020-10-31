import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";
import { PortisConnector } from "@web3-react/portis-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { supportedNetworks, supportedNetworkIds } from "./networks";


const MetaMask = new InjectedConnector({
    supportedChainIds: supportedNetworkIds
});

const Coinbase = new WalletLinkConnector({
    url: "warp.exchange",
    appName: "Warp",
    appLogoUrl: undefined
})

const portisAppId = "TODO: Get Portis ID";

const Portis = new PortisConnector({
    dAppId: portisAppId,
    networks: supportedNetworkIds
});

const infuraNetworks = Object.entries(supportedNetworks).reduce(function (map: any, [key, value]: any) {
    map[key] = value.uri;
    return map;
}, {});

const Infura = new NetworkConnector({
    urls: infuraNetworks,
    defaultChainId: 1
});

export default {
    MetaMask,
    Coinbase,
    Portis,
    Infura
}
