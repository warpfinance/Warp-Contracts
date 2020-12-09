import { NetworkCell } from "@material-ui/icons";
import { DEFAULT_TOKEN } from "./constants";
import { getImageUrl, Token } from "./token";

const getEnv = (variable: string, fallback?: string): string => {
	const res = process.env[variable];
	if (res) {
		return res;
	}

	return fallback ? fallback : "";
};

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
	};
}

type KnownContracts = keyof Network["contracts"];

const networks: { [K in NetworkId]: Network } = {
	[networkIds.MAINNET]: {
		label: "Mainnet",
		uri: "https://mainnet.infura.io/v3/f30a8e726a8c4851bfc92a44a04bc889",
		contracts: {
			warpControl: "0xe8fA7010fad24f1aE42D30431BCFD578F59079b5",
		},
	},
	[networkIds.KOVAN]: {
		label: "Kovan",
		uri: "https://kovan.infura.io/v3/f30a8e726a8c4851bfc92a44a04bc889",
		contracts: {
			warpControl: "0xD3C55cB30D1D9c9A879481588C88E5E9ccB04A7B",
		},
	},
	[networkIds.LOCALHOST]: {
		label: "ganache",
		uri: "https://localhost:8545",
		contracts: {
			warpControl: getEnv("REACT_APP_LOCALHOST_CONTROL"),
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
}

export const knownTokens: { [name in KnownToken]: KnownTokenData } = {
	dai: {
		symbol: "DAI",
		decimals: 18,
		addresses: {
			[networkIds.MAINNET]: "0x6b175474e89094c44da98b954eedeac495271d0f",
			[networkIds.KOVAN]: "0x48141e4C9581524AE20845C5681B43F2E99A3e0f",
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
			[networkIds.KOVAN]: "0xF46964c3aD4aEb8BA9304394e0594FF79f9A3BdA",
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
			[networkIds.KOVAN]: "0x74D60183Acd8191660F87E7D7acd2867f65ae19d",
			[networkIds.LOCALHOST]: getEnv("REACT_APP_LOCALHOST_USDT"),
		},
		order: 3,
		lp: false,
	},
	"eth-dai": {
		symbol: "ETH-DAI",
		decimals: 18,
		addresses: {
			[networkIds.MAINNET]: "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11",
			[networkIds.KOVAN]: "0x1dE8E2c7bcee34B35480fF9621F2031C830A6C82",
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
			[networkIds.KOVAN]: "0x9826336Bfee65f3145443a90781B220e83a8026D",
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
			[networkIds.KOVAN]: "0x03f71cdD28840FB422307e77089D599196aa059E",
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
			[networkIds.KOVAN]: "0x4dDEc38c9A30f32bC66790DbBe1F1c7bb4e9F731",
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
