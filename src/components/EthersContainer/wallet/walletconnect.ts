import { WALLETCONNECT_RPC_NODE } from "../constant";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import QRCodeModal from "@walletconnect/qrcode-modal";
export function WalletConnect() {
  return new Promise(async (resolve, reject) => {
    const provider = await EthereumProvider.init({
      projectId: "07976a1d7be7cc4477daef9502263f3b", // required 需要自己去申请免费的，可用于多个项目
      optionalChains: [1, 97,713715],
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
