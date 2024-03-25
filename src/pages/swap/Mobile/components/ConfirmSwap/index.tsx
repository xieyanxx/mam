import React, { memo, useState } from "react";
import styles from "./index.less";
import cx from "classnames";
import { Button, Input, Modal, Radio, message } from "antd";
import close from "@/assets/logo/close.png";
import down1 from "@/assets/logo/down1.png";
import { getBalance, getContract, toWei } from "@/components/EthersContainer";
import { routeContractAddress } from "@/components/EthersContainer/address";
import { routeAbi } from "@/components/EthersContainer/abj";
import { formatAmount1, isplatformCoin } from "@/utils";

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
  const [gas, setGas] = useState("0");

  const getValue = () => {
    if (isModalOpen) {
      let price = (Number(toData.amount) / Number(formData.amount)).toString();
      let Minimum = (
        Number(toData.amount) -
        Number(toData.amount) * (settingData.num / 100)
      ).toString();
      getGas();
      return { price, Minimum };
    }
  };

  const exchangeMethod = async (type: number) => {
    setLoading(true);
    const contract = await getContract(
      routeContractAddress,
      routeAbi,
      walletType
    );
    //普通代币之间的兑换
    if (type == 1) {
      let amountIn = toWei(formData.amount, formData.decimal);
      let amountOutMin = toWei(
        (
          Number(toData.amount) -
          Number(toData.amount) * (settingData.num / 100)
        ).toString(),
        toData.decimal
      );
      let dataPath = [formData.address, toData.address];
      let time = (
        Math.floor(Date.now() / 1000) +
        settingData.time * 60
      ).toString();
      let status = await contract
        .swapExactTokensForTokens(
          amountIn,
          amountOutMin,
          dataPath,
          address,
          time
        )
        .catch(() => {
          setLoading(false);
          message.error("fail");
        });
      let transaction = await status?.wait();
      if (transaction) setLoading(false);
      handleCancel();
    }
    //平台代币与普通代币的兑换
    if (type == 2) {
      let amountOutMin = toWei(
        (
          Number(toData.amount) -
          Number(toData.amount) * (settingData.num / 100)
        ).toString(),
        toData.decimal
      );
      let dataPath = [formData.address1, toData.address];
      let time = (
        Math.floor(Date.now() / 1000) +
        settingData.time * 60
      ).toString();
      let status = await contract
        .swapExactETHForTokens(amountOutMin, dataPath, address, time, {
          value: toWei(formData.amount, formData.decimal),
        })
        .catch(() => {
          setLoading(false);
          message.error("fail");
        });
      let transaction = await status?.wait();
      if (transaction) setLoading(false);
      handleCancel();
    }
    // 普通币与平台币之间的兑换
    if (type == 3) {
      let amountIn = toWei(formData.amount, formData.decimal);
      let amountOutMin = toWei(
        (
          Number(toData.amount) -
          Number(toData.amount) * (settingData.num / 100)
        ).toString(),
        toData.decimal
      );
      let dataPath = [formData.address, toData.address1];
      let time = (
        Math.floor(Date.now() / 1000) +
        settingData.time * 60
      ).toString();
      let status = await contract
        .swapExactTokensForETH(amountIn, amountOutMin, dataPath, address, time)
        .catch(() => {
          setLoading(false);
          message.error("fail");
        });
      let transaction = await status?.wait();
      if (transaction) setLoading(false);
      handleCancel();
    }

    // 普通代币之间的兑换 如果滑点大于百分之1
    if (type == 4) {
      let amountIn = toWei(formData.amount, formData.decimal);
      let amountOutMin = toWei(
        (
          Number(toData.amount) -
          Number(toData.amount) * (settingData.num / 100)
        ).toString(),
        toData.decimal
      );
      let dataPath = [formData.address, toData.address1];
      let time = (
        Math.floor(Date.now() / 1000) +
        settingData.time * 60
      ).toString();
      let status = await contract
        .swapExactTokensForTokensSupportingFeeOnTransferTokens(
          amountIn,
          amountOutMin,
          dataPath,
          address,
          time
        )
        .catch(() => {
          setLoading(false);
          message.error("fail");
        });
      let transaction = await status?.wait();
      if (transaction) setLoading(false);
      handleCancel();
    }
    //平台代币与普通代币的兑换 如果滑点大于百分之1
    if (type == 5) {
      let amountOutMin = toWei(
        (
          Number(toData.amount) -
          Number(toData.amount) * (settingData.num / 100)
        ).toString(),
        toData.decimal
      );
      let dataPath = [formData.address1, toData.address];
      let time = (
        Math.floor(Date.now() / 1000) +
        settingData.time * 60
      ).toString();
      let status = await contract
        .swapExactETHForTokensSupportingFeeOnTransferTokens(
          amountOutMin,
          dataPath,
          address,
          time,
          {
            value: toWei(formData.amount, formData.decimal),
          }
        )
        .catch(() => {
          setLoading(false);
          message.error("fail");
        });
      let transaction = await status?.wait();
      if (transaction) setLoading(false);
      handleCancel();
    }
    // 普通币与平台币之间的兑换如果滑点大于百分之1
    if (type == 6) {
      let amountIn = toWei(formData.amount, formData.decimal);
      let amountOutMin = toWei(
        (
          Number(toData.amount) -
          Number(toData.amount) * (settingData.num / 100)
        ).toString(),
        toData.decimal
      );
      let dataPath = [formData.address, toData.address1];
      let time = (
        Math.floor(Date.now() / 1000) +
        settingData.time * 60
      ).toString();
      let status = await contract
        .swapExactTokensForETHSupportingFeeOnTransferTokens(
          amountIn,
          amountOutMin,
          dataPath,
          address,
          time
        )
        .catch(() => {
          setLoading(false);
          message.error("fail");
        });
      let transaction = await status?.wait();
      if (transaction) setLoading(false);
      handleCancel();
    }
  };

  const submit = () => {
    if (Number(settingData.num) > 1) {
      if (
        !isplatformCoin(formData.address) &&
        !isplatformCoin(toData.address)
      ) {
        exchangeMethod(4);
      }
      if (isplatformCoin(formData.address) && !isplatformCoin(toData.address)) {
        exchangeMethod(5);
      }
      if (!isplatformCoin(formData.address) && isplatformCoin(toData.address)) {
        exchangeMethod(6);
      }
    } else {
      if (
        !isplatformCoin(formData.address) &&
        !isplatformCoin(toData.address)
      ) {
        exchangeMethod(1);
      }
      if (isplatformCoin(formData.address) && !isplatformCoin(toData.address)) {
        exchangeMethod(2);
      }
      if (!isplatformCoin(formData.address) && isplatformCoin(toData.address)) {
        exchangeMethod(3);
      }
    }
  };
  const getGas = async () => {
    let gasFree = (await getBalance(walletType, address)).gasFreeVal;
    setGas(gasFree);
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
            <p>Confirm Swap</p>
            <img
              src={close}
              alt=""
              onClick={() => {
                setLoading(false);
                handleCancel();
              }}
            />
          </div>
          <div className={styles.content}>
            <div className={styles.num_wrap}>
              <div className={styles.num_item}>
                <p className={styles.num}>{formatAmount1(formData.amount)}</p>
                <div className={styles.num_r}>
                  <img src={formData.src} alt="" />
                  <p>{formData.name}</p>
                </div>
              </div>
              <img className={styles.icon} src={down1} alt="" />
              <div className={styles.num_item}>
                <p className={styles.num}>{formatAmount1(toData.amount)}</p>
                <div className={styles.num_r}>
                  <img src={toData.src} alt="" />
                  <p>{toData.name}</p>
                </div>
              </div>
            </div>
            <div className={styles.share_wrap}>
              <div>Slippage Tolerance: </div>
              <div className={styles.Share_r}>{settingData.num}%</div>
            </div>
            <div className={styles.price_wrap}>
              <div className={styles.price_item}>
                <p className={styles.name}>price:</p>
                <p>
                  {formatAmount1(getValue()?.price || "0")}{" "}
                  {`${toData.name}/${formData.name}`}
                </p>
              </div>
              <div className={styles.price_item}>
                <p className={styles.name}>Minimum received:</p>
                <p>
                  {formatAmount1(getValue()?.Minimum || "0")}
                  {toData.name}
                </p>
              </div>
              {/* <div className={styles.price_item}>
                <p className={styles.name}>Price impact:</p>
                <p>0.00 MAMBA</p>
              </div> */}
              {/* <div className={styles.price_item}>
                <p className={styles.name}>Trading fee:</p>
                <p>{formatAmount1(gas)} SEI</p>
              </div> */}
            </div>
            <div className={styles.btn_wrap}>
              <Button loading={loading} onClick={submit} className={styles.btn}>
                Swap
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default memo(AddLiquidity);
