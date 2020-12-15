import { NetworkCell } from "@material-ui/icons";
import { DEFAULT_TOKEN } from "./constants";
import { getImageUrl, Token } from "./token";
import { getEnv } from "./tools";

export type NetworkId = 1 | 42 | 1337;

export const networkIds = {
	MAINNET: 1,
	KOVAN: 42,
	LOCALHOST: 1337,
} as const;

interface Network {
	label: string;
	uri: string;
	contracts: {
		warpControl: string;
		v1Control: string;
	};
}

type KnownContracts = keyof Network["contracts"];

const networks: { [K in NetworkId]: Network } = {
	[networkIds.MAINNET]: {
		label: "Mainnet",
		uri: "https://mainnet.infura.io/v3/f30a8e726a8c4851bfc92a44a04bc889",
		contracts: {
			warpControl: "0xcc8d17feeb20969523f096797c3d5c4a490ed9a8",
			v1Control: "0xcc8d17feeb20969523f096797c3d5c4a490ed9a8",
		},
	},
	[networkIds.KOVAN]: {
		label: "Kovan",
		uri: "https://kovan.infura.io/v3/f30a8e726a8c4851bfc92a44a04bc889",
		contracts: {
			warpControl: "0x1a588E9EdefB05638298727B65A6789429Fc2718",
			v1Control: "0x47E98d5d0e3eC5FEB55DFe03Bf0CCE6f34BA3325",
		},
	},
	[networkIds.LOCALHOST]: {
		label: "ganache",
		uri: "https://localhost:8545",
		contracts: {
			warpControl: getEnv("REACT_APP_LOCALHOST_CONTROL"),
			v1Control: getEnv("REACT_APP_LOCALHOST_CONTROL_V1"),
		},
	},
};

export const supportedNetworks = networks;
export const supportedNetworkIds = Object.keys(networks).map(
	Number
) as NetworkId[];

interface KnownTokenData {
	symbol: string;
	decimals: number;
	addresses: {
		[K in NetworkId]?: string;
	};
	order: number;
	lp: boolean;
	disabled?: boolean;
}

export const knownTokens: { [name in KnownToken]: KnownTokenData } = {
	dai: {
		symbol: "DAI",
		decimals: 18,
		addresses: {
			[networkIds.MAINNET]: "0x6b175474e89094c44da98b954eedeac495271d0f",
			[networkIds.KOVAN]: "0xb2e0900bF125DD5E22Aa0af5b837D7e632B85a68",
			[networkIds.LOCALHOST]: getEnv("REACT_APP_LOCALHOST_DAI"),
		},
		order: 1,
		lp: false,
	},
	usdc: {
		symbol: "USDC",
		decimals: 6,
		addresses: {
			[networkIds.MAINNET]: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
			[networkIds.KOVAN]: "0x47e6a161Da5484be1bc0846c2B20E0cFE3aD4A8b",
			[networkIds.LOCALHOST]: getEnv("REACT_APP_LOCALHOST_USDC"),
		},
		order: 2,
		lp: false,
	},
	usdt: {
		symbol: "USDT",
		decimals: 6,
		addresses: {
			[networkIds.MAINNET]: "0xdac17f958d2ee523a2206206994597c13d831ec7",
			[networkIds.KOVAN]: "0x25822Ab209e81e96c797A25efE18543B7C651109",
			[networkIds.LOCALHOST]: getEnv("REACT_APP_LOCALHOST_USDT"),
		},
		order: 3,
		lp: false,
		disabled: false
	},
	"eth-dai": {
		symbol: "ETH-DAI",
		decimals: 18,
		addresses: {
			[networkIds.MAINNET]: "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11",
			[networkIds.KOVAN]: "0x520a2E874e6b3859ED14C226C54B09Dadc68a0d1",
			[networkIds.LOCALHOST]: getEnv("REACT_APP_LOCALHOST_ETH_DAI"),
		},
		order: 4,
		lp: true,
	},
	"eth-usdt": {
		symbol: "ETH-USDT",
		decimals: 18,
		addresses: {
			[networkIds.MAINNET]: "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852",
			[networkIds.KOVAN]: "0xc1f6D3EC539eC355E1EFA2D89d74969AFCE4e28D",
			[networkIds.LOCALHOST]: getEnv("REACT_APP_LOCALHOST_ETH_USDT"),
		},
		order: 5,
		lp: true,
	},
	"eth-usdc": {
		symbol: "ETH-USDC",
		decimals: 18,
		addresses: {
			[networkIds.MAINNET]: "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc",
			[networkIds.KOVAN]: "0xCe0191A9E89ead265d2BA17C0A9Bbde0cB1ACC56",
			[networkIds.LOCALHOST]: getEnv("REACT_APP_LOCALHOST_ETH_USDC"),
		},
		order: 6,
		lp: true,
	},
	"eth-wbtc": {
		symbol: "ETH-wBTC",
		decimals: 18,
		addresses: {
			[networkIds.MAINNET]: "0xbb2b8038a1640196fbe3e38816f3e67cba72d940",
			[networkIds.KOVAN]: "0x7Ec2EC5E019b8b65035f992d62897E36a95014B0",
			[networkIds.LOCALHOST]: getEnv("REACT_APP_LOCALHOST_ETH_WBTC"),
		},
		order: 7,
		lp: true,
	},
};

const validNetworkId = (networkId: number): networkId is NetworkId => {
	return networks[networkId as NetworkId] !== undefined;
};

export const getContractAddress = (
	networkId: number,
	contract: KnownContracts
) => {
	if (!validNetworkId(networkId)) {
		throw new Error(`Unsupported network id: '${networkId}'`);
	}
	return networks[networkId].contracts[contract];
};

export const getTokenFromAddress = (
	networkId: number,
	address: string
): Token => {
	if (!validNetworkId(networkId)) {
		throw new Error(`Unsupported network id: '${networkId}'`);
	}

	for (const token of Object.values(knownTokens)) {
		const tokenAddress = token.addresses[networkId];

		// token might not be supported in the current network
		if (!tokenAddress) {
			continue;
		}

		if (tokenAddress.toLowerCase() === address.toLowerCase()) {
			return {
				address: tokenAddress,
				decimals: token.decimals,
				symbol: token.symbol,
			};
		}
	}

	throw new Error(
		`Couldn't find token with address '${address}' in network '${networkId}'`
	);
};

export const getContractAddressName = (networkId: number) => {
	const networkName = Object.keys(networkIds).find(
		key => (networkIds as any)[key] === networkId
	);
	const networkNameCase =
		networkName &&
		networkName.substr(0, 1).toUpperCase() +
			networkName.substr(1).toLowerCase();
	return networkNameCase;
};

const isNotNull = <T>(x: T | null): x is T => {
	return x !== null;
};

export const getTokensByNetwork = (
	networkId: number,
	lp?: boolean
): Token[] => {
	if (!validNetworkId(networkId)) {
		throw new Error(`Unsupported network id: '${networkId}'`);
	}

	if (!lp) {
		lp = false;
	}

	return Object.values(knownTokens)
		.sort((a, b) => (a.order > b.order ? 1 : -1))
		.filter((kt: KnownTokenData) => {
			return kt.lp === lp;
		})
		.filter((kt: KnownTokenData) => {
			return !kt.disabled
		})
		.map(token => {
			const address = token.addresses[networkId];
			if (address) {
				const { image, image2 } = getImageUrl(address);

				return {
					symbol: token.symbol,
					decimals: token.decimals,
					image,
					image2,
					address,
					isLP: lp,
				};
			}
			return null;
		})
		.filter(isNotNull);
};

export const getEtherscanURL = (network: NetworkId) => {
	if (network === networkIds.KOVAN) {
		return "https://kovan.etherscan.io/";
	}

	return "https://etherscan.io/tx/";
};
