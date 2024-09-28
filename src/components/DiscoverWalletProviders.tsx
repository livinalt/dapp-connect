// import { useState } from "react"
// import { useSyncProviders } from "../hooks/useSyncProviders"
// import { formatAddress, formatBalance } from "../utils/index"

// export const DiscoverWalletProviders = () => {
//   const [selectedWallet, setSelectedWallet] = useState<EIP6963ProviderDetail>()
//   const [userAccount, setUserAccount] = useState<string>("")
//   const providers = useSyncProviders()

//   const handleConnect = async (providerWithInfo: EIP6963ProviderDetail) => {
//     try {
//       const accounts = await providerWithInfo.provider.request({
//         method: "eth_requestAccounts"
//       })

//       setSelectedWallet(providerWithInfo)
//       setUserAccount(accounts?.[0])
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   return (
//     <>    
//     <div className="p-6 bg-gray-400 flex justify-between gap-4">
//       <div>
//         <h2 className="text-xl font-semibold mb-4 text-gray-700">Wallets Detected:</h2>
//       <div className="flex justify-center gap-6">
//         {
//           providers.length > 0 ? providers?.map((provider: EIP6963ProviderDetail) => (
//             <button
//               key={provider.info.uuid}
//               onClick={() => handleConnect(provider)}
//               className="flex items-center p-2 bg-white rounded-lg"
//             >
//               <img src={provider.info.icon} alt={provider.info.name} className="w-6 h-6 mb-2 space-x-4" />
//               <div className="text-lg font-medium text-gray-800">{provider.info.name}</div>
//             </button>
//           )) :
//             <div className="text-gray-500">No Wallet Provider</div>
//         }
//       </div>
//       </div>

//         <div>
//           <h2 className="text-xl font-semibold text-gray-700">
//         {userAccount ? "Wallet Selected" : "No Wallet Selected"}
//       </h2>
//       {userAccount && (
//         <div className="flex items-center space-x-4 mt-4">
//           <img
//             src={selectedWallet?.info.icon || ""}
//             alt={selectedWallet?.info.name || ""}
//             alt={selectedWallet?.info.rdns || ""}
//             className="w-12 h-12 rounded-full"
//           />
//           <div className="text-gray-700">
//             <div className="text-xl font-semibold">{selectedWallet?.info.name}</div>
//             <div className="text-sm text-gray-500">Address: {formatAddress(userAccount)}</div>
//             <div className="text-sm text-gray-500">Balance: {formatBalance(userAccount)}</div>
//           </div>
//         </div>
//       )}
//         </div>
//     </div>
//         </>
//   )
// }
    
    
