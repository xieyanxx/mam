import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ethers } from "ethers";
import { EIP_EVENTS } from "./constant";
import { CoinbaseWallet } from "@/components/EthersContainer/wallet/coinbase";
import { WalletConnect } from "@/components/EthersContainer/wallet/walletconnect";
import { MetaMaskWallet } from "@/components/EthersContainer/wallet/metamask";
import { OkxWallet } from "@/components/EthersContainer/wallet/okx";
import { clearStorage } from "@/utils";

export enum WalletType {
  MetaMaskWallet = "MetaMaskWallet",
  OkxWallet = "OkxWallet",
  WalletConnect = "WalletConnect",
  CoinbaseWallet = "CoinbaseWallet",
}

interface EthersContextType {
  initEthers: (wallet: any, walletType: WalletType) => Promise<any>;
  resetEthers: () => void;
  walletType?: WalletType;
  provider?: any;
  signer?: any;
  wallet?: any;
  address?: string;
  chainId?: number;
  isLoad?: boolean;
}

export const EthersContext = React.createContext<EthersContextType>(
  null as any
);

const EthersContainer = React.memo((props: any) => {
  const { children } = props;
  const [walletType, setWalletType] = useState<WalletType>();
  const [provider, setProvider] = useState<any>();
  const [signer, setSigner] = useState<any>();
  const [wallet, setWallet] = useState<any>();
  const [address, setAddress] = useState<string>("");
  const [chainId, setChainId] = useState<number>(-1);
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const eventsCleanerRef = useRef<Function>(null as any);

  const resetEthers = useCallback(async () => {
    wallet?.disconnect?.();
    wallet?._handleDisconnect?.();
    eventsCleanerRef?.current?.();
    setWalletType(undefined);
    setProvider(null as any);
    setSigner(null);
    setWallet(null);
    setAddress("");
    setChainId(-1);
    clearStorage();
    // 主动断开wallet connect连接，metamask没有提供主动断开连接的api
  }, [eventsCleanerRef, wallet]);

  /**
   * @description 注册provider的事件，如关闭连接，切换网络等
   */
  const subscribeWallet = useCallback(
    (connector: any) => {
      // 钱包建立连接
      const onConnect = (params: any) => {
        console.log("钱包建立连接", params);
      };
      // 钱包断开连接
      const onDisconnect = (error: any) => {
        console.log("钱包断开连接", error);
        sessionStorage.setItem("address", "");
        setAddress("");
        if (error === 1000) {
          // wallet connect主动断开连接
          resetEthers();
        }
      };
      // 钱包切换账户
      const onAccountsChanged = async (accounts: string[]) => {
        console.log("钱包切换账户", accounts);
        sessionStorage.setItem("address", accounts[0] ?? "");
        setAddress(accounts[0] ?? "");
      };
      // 钱包切换链
      const onChainChanged = async (chainId: string) => {
        console.log("钱包切换链", chainId, Number.parseInt(chainId, 16));
        setChainId(Number.parseInt(chainId, 16));
        console.log(chainId, "===>", chainId);
        sessionStorage.setItem(
          "chainId",
          Number.parseInt(chainId, 16).toString()
        );
        if (chainId !== "0xae3f3") {
           await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xae3f3" }],
          });
        }
      };
      // 钱包推送消息
      const onMessage = (...params: any[]) => {
        console.log("钱包推送消息", params);
      };

      connector.on(EIP_EVENTS.CONNECT, onConnect);
      connector.on(EIP_EVENTS.DISCONNECT, onDisconnect);
      connector.on(EIP_EVENTS.ACCOUNTS_CHANGED, onAccountsChanged);
      connector.on(EIP_EVENTS.CHAIN_CHANGED, onChainChanged);
      connector.on(EIP_EVENTS.MESSAGE, onMessage);
      // connector.on(EIP_EVENTS.SESSIONUPDATE,onSessionUpdate)
      return () => {
        connector.removeListener(EIP_EVENTS.CONNECT, onConnect);
        connector.removeListener(EIP_EVENTS.DISCONNECT, onDisconnect);
        connector.removeListener(
          EIP_EVENTS.ACCOUNTS_CHANGED,
          onAccountsChanged
        );
        connector.removeListener(EIP_EVENTS.CHAIN_CHANGED, onChainChanged);
        connector.removeListener(EIP_EVENTS.MESSAGE, onMessage);
      };
    },
    [resetEthers]
  );

  const initEthers = (wallet: any, walletType: WalletType) => {
    return new Promise(async (resolve) => {
      eventsCleanerRef.current = subscribeWallet(wallet);
      const provider = new ethers.providers.Web3Provider(wallet);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      let res2: any = await provider.getNetwork();
      setChainId(res2.chainId);
      sessionStorage.setItem("chainId", res2.chainId);
      setSigner(signer);
      setWalletType(walletType);
      setProvider(provider);
      setWallet(wallet);
      setAddress(address);
      sessionStorage.setItem("address", address);
      sessionStorage.setItem("walletType", walletType);
      resolve(true);
    });
  };

  async function initWallet() {
    let addressStr = sessionStorage.getItem("address") ?? "";
    if (addressStr) {
      setAddress(addressStr);
      setIsLoad(true);
      let walletType: WalletType = (sessionStorage.getItem("walletType") ??
        "") as WalletType;
      if (walletType) {
        setWalletType(walletType);
        let wallet = null;
        switch (walletType) {
          case WalletType.MetaMaskWallet:
            wallet = await MetaMaskWallet();
            break;
          case WalletType.WalletConnect:
            wallet = await WalletConnect();
            break;
          case WalletType.OkxWallet:
            wallet = await OkxWallet();
            break;
          case WalletType.CoinbaseWallet:
            wallet = await CoinbaseWallet();
            break;
        }
        if (wallet) {
          await initEthers(wallet, walletType);
        }
      }
    } else {
      setIsLoad(true);
    }
  }

  useEffect(() => {
    initWallet();
  }, []);

  const memoCtx = useMemo(() => {
    return {
      isLoad,
      initEthers,
      resetEthers,
      walletType,
      provider,
      signer,
      wallet,
      address,
      chainId,
    };
  }, [
    isLoad,
    initEthers,
    address,
    chainId,
    wallet,
    resetEthers,
    provider,
    signer,
    walletType,
  ]);

  return (
    <EthersContext.Provider value={memoCtx}>{children}</EthersContext.Provider>
  );
});

export default EthersContainer;

export const getContract = async (
  address: string,
  abi: any,
  walletType: string
) => {
  let provider: any;
  switch (walletType) {
    case WalletType.MetaMaskWallet:
      provider = await MetaMaskWallet();
      break;
    case WalletType.WalletConnect:
      provider = await WalletConnect();
      break;
    case WalletType.OkxWallet:
      provider = await OkxWallet();
      break;
    case WalletType.CoinbaseWallet:
      provider = await CoinbaseWallet();
      break;
    default: {
      provider = await MetaMaskWallet();
      break;
    }
  }
  const _ethers = new ethers.providers.Web3Provider(provider);
  const signer = _ethers.getSigner();
  return new ethers.Contract(address, abi, signer);
};

// export

//获取代币未转换的余额
export const balanceOf = async (
  ContractAddress: string, //合约地址
  abi: any,
  walletType: string,
  userAddress: string, //用户钱包地址
  decimals?: number //转换精度
) => {
  var contract = await getContract(ContractAddress, abi, walletType);
  var transaction = await contract.balanceOf(userAddress);
  return formWei(transaction, decimals);
};
//获取平台币的余额
export const getBalance = async (
  walletType: string,
  userAddress: string //用户钱包地址
) => {
  let provider: any;
  switch (walletType) {
    case WalletType.MetaMaskWallet:
      provider = await MetaMaskWallet();
      break;
    case WalletType.WalletConnect:
      provider = await WalletConnect();
      break;
    case WalletType.OkxWallet:
      provider = await OkxWallet();
      break;
    case WalletType.CoinbaseWallet:
      provider = await CoinbaseWallet();
      break;
    default: {
      provider = await MetaMaskWallet();
      break;
    }
  }
  const _ethers = new ethers.providers.Web3Provider(provider);
  var balance = await _ethers.getBalance(userAddress);
  const gasFree = await _ethers.getGasPrice();
  let balanceVal = formWei(balance);
  let gasFreeVal = formWei(gasFree);
  return { balanceVal, gasFreeVal };
};

//获取授权值
export const getAllowance = async (
  tokenAddress: string,
  userAddress: string,
  walletType: string,
  tokenAbi: any,
  contractAddress: string
) => {
  //判断认证状态
  const contract = await getContract(tokenAddress, tokenAbi, walletType);
  var allowed = await contract.allowance(userAddress, contractAddress);
  return allowed ? formWei(allowed) : "0";
};

//获取精度
export const getDecimals = async (
  tokenAddress: string,
  walletType: string,
  tokenAbi: any
) => {
  //判断认证状态
  const contract = await getContract(tokenAddress, tokenAbi, walletType);
  var decimals = await contract.decimals();
  return decimals;
};

// 大数转数值
export const formWei = (val: any, num?: number) => {
  return ethers.utils.formatUnits(val, num);
};
export const toWei = (val: any, num: number | string) => {
  return ethers.utils.parseUnits(val, num).toString();
};

export const formTo = (val: any) => {
  let value = val.toString();
  return ethers.BigNumber.from(value);
};
//数值转大数
export const parseEther = (val: string) => {
  return ethers.utils.parseEther(val);
};
