export const formatBalance = (rawBalance: string) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2)
  return balance
}

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex)
  return chainIdNum
}

export const formatAddress = (addr: string) => {
  const upperAfterLastTwo = addr.slice(0, 2) + addr.slice(2)
  return `${upperAfterLastTwo.substring(0, 5)}...${upperAfterLastTwo.substring(39)}`
}

export enum EIP6963EventNames {
    Announce = "eip6963:announceProvider",
    Request = "eip6963:requestProvider",
}

export enum SupportedChainId {
    SEPOLIA = 11155111,
    ETHEREUM = 1,
}

export const networkInfoMap = {
    [SupportedChainId.SEPOLIA]: {
        chainId: `0x${SupportedChainId.SEPOLIA.toString(16)}`,
        chainName: "Sepolia test network",
        rpcUrls: ["https://sepolia.infura.io/v3/"],
        blockExplorerUrls: ["https://sepolia.etherscan.io"],
        nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
        },
    },
    [SupportedChainId.ETHEREUM]: {
        chainId: `0x${SupportedChainId.ETHEREUM.toString(16)}`,
        chainName: "Nahmii3 Test Network",
        rpcUrls: ["https://etherscan.io/"],
        blockExplorerUrls: ["https://explorer.etherscan.io/"],
        nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
        },
    },
};

export function isPreviouslyConnectedProvider(providerRDNS: string): boolean {
    return (
        localStorage.getItem(
            LOCAL_STORAGE_KEYS.PREVIOUSLY_CONNECTED_PROVIDER_RDNS
        ) === providerRDNS
    );
}

/**
 * @title isSupportedChain
 * @dev Function to check if a chain is supported.
 * @param chainId The chain ID to check.
 * @returns True if the chain ID is supported, false otherwise.
 */
export function isSupportedChain(
    chainId: number | null | undefined
): chainId is SupportedChainId {
    if (!chainId) return false;
    return !!SupportedChainId[chainId];
}

/**
 * @title switchChain
 * @dev Function to switch to a supported chain.
 * @param chain The chain ID to switch to.
 * @param provider The EIP1193Provider instance.
 */


