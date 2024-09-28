# Wallet Screener Application

This is a React-based web application that allows users to connect their Ethereum wallet, fetch the balance of a specific address, and display basic network details (ChainID, Network, and latest Block info). 

## Features:
- **Connect/Disconnect Wallet**: Users can connect their Ethereum wallet (MetaMask) and disconnect it at any time.
- **Address Balance Fetching**: Fetch and display the Ethereum balance of any input Ethereum address.
- **Network Info**: Display information such as ChainID, latest block, and the current network.
- **Automatic Updates**: Listens to account changes, chain changes, and block updates.

## Deployment Link
https://dapp-connect-mzqp.vercel.app/

  
## Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   npm start
   ```

4. The app should now be running at `http://localhost:5134`.

## Usage

### Connecting Your Wallet
- When you open the application, the "Connect Wallet" button will appear at the top-right corner.
- Click on the button to connect your Ethereum wallet (MetaMask).
- Once connected, you can view your wallet information and screen for other addresses' balances.

### Entering an Ethereum Address
- Input any valid Ethereum address in the text field provided.
- Click the "Submit" button to fetch the ETH balance and network details for that address.

### Disconnecting the Wallet
- After connecting, a "Disconnect Wallet" button will replace the "Connect Wallet" button.
- Click the button to disconnect your wallet

## Dependencies

- **React**
- **React Toastify**
- **MetaMask**
- **Tailwind CSS**

## MetaMask Integration

The app uses `window.ethereum` from the MetaMask provider to perform various Ethereum-related actions:
- **eth_requestAccounts**: Requests user accounts to connect to the app.
- **eth_chainId**: Retrieves the chain ID of the connected network.
- **eth_getBalance**: Retrieves the balance of the specified Ethereum address.
- **eth_subscribe**: Subscribes to new block updates.

## Handling Chain and Account Changes

The application listens for account and chain changes using the `window.ethereum.on` event listener:
- **accountsChanged**: Updates the state if the user switches Ethereum accounts.
- **chainChanged**: Refreshes chain details and latest block info when the user switches the network.
  

## License
This project is licensed under the MIT License.
