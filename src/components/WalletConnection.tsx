import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

declare global {
  interface Window {
    ethereum: any;
  }
}

const WalletConnection: React.FC = () => {
  const [chainId, setChainId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [block, setBlock] = useState<any>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccounts(accounts);
      setIsConnected(true);
      console.log('Connected accounts:', accounts);

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

    console.log('Wallet disconnected');
  };

  const fetchChainId = async () => {
    try {
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });
      setChainId(chainId);
      console.log(`Chain ID (Hex): ${chainId}`);
      console.log(`Chain ID (Dec): ${parseInt(chainId, 16)}`);
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
      console.log(`Latest Block ${block.number}:`, block);
    } catch (error: any) {
      console.error(
        `Error fetching last block: ${error.message}. Code: ${error.code}. Data: ${error.data}`
      );
    }
  };

  const handleAccountsChanged = useCallback((newAccounts: string[]) => {
    setAccounts(newAccounts);
    console.log('Updated Accounts:', newAccounts);
    if (newAccounts.length === 0) {
      disconnectWallet();
    }
  }, []);

  const handleChainChanged = useCallback((newChainId: string) => {
    // Prevent reload on initial connection but only reload if the user manually switches chains
    if (chainId && newChainId !== chainId) {
      console.log('Chain changed to:', newChainId);
      window.location.reload(); // Only reload when the chain has actually changed
    }
    setChainId(newChainId);
    fetchLatestBlock(); // Optionally fetch the latest block after chain change
  }, [chainId]); // Only reload if chain ID changes after initial load

  const handleDisconnect = useCallback((code: number, reason: string) => {
    console.log(`Ethereum connection closed: ${reason}. Code: ${code}`);
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
            console.log(`New Block ${newBlock.number}:`, newBlock);
            setBlock(newBlock);
          } else {
            console.error(`Error receiving block: ${message.data.result}`);
          }
        }
      });
    } catch (error: any) {
      console.error(`Error subscribing to new blocks: ${error.message}`);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged); // Listen for chain changes
      window.ethereum.on('disconnect', handleDisconnect);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged); // Remove listener on cleanup
        window.ethereum.removeListener('disconnect', handleDisconnect);
      };
    } else {
      toast.error('Ethereum provider not found. Please install MetaMask.');
      console.log('Ethereum provider not found. Please install MetaMask.');
    }
  }, [handleAccountsChanged, handleChainChanged, handleDisconnect]);

  return (
    <div className='mt-20 mb-20'>
      <h1>Wallet Connection</h1>

      {isConnected ? (
        <button onClick={disconnectWallet} className='text-white bg-red-500 p-2 rounded'>
          Disconnect Wallet
        </button>
      ) : (
        <button onClick={connectWallet} className='text-white bg-blue-500 p-2 rounded'>
          Connect Wallet
        </button>
      )}

      <div className='flex flex-col justify-start mb-20'>
        <p className='text-lg'>Chain ID: {chainId}</p>
        <p className='text-lg'>Accounts: {accounts.join(', ') || 'Not connected'}</p>
        {block && (
          <div className='text-left'>
            <h3>Latest Block:</h3>
            <p>Number: {block.number}</p>
            <p>Hash: {block.hash}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletConnection;
