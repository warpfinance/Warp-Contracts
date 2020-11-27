import { InjectedConnector } from "@web3-react/injected-connector";
import { PortisConnector } from "@web3-react/portis-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { NetworkConnector } from "../connectors/network-connector";
import { WalletConnectConnector } from "../deps/walletconnect-connector/dist";
import { supportedNetworks, supportedNetworkIds } from "./networks";


const MetaMask = new InjectedConnector({
    supportedChainIds: supportedNetworkIds
});

const Coinbase = new WalletLinkConnector({
    url: "https://kovan.infura.io/v3/f30a8e726a8c4851bfc92a44a04bc889", // replace with mainnet
    appName: "Warp",
    appLogoUrl: undefined //"https://warpfinance-warp.herokuapp.com/warp_ext_logo.jpg"
})

const portisAppId = "TODO: Get Portis ID";

const Portis = new PortisConnector({
    dAppId: portisAppId,
    networks: [1, 42]
});

const infuraNetworks = Object.entries(supportedNetworks).reduce(function (map: any, [key, value]: any) {
    map[key] = value.uri;
    return map;
}, {});

const Infura = new NetworkConnector({
    // urls: infuraNetworks,
    // defaultChainId: 1
    urls: {
        42: "https://kovan.infura.io/v3/f30a8e726a8c4851bfc92a44a04bc889"
    },
    defaultChainId: 42
});

const WalletConnect = new WalletConnectConnector({
    rpc: infuraNetworks
});

export default {
    MetaMask,
    Coinbase,
    Portis,
    Infura,
    WalletConnect
}
