import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

declare global {
  interface Window {
    ethereum: any;
  }
}

const AddressForm = () => {
  const [chainId, setChainId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [block, setBlock] = useState<any>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const [inputAddress, setInputAddress] = useState<string>('');
  const [balance, setBalance] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccounts(accounts);
      setIsConnected(true);
      fetchChainId();
      fetchLatestBlock();
      subscribeToNewBlocks();
    } catch (error: any) {
      console.error('Error connecting wallet:', error.message);
    }
  };

  const disconnectWallet = () => {
    setAccounts([]);
    setChainId(null);
    setBlock(null);
    setIsConnected(false);

    if (subscriptionId) {
      window.ethereum.request({
        method: 'eth_unsubscribe',
        params: [subscriptionId],
      });
      setSubscriptionId(null);
    }
  };

  const fetchChainId = async () => {
    try {
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });
      setChainId(chainId);
    } catch (error: any) {
      console.error(`Error fetching chainId: ${error.code}: ${error.message}`);
    }
  };

  const fetchLatestBlock = async () => {
    try {
      const block = await window.ethereum.request({
        method: 'eth_getBlockByNumber',
        params: ['latest', true],
      });
      setBlock(block);
    } catch (error: any) {
      console.error(
        `Error fetching last block: ${error.message}. Code: ${error.code}. Data: ${error.data}`
      );
    }
  };

  const fetchBalance = async (address: string) => {
    try {
      const balanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });
      const balanceInEth = (parseInt(balanceHex, 16) / 10 ** 18).toFixed(4);
      setBalance(balanceInEth);
    } catch (error: any) {
      console.error(`Error fetching balance: ${error.message}`);
      setBalance(null); // Set balance to null if an error occurs
    }
  };

  const handleAccountsChanged = useCallback((newAccounts: string[]) => {
    setAccounts(newAccounts);
    if (newAccounts.length === 0) {
      disconnectWallet();
    } else {
      fetchBalance(newAccounts[0]);
    }
  }, []);

  const handleChainChanged = useCallback((newChainId: string) => {
    setChainId(newChainId);
    fetchLatestBlock();
  }, []);

  const handleDisconnect = useCallback(() => {
    disconnectWallet();
  }, []);

  const subscribeToNewBlocks = async () => {
    try {
      const subscriptionId = await window.ethereum.request({
        method: 'eth_subscribe',
        params: ['newHeads'],
      });
      setSubscriptionId(subscriptionId);

      window.ethereum.on('message', (message: any) => {
        if (message.type === 'eth_subscription' && message.data.subscription === subscriptionId) {
          if ('result' in message.data && typeof message.data.result === 'object') {
            const newBlock = message.data.result;
            setBlock(newBlock);
          }
        }
      });
    } catch (error: any) {
      console.error(`Error subscribing to new blocks: ${error.message}`);
    }
  };

  const handleGetDetails = async () => {
    await fetchBalance(inputAddress);
    const networkId = await window.ethereum.request({ method: 'net_version' });
    setNetwork(networkId);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      };
    } else {
      toast.error('Ethereum provider not found. Please install MetaMask.');
    }
  }, [handleAccountsChanged, handleChainChanged, handleDisconnect]);

  return (
    <div className="flex justify-center items-center h-screen bg-white relative">
      {!isConnected ? (
        <button
          onClick={connectWallet}
          className="absolute top-4 right-4 bg-red-700 text-white p-2 rounded-xl"
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <button
            onClick={disconnectWallet}
            className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-lg"
          >
            Disconnect Wallet
          </button>

          <div className="flex flex-col bg-gray-800 p-6 md:w-1/2 shadow-lg rounded-lg">
            <div className="mb-4 py-8">
              <label className="text-gray-100 text-2xl font-bold mb-2">Wallet Screener</label>
              <input
                type="text"
                placeholder="Enter the address"
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
                className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={handleGetDetails}
                className="bg-red-700 w-full mt-2 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
              >
                Submit
              </button>
            </div>

            <div>
              <p className="text-gray-100 font-medium">
                Address: <span className="text-white">{inputAddress}</span>
              </p>
              <p className="text-gray-100 font-medium">
                Balance: <span className="text-white">{balance ? `${balance} ETH` : 'not available'}</span>
              </p>
              <p className="text-gray-100 font-medium">
                Network: <span className="text-white">{network || 'not available'}</span>
              </p>
              <p className="text-gray-100 font-medium">
                ChainID: <span className="text-white">{chainId || 'not available'}</span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AddressForm;
