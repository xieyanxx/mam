import {message} from 'antd';
import {IsMobile} from "@/utils"

export function CoinbaseWallet() {
  return new Promise(async (resolve, reject) => {
    // @ts-ignore
    if (!window.ethereum || IsMobile()) {
      message.error('Please install Coinbase.');
      window.open('https://www.coinbase.com/');
      reject();
      return;
    }
    // @ts-ignore
    if (window.ethereum) {
      const {ethereum}: any = window;

      let wallet: any
      //isOkxWallet
      if (ethereum.isCoinbaseWallet) {
        wallet = ethereum
      }
      if (ethereum.providerMap) {
        wallet = ethereum.providerMap.get('CoinbaseWallet')
      }
      try {
        await wallet.request({method: 'eth_requestAccounts',});
        resolve(wallet);
      } catch (error: any) {
        // message.error(error.message);
        reject(error);
      }
    }
  });
}