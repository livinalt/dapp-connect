import React from "react";

interface WalletButtonProps {
  handleConnect: (walletDetails: EIP6963ProviderDetail) => void;
  walletDetails: EIP6963ProviderDetail | undefined;
  isConnected?: boolean;
}

const WalletButton: React.FC<WalletButtonProps> = ({ handleConnect, walletDetails, isConnected = false }) => {

    if (!walletDetails) {
    return <button disabled className="p-2 bg-gray-300 rounded">No Wallet Details Available</button>;
  }

  return (
    <button
      onClick={() => handleConnect(walletDetails)}
      className={`p-2 rounded ${isConnected ? "bg-green-500" : "bg-blue-500"} text-white`}
    >
      <span>{walletDetails.info.name}</span>
      {isConnected && <span className="ml-2">(Connected)</span>}
    </button>
  );
};

const handleConnect = (walletDetails: EIP6963ProviderDetail): void => {
  console.log("Connecting to wallet:", walletDetails.info.name);
};


<WalletButton
  handleConnect={handleConnect}
  walletDetails={}
  isConnected={false}
/>;

export default WalletButton;
