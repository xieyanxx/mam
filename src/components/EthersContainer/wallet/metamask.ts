import {message} from 'antd';
import {IsMobile} from "@/utils"

export function MetaMaskWallet() {
  return new Promise(async (resolve, reject) => {
    try {
      // @ts-ignore
      if (!window.ethereum && !IsMobile()) {
        message.error('Please install Metamask.');
        window.open('https://metamask.io/');
        reject('Please install Metamask.');
        return;
      }
      // @ts-ignore
      if (window.ethereum) {
        const {ethereum}: any = window;

        let wallet: any
        if (ethereum.isMetaMask) {
          wallet = ethereum
        }
        if (ethereum.providerMap) {
          wallet = ethereum.providerMap.get('MetaMask')
        }
        await wallet.request({method: 'eth_requestAccounts',});
        resolve(wallet);
      }
    } catch (error: any) {
      // message.error(error.message);
      reject(error);
    }
  });
}