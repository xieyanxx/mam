// import WalletConnectProvider from "@walletconnect/web3-provider";
// import { WALLETCONNECT_RPC_NODE } from "../constant";

// export function WalletConnect() {
//   return new Promise(async (resolve, reject) => {
//     const provider = new WalletConnectProvider({
//       rpc: WALLETCONNECT_RPC_NODE,
//     });

//     try {
//       await provider.enable();
//       resolve(provider);
//     } catch (error) {
//       reject(error);
//     }
//   });
// }

import WalletConnectProvider from "@walletconnect/web3-provider";
import { WALLETCONNECT_RPC_NODE } from "../constant";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import QRCodeModal from "@walletconnect/qrcode-modal";
export function WalletConnect() {
  return new Promise(async (resolve, reject) => {
    // const provider = new WalletConnectProvider({
    //   rpc: WALLETCONNECT_RPC_NODE,
    // });
    const provider = await EthereumProvider.init({
      projectId: "07976a1d7be7cc4477daef9502263f3b", // required 需要自己去申请免费的，可用于多个项目
      optionalChains: [1, 97],
      showQrModal: true,
      rpcMap: WALLETCONNECT_RPC_NODE,
      qrModalOptions: {
        themeMode: "light",
      },
    });

    try {
      await provider.connect();
      resolve(provider);
    } catch (error) {
      reject(error);
    }
  });
}
// import WalletConnect1 from "@walletconnect/client";
// import QRCodeModal from "@walletconnect/qrcode-modal";
// export function WalletConnect() {
//   return new Promise(async (resolve, reject) => {
//     const connector = new WalletConnect1({
//       bridge: "https://bridge.walletconnect.org", // 使用WalletConnect提供的默认桥接服务
//       qrcodeModal: QRCodeModal,
//     });
//     try {
//       let aaa = await connector.connect();
//       // const result = await provider.request({ method: "eth_requestAccounts" });
//       console.log(121212121, aaa, "===>");
//       // resolve(provider);
//     } catch (error) {
//       reject(error);
//     }
//   });
// }
