import React, { memo, useCallback, useState } from "react";
import styles from "./index.less";
import cx from "classnames";
import { Button, Input, Modal, Radio, message } from "antd";
import close from "@/assets/logo/close.png";
import icon1 from "@/assets/logo/icon1.png";
import { formatAmount1, isplatformCoin } from "@/utils";
import { getContract, toWei } from "@/components/EthersContainer";
import { routeContractAddress } from "@/components/EthersContainer/address";
import { routeAbi } from "@/components/EthersContainer/abj";

function AddLiquidity({
  handleCancel,
  isModalOpen,
  formData,
  toData,
  settingData,
}: {
  handleCancel: () => void;
  isModalOpen: boolean;
  formData: any;
  toData: any;
  settingData: any;
}) {
  const [walletType] = useState<string>(
    sessionStorage.getItem("walletType") || ""
  );
  const [address] = useState<string>(sessionStorage.getItem("address") || "");
  const [loading, setLoading] = useState(false);
  const getValue = () => {
    if (isModalOpen) {
      let formTo = (Number(toData.amount) / Number(formData.amount)).toString();
      let toForm = (Number(formData.amount) / Number(toData.amount)).toString();
      return { formTo, toForm };
    }
  };
  const exchangeMethod = async (type: number) => {
    setLoading(true);
    const contract = await getContract(
      routeContractAddress,
      routeAbi,
      walletType
    );
    //普通代币之间的添加
    if (type == 1) {
      let tokenA = formData.address;
      let tokenB = toData.address;
      let amountADesired = toWei(formData.amount, formData.decimal);
      let amountOutMin = toWei(
        (
          Number(toData.amount) -
          Number(toData.amount) * (settingData.num / 100)
        ).toString(),
        toData.decimal
      );
      let time = (
        Math.floor(Date.now() / 1000) +
        settingData.time * 60
      ).toString();
      let status1 = await contract.addLiquidity(
        tokenA,
        tokenB,
        amountADesired,
        amountOutMin,
        0,
        0,
        address,
        time
      );
      let transaction = await status1.wait();
      if (transaction) setLoading(false);
    }
    //普通代币与平台之间的添加
    if (type == 2) {
      let tokenA = formData.address;
      let amountADesired = toWei(formData.amount, formData.decimal);

      let time = (
        Math.floor(Date.now() / 1000) +
        settingData.time * 60
      ).toString();
      let status = await contract
        .addLiquidityETH(tokenA, amountADesired, 0, 0, address, time)
        .catch(() => {
          setLoading(false);
          message.error("fail");
        });
      let transaction = await status?.wait();
      if (transaction) setLoading(false);
    }
  };
  const submit = () => {
    if (!isplatformCoin(formData.address) && !isplatformCoin(toData.address)) {
      exchangeMethod(1);
    }
    if (!isplatformCoin(formData.address) && isplatformCoin(toData.address)) {
      exchangeMethod(2);
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
        width={839}
      >
        <div className={styles.content_warp}>
          <div className={styles.title_wrap}>
            <p>Add Liquidity</p>
            <img src={close} alt="" onClick={handleCancel} />
          </div>
          <div className={styles.content}>
            <div className={styles.title}>
              <img src={formData.src} alt="" />
              <img src={toData.src} alt="" />
              <p>
                {formData.name}-{toData.name}{" "}
              </p>
            </div>
            <div className={styles.num_wrap}>
              <div className={styles.num_item}>
                <img src={formData.src} alt="" />
                <p>
                  {formatAmount1(formData.amount)} {formData.name}
                </p>
              </div>
              <div className={styles.num_item}>
                <img src={toData.src} alt="" />
                <p>
                  {formatAmount1(toData.amount)} {toData.name}
                </p>
              </div>
            </div>
            <div className={styles.transfer_wrap}>
              <div>Rates:</div>
              <div className={styles.transfer_r}>
                <p>
                  1 {formData.name} = {formatAmount1(getValue()?.formTo || "0")}{" "}
                  {toData.name}
                </p>
                <p>
                  1 {toData.name} = {formatAmount1(getValue()?.toForm || "0")}{" "}
                  {formData.name}
                </p>
              </div>
            </div>
            <div className={styles.Share_wrap}>
              <div>Share of pool: </div>
              <div className={styles.Share_r}>0.25%</div>
            </div>
            <div className={styles.btn_wrap}>
              <Button loading={loading} onClick={submit} className={styles.btn}>
                Add
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default memo(AddLiquidity);
