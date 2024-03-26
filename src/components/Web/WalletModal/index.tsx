import close from "@/assets/logo/close.png";
import coinbase from "@/assets/logo/coinbase.png";
import math from "@/assets/logo/math.png";
import metamask from "@/assets/logo/metamask1.png";
import token from "@/assets/logo/token.png";
import trust from "@/assets/logo/trust.png";
import wallet from "@/assets/logo/wallet.png";
import { EthersContext, WalletType } from "@/components/EthersContainer";
import { CoinbaseWallet } from "@/components/EthersContainer/wallet/coinbase";
import { MetaMaskWallet } from "@/components/EthersContainer/wallet/metamask";
import { WalletConnect } from "@/components/EthersContainer/wallet/walletconnect";
import { getSubStr } from "@/utils";
import { useGetState } from "ahooks";
import { Button, Modal, message } from "antd";
import cx from "classnames";
import { memo, useContext, useEffect, useState } from "react";
import styles from "./index.less";

function WalletModal({ isbig }: { isbig?: boolean }) {
  const [connecting, setConnecting, getConnecting] =
    useGetState<boolean>(false);
  let ethersData = useContext(EthersContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 打开弹窗
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const connect = async (getWallet: any, walletType1: WalletType) => {
    // @ts-ignore
    if (getConnecting()) return;
    setConnecting(true);
    try {
      const wallet = await getWallet();
      await ethersData?.initEthers(wallet, walletType1);
      handleCancel();
    } catch (error: any) {
      if (error?.code === -32002) {
        message.error(error.message);
      } else {
        message.warning("pleaseConnectWallet");
      }
    } finally {
      setConnecting(false);
    }
  };
  useEffect(() => {
    if (ethersData?.address) {
      if (ethersData?.chainId !== 713715 && ethersData?.chainId !== null) {
        window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xae3f3" }],
        });
      }
    }
  }, [ethersData?.chainId]);
  return (
    <div className={styles.wrap}>
      {ethersData?.address ? (
        <div className={isbig ? styles.btn : styles.connect_btn}>
          {getSubStr(ethersData?.address)}
        </div>
      ) : (
        <Button
          type="primary"
          className={isbig ? styles.btn : styles.connect_btn}
          onClick={showModal}
        >
          Connect Wallet
        </Button>
      )}

      <Modal
        title=""
        open={isModalOpen}
        footer={""}
        closable={false}
        onCancel={handleCancel}
        wrapClassName={styles.modal_wrap}
        width={839}
      >
        <div className={styles.content_warp}>
          <div className={styles.title_wrap}>
            <p>Connect Wallet</p>
            <img src={close} alt="" onClick={handleCancel} />
          </div>
          <div className={styles.wallet_wrap}>
            <div
              className={styles.item}
              onClick={() => connect(MetaMaskWallet, WalletType.MetaMaskWallet)}
            >
              <img src={metamask} alt="" />
              <p>Metamask</p>
            </div>
            <div
              className={cx(styles.item, styles.item_m)}
              onClick={() => {
                connect(WalletConnect, WalletType.WalletConnect),
                  handleCancel();
              }}
            >
              <img src={wallet} alt="" />
              <p>Wallet Connect</p>
            </div>
            <div className={cx(styles.item, styles.item_m)}>
              <img src={token} alt="" />
              <p>Token Pocket</p>
            </div>
            <div
              className={cx(styles.item, styles.item_m)}
              onClick={() => connect(CoinbaseWallet, WalletType.CoinbaseWallet)}
            >
              <img src={coinbase} alt="" />
              <p>Coinbase Wallet</p>
            </div>
            <div className={cx(styles.item, styles.item_m)}>
              <img src={trust} alt="" />
              <p>Trust Wallet</p>
            </div>
            <div className={cx(styles.item, styles.item_l)}>
              <img src={math} alt="" />
              <p>Math Wallet</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default memo(WalletModal);
