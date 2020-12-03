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
			warpControl: "",
		},
	},
	[networkIds.KOVAN]: {
		label: "Kovan",
		uri: "https://kovan.infura.io/v3/f30a8e726a8c4851bfc92a44a04bc889",
		contracts: {
			warpControl: "0x5bB1dc487cB0e5891781A3e610100C66Fa932636",
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
			[networkIds.KOVAN]: "0x45f873Ed62f79441DaB1825Bf6ffa777f5e459Ff",
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
			[networkIds.KOVAN]: "0xE6658C25062B42742dCaB46cEF6A5eC50D012472",
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
			[networkIds.KOVAN]: "0xfb7ad8AfC2c53AE8f0DAb58EEDd4FEE33D2BFe8a",
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
			[networkIds.KOVAN]: "0xA6a1aa0d43c6fAaD3c94b2d0c05d6e612a98fc91",
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
			[networkIds.KOVAN]: "0xdd2a1E1cc61E7673F359b054B317D19Af46524eA",
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
			[networkIds.KOVAN]: "0xC1851fd8760338c07126705b30d9b52c157e072a",
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
			[networkIds.KOVAN]: "0x3ec6Ad9baDb786EC94581502FD35EE4edE7C243E",
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
