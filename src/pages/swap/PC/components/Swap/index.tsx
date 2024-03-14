import React, { memo, useEffect, useState } from "react";
import styles from "./index.less";
import cx from "classnames";
import setting from "@/assets/logo/setting.png";
import time from "@/assets/logo/time.png";
import sei1 from "@/assets/logo/sei1.png";
import down from "@/assets/logo/down.png";
import usdt from "@/assets/logo/usdt.png";
import change from "@/assets/logo/change.png";
import refresh from "@/assets/logo/refresh.png";
import { Button, Input, message } from "antd";
import SettingModal from "@/components/Web/SettingModal";
import SelectModal from "@/components/Web/SelectModal";
import {
  ChainToken,
  factoryContractAddress,
  farmContractAddress,
  routeContractAddress,
} from "@/components/EthersContainer/address";
import {
  balanceOf,
  formWei,
  getAllowance,
  getBalance,
  getContract,
  getDecimals,
  toWei,
} from "@/components/EthersContainer";
import {
  factoryAbi,
  farmAbi,
  routeAbi,
  tokenAbi,
} from "@/components/EthersContainer/abj";
import { formatAmount, isplatformCoin } from "@/utils";
import ConfirmSwap from "../ConfirmSwap";

const statusType: any = {
  0: "Invalid pai", //地址无效，
  1: "Enter Number", //没有输入金额，
  2: "Approve", //没有授权
  3: "Swap",
};

function Swap() {
  const [walletType] = useState<string>(
    sessionStorage.getItem("walletType") || ""
  );
  const [address] = useState<string>(sessionStorage.getItem("address") || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectType, setSelectType] = useState(1);
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formBalance, setFormBalance] = useState("0"); //用户剩余币
  const [toBalance, setTOBalance] = useState("0"); //兑换用户剩余币
  const [status, setStatus] = useState(1);
  const [isEnterForm, setIsEnterForm] = useState(false); //是否是先从form输入值
  const [formData, setFormData] = useState({
    ...ChainToken[3],
    amount: "", //输入金额
    isEmpower: false, //是否授权
    balance: 0, //账户金额
    decimal: 18, //精度
  });
  const [toData, setToData] = useState({
    ...ChainToken[0],
    amount: "",
    isEmpower: false, //是否授权
    balance: 0,
    decimal: 18, //精度
  });
  const [settingData, setSetingData] = useState({
    time: Number(localStorage.getItem("time")) || 20, //默认时间
    num: Number(localStorage.getItem("num")) || 1, //默认选择1%
  });
  //setting弹窗
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const selectShowModal = (type: number) => {
    setSelectType(type);
    setSelectModalOpen(true);
  };
  const selectHandleCancel = () => {
    setSelectModalOpen(false);
  };
  const swapShowModal = () => {
    setSwapModalOpen(true);
  };
  const swapHandleCancel = () => {
    getTransactionData();
    getBalanceData();
    setSwapModalOpen(false);
  };
  //保存设置
  const saveSetting = (time: number, num: number) => {
    localStorage.setItem("num", num.toString());
    localStorage.setItem("time", time.toString());
    setSetingData({
      time,
      num,
    });
  };
  //选择兑换地址
  const selectAddress = (val: any) => {
    if (selectType == 1) {
      setFormData({
        ...formData,
        ...val,
        amount: "",
        isEmpower: false,
        balance: 0,
        decimal: 18,
      });
    } else {
      setToData({
        ...toData,
        ...val,
        amount: "",
        isEmpower: false,
        balance: 0,
        decimal: 18,
      });
    }
    selectHandleCancel();
  };

  const getBalanceNum = async (
    addres: string,
    decimals: boolean,
    type: number
  ) => {
    let val = 18;
    const decimalsval = await getDecimals(addres, walletType, tokenAbi);
    type == 1
      ? setFormData({ ...formData, decimal: decimalsval })
      : setToData({ ...toData, decimal: decimalsval });
    if (decimals) {
      val = decimalsval;
    }
    const balanceVal = await balanceOf(
      addres,
      tokenAbi,
      walletType,
      address,
      val
    );
    return balanceVal;
  };
  // 获取用户剩余币
  const getBalanceData = async () => {
    if (!isplatformCoin(formData.address)) {
      let formBalance = await getBalanceNum(formData.address, true, 1); //1表示form，2表示to
      setFormBalance(formBalance);
    } else {
      let formBalance = (await getBalance(walletType, address)).balanceVal;
      setFormBalance(formBalance);
    }
    if (!isplatformCoin(toData.address)) {
      let toBalance = await getBalanceNum(toData.address, true, 2);
      setTOBalance(toBalance);
    } else {
      let toBalance = (await getBalance(walletType, address)).balanceVal;
      setTOBalance(toBalance);
    }
  };

  //获取授权状态
  const getApproveStatus = async () => {
    if (!isplatformCoin(formData.address)) {
      let value = await getAllowance(
        formData.address,
        address,
        walletType,
        tokenAbi,
        routeContractAddress
      );
      if (Number(value) > Number(formBalance)) {
        setStatus(3);
        setFormData({ ...formData, isEmpower: true });
      } else {
        setStatus(2);
      }
    } else {
      setStatus(3);
    }
  };

  //输入获取值
  const getEnterNum = async () => {
    const contract = await getContract(
      routeContractAddress,
      routeAbi,
      walletType
    );
    let formAddress = isplatformCoin(formData.address)
      ? formData.address1
      : formData.address; //需要判断是否是平台币
    let toAddress = isplatformCoin(toData.address)
      ? toData.address1
      : toData.address;
    if (isEnterForm) {
      if (Number(formData.amount) == 0) {
        message.error("Please enter a number greater than zero");
        return;
      }
      let amount = toWei(formData.amount, formData.decimal);
      const getToNum = await contract.getAmountsOut(amount, [
        formAddress,
        toAddress,
      ]);
      setToData({
        ...toData,
        amount: formWei(getToNum[1], toData.decimal),
      });
      getApproveStatus();
    } else {
      if (Number(toData.amount) == 0) {
        message.error("Please enter a number greater than zero");
        return;
      }
      let amount = toWei(toData.amount, toData.decimal);
      const getFormNum = await contract.getAmountsIn(amount, [
        toAddress,
        formAddress,
      ]);

      setFormData({
        ...formData,
        amount: formWei(getFormNum[0], formData.decimal),
      });
      getApproveStatus();
    }
  };

  const getTransactionData = async () => {
    const contract = await getContract(
      factoryContractAddress,
      factoryAbi,
      walletType
    );
    //判断两个地址是否有效
    let formAddress = isplatformCoin(formData.address)
      ? formData.address1
      : formData.address;
    let toAddress = isplatformCoin(toData.address)
      ? toData.address1
      : toData.address;
    const addressStatus = await contract.getPair(formAddress, toAddress);
    if (isplatformCoin(addressStatus)) {
      setStatus(0); // 表示位无效地址
    } else {
      if (formData.amount && toData.amount) {
        console.log(111);
      } else {
        setStatus(1);
      }
    }
  };

  //授权
  const handleApprove = async () => {
    setLoading(true);
    var amount =
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
    const contract = await getContract(formData.address, tokenAbi, walletType);
    var transaction = await contract
      .approve(routeContractAddress, amount)
      .catch((err: any) => {
        message.error("fail");
        setLoading(false);
      });
    if (transaction) {
      setStatus(3);
      message.success("success");
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (status == 2) {
      handleApprove();
    }
    if (status == 3) {
      swapShowModal();
    }
  };

  useEffect(() => {
    getTransactionData();
    getBalanceData();
  }, [formData.address, toData.address]);
  return (
    <div className={styles.wrap}>
      <div className={styles.title}>
        Trade tokens at MAMBA speed
        <div className={styles.icon_wrap}>
          <img src={setting} alt="" onClick={showModal} />
          <img src={time} alt="" />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.from_wrap}>
          <div className={styles.from_title}>
            <span className={styles.name}>From</span>
            <span className={styles.balance}>
              Balance: {formatAmount(formBalance)}
            </span>
          </div>
          <div className={styles.from_input_wrap}>
            <div
              className={styles.type_wrap}
              onClick={() => selectShowModal(1)}
            >
              <img className={styles.icon_img} src={formData.src} alt="" />
              <span>{formData.name}</span>
              <img src={down} alt="" />
            </div>
            <div>
              <Input
                onChange={(e) => {
                  let value = e.target.value;
                  setIsEnterForm(true);
                  if (!value.match(/^\d+(\.\d{0,16})?$/)) {
                    let newValue = value.slice(0, -1);
                    setFormData({ ...formData, amount: newValue });
                  } else {
                    setFormData({ ...formData, amount: value });
                  }
                }}
                onBlur={getEnterNum}
                type="text"
                value={formData.amount}
                placeholder={"0.0"}
                className={styles.input_inner}
              />
              {/* <div className={styles.num}>$8.67</div> */}
            </div>
          </div>
          <div className={styles.label_wrap}>
            <div className={styles.item}>50%</div>
            <div className={styles.item}>MAX</div>
          </div>
          <div className={styles.change_wrap}>
            <div className={styles.line}></div>
            <img className={styles.change_icon} src={change} alt="" />
          </div>
        </div>
        <div className={styles.from_wrap}>
          <div className={styles.from_title}>
            <span className={styles.name}>To</span>
            <span className={styles.balance}>
              Balance: {formatAmount(toBalance)}
            </span>
          </div>
          <div className={styles.from_input_wrap}>
            <div
              className={styles.type_wrap}
              onClick={() => selectShowModal(2)}
            >
              <img className={styles.icon_img} src={toData.src} alt="" />
              <span>{toData.name}</span>
              <img src={down} alt="" />
            </div>
            <div>
              <Input
                onChange={(e) => {
                  let value = e.target.value;
                  setIsEnterForm(false);
                  if (!value.match(/^\d+(\.\d{0,16})?$/)) {
                    let newValue = value.slice(0, -1);
                    setToData({ ...toData, amount: newValue });
                  } else {
                    setToData({ ...toData, amount: value });
                  }
                }}
                onBlur={getEnterNum}
                type="text"
                placeholder={"0.0"}
                value={toData.amount}
                className={styles.input_inner}
              />
              {/* <div className={styles.num}>$8.67</div> */}
            </div>
          </div>
          <div className={styles.label_wrap}>
            <div className={styles.item}>50%</div>
            <div className={styles.item}>MAX</div>
          </div>
        </div>
        <div className={styles.btn_wrap}>
          <Button
            className={styles.unlock_btn}
            disabled={status == 0 || status == 1}
            onClick={handleSubmit}
            loading={loading}
          >
            {statusType[status]}
          </Button>
        </div>
      </div>
      <div className={styles.refresh_wrap}>
        <div className={styles.refresh}>
          <img src={refresh} alt="" />
        </div>
      </div>
      <SettingModal
        settingData={settingData}
        saveSetting={(time: number, num: number) => saveSetting(time, num)}
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
      ></SettingModal>
      <SelectModal
        selectAddress={(val: any) => selectAddress(val)}
        isModalOpen={selectModalOpen}
        handleCancel={selectHandleCancel}
      ></SelectModal>
      <ConfirmSwap
        isModalOpen={swapModalOpen}
        handleCancel={swapHandleCancel}
        formData={formData}
        toData={toData}
        settingData={settingData}
      ></ConfirmSwap>
    </div>
  );
}

export default memo(Swap);
