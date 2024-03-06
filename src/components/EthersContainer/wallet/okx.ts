import {message} from 'antd';
import {IsMobile} from "@/utils"

//https://www.okx.com/cn/web3-docs/cn/extension/sdk
export function OkxWallet() {
  return new Promise(async (resolve, reject) => {
    // @ts-ignore
    if (!(window.okxwallet || window.okexchain) || IsMobile()) {
      message.error('Please install Okx Wallet.');
      window.open('https://www.okx.com/cn/web3');
      reject();
      return;
    }
    // @ts-ignore
    if (window.okxwallet || window.okexchain) {
      // @ts-ignore
      let wallet: any = window.okxwallet || window.okexchain
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