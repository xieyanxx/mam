import React, { memo, useCallback, useState } from "react";
import styles from "./index.less";
import cx from "classnames";
import { Button, Input, Modal, Progress, Radio, Slider } from "antd";
import close from "@/assets/logo/close.png";
import icon1 from "@/assets/logo/icon1.png";
import { formatAmount1, isplatformCoin } from "@/utils";
import { getContract, toWei } from "@/components/EthersContainer";
import {
  ChainToken,
  routeContractAddress,
} from "@/components/EthersContainer/address";
import { routeAbi } from "@/components/EthersContainer/abj";

function RemoveLiquidity({
  handleCancel,
  isModalOpen,
  removeData,
  settingData,
}: {
  handleCancel: () => void;
  isModalOpen: boolean;
  removeData: any;
  settingData: any;
}) {
  const [walletType] = useState<string>(
    sessionStorage.getItem("walletType") || ""
  );
  const [address] = useState<string>(sessionStorage.getItem("address") || "");
  const [selectNum, setSelectNum] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(false);

  const changeNum = useCallback((e: any) => {
    setSelectNum(e.target.value);
  }, []);
  const removeSubmit = async () => {
    setLoading(true);
    const contract = await getContract(
      routeContractAddress,
      routeAbi,
      walletType
    );
    if (
      !isplatformCoin(removeData.token1) &&
      !isplatformCoin(removeData.token2)
    ) {
      let tokenA = removeData.token1;
      let tokenB = removeData.token2;
      let removeNum = (removeData.amount * (selectNum / 100)).toString();
      let uit = toWei(removeNum, 18);
      let time = (
        Math.floor(Date.now() / 1000) +
        settingData.time * 60
      ).toString();
      let status1 = await contract
        .removeLiquidity(tokenA, tokenB, uit, 0, 0, address, time)
        .catch(() => {
          setLoading(false);
        });
      let transaction = await status1?.wait();
      if (transaction) {
        setLoading(false);
        setSelectNum(50);
        handleCancel();
      }
    } else {
      let tokenA = "";
      if (isplatformCoin(removeData.token1)) {
        tokenA = removeData.token2;
      } else {
        tokenA = removeData.token1;
      }
      let removeNum = (removeData.amount * (selectNum / 100)).toString();
      let uit = toWei(removeNum, 18);
      let time = (
        Math.floor(Date.now() / 1000) +
        settingData.time * 60
      ).toString();
      let status1 = await contract
        .removeLiquidityETH(tokenA, uit, 0, 0, address, time)
        .catch(() => {
          setLoading(false);
        });
      let transaction = await status1?.wait();
      if (transaction) {
        setLoading(false);
        setSelectNum(50);
        handleCancel();
      }
    }
  };
  return (
    <div className={styles.wrap}>
      <Modal
        title=""
        open={isModalOpen}
        footer={""}
        closable={false}
        onCancel={handleCancel}
        wrapClassName={styles.modal_wrap}
        width={"95%"}
      >
        <div className={styles.content_warp}>
          <div className={styles.title_wrap}>
            <p>Remove Liquidity</p>
            <img
              src={close}
              alt=""
              onClick={() => {
                setLoading(false);
                setSelectNum(50);
                handleCancel();
              }}
            />
          </div>
          <div className={styles.content}>
            <div className={styles.title}>
              <img
                src={
                  ChainToken.filter((i) => i.name == removeData.tokenName1)[0]
                    ?.src
                }
                alt=""
              />
              <img
                src={
                  ChainToken.filter((i) => i.name == removeData.tokenName2)[0]
                    ?.src
                }
                alt=""
              />
              <p>
                {removeData.tokenName1}-{removeData.tokenName2}{" "}
              </p>
            </div>
            <div className={styles.balance_text}>
              Balance: {formatAmount1(removeData.amount)}
            </div>
            <Radio.Group
              defaultValue={50}
              buttonStyle="solid"
              className={styles.radio_wrap}
            >
              <Radio.Button value={25}>25%</Radio.Button>
              <Radio.Button value={50}>50%</Radio.Button>
              <Radio.Button value={75}>75%</Radio.Button>
              <Radio.Button value={100}>Max</Radio.Button>
            </Radio.Group>
            <Slider
              value={selectNum}
              tooltip={{
                open: true,
                arrow: false,
                placement: "bottom",
                color: "none",
                formatter: (value: any) => `${value}%`,
              }}
              onChange={(value) => setSelectNum(value)}
              className={styles.slider_wrap}
            />
            <div className={styles.btn_wrap}>
              <Button
                loading={loading}
                onClick={removeSubmit}
                className={styles.btn}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default memo(RemoveLiquidity);
