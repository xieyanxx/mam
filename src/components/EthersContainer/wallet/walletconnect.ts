import WalletConnectProvider from '@walletconnect/web3-provider';
import {WALLETCONNECT_RPC_NODE} from '../constant';

export function WalletConnect() {
  return new Promise(async (resolve, reject) => {
    const provider = new WalletConnectProvider({
      rpc: WALLETCONNECT_RPC_NODE,
    });

    try {
      await provider.enable();
      resolve(provider);
    } catch (error) {
      reject(error);
    }
  });
}

