import React, { memo, useCallback, useEffect, useState } from "react";
import styles from "./index.less";
import cx from "classnames";
import setting from "@/assets/logo/setting.png";
import time from "@/assets/logo/time.png";
import sei1 from "@/assets/logo/sei1.png";
import down from "@/assets/logo/down.png";
import usdt from "@/assets/logo/usdt.png";
import add from "@/assets/logo/add.png";
import { Button, Input, message } from "antd";
import AddLiquidity from "../AddLiquidity";
import ConfirmSwap from "../ConfirmSwap";
import RemoveLiquidity from "../RemoveLiquidity";
import {
  ChainToken,
  factoryContractAddress,
  routeContractAddress,
} from "@/components/EthersContainer/address";
import SettingModal from "@/components/Web/SettingModal";
import SelectModal from "@/components/Web/SelectModal";
import {
  balanceOf,
  formWei,
  getAllowance,
  getBalance,
  getContract,
  getDecimals,
  toWei,
} from "@/components/EthersContainer";
import { formatAmount1, isplatformCoin } from "@/utils";
import {
  factoryAbi,
  routeAbi,
  tokenAbi,
} from "@/components/EthersContainer/abj";

const statusType: any = {
  0: "Invalid pai", //地址无效，
  1: "Enter Number", //没有输入金额，
  2: "Approve", //没有授权
  3: "Add liquidity",
};
function Liquidity() {
  const [walletType] = useState<string>(
    sessionStorage.getItem("walletType") || ""
  );
  const [address] = useState<string>(sessionStorage.getItem("address") || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [formBalance, setFormBalance] = useState("0"); //用户剩余币
  const [toBalance, setTOBalance] = useState("0"); //兑换用户剩余币
  const [loading, setLoading] = useState(false);
  const [selectType, setSelectType] = useState(1);
  const [isEnterForm, setIsEnterForm] = useState(false); //是否是先从form输入值
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [isEffective, setEffective] = useState(true); //判断地址是否有效
  const [isApptove, setIsApptove] = useState(false); //判断token1是否授权
  const [isApptove1, setIsApptove1] = useState(true); //判断token2是否授权
  const [status, setStatus] = useState(1);
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
    time: Number(localStorage.getItem("liquidityTime")) || 20, //默认时间
    num: Number(localStorage.getItem("liquidityNum")) || 1, //默认选择1%
  });
  //setting弹窗
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  //添加弹窗
  const addShowModal = () => {
    setAddModalOpen(true);
  };
  const handleAddCancel = () => {
    setAddModalOpen(false);
  };
  //选择弹窗
  const selectShowModal = (type: number) => {
    setSelectType(type);
    setSelectModalOpen(true);
  };
  const selectHandleCancel = () => {
    setSelectModalOpen(false);
  };

  //保存设置
  const saveSetting = (time: number, num: number) => {
    localStorage.setItem("liquidityNum", num.toString());
    localStorage.setItem("liquidityTime", time.toString());
    setSetingData({
      time,
      num,
    });
  };
  //选择添加地址
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
    // if (!isplatformCoin(formData.address) && !isplatformCoin(toData.address)) {
    let isformApprove = false;
    let istoApprove = false;

    if (!isplatformCoin(formData.address)) {
      let value = await getAllowance(
        formData.address,
        address,
        walletType,
        tokenAbi,
        routeContractAddress
      );
      if (Number(value) > Number(formBalance)) {
        // setStatus(3);;
        isformApprove = true;
      } else {
        isformApprove = false;
      }
    } else {
      isformApprove = true;
    }
    if (!isplatformCoin(toData.address)) {
      let value = await getAllowance(
        toData.address,
        address,
        walletType,
        tokenAbi,
        routeContractAddress
      );
      if (Number(value) > Number(formBalance)) {
        istoApprove = true;
      } else {
        istoApprove = false;
      }
    } else {
      isformApprove = true;
    }
    if (isformApprove && istoApprove) {
      setStatus(3);
      setIsApptove(true);
      setIsApptove1(true);
    } else {
      setStatus(2);
    }
    // }
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
    //无效数据需要自己输入值
    if (!isEffective) {
      if (Number(formData.amount) && Number(toData.amount)) {
        getApproveStatus();
      }
      return;
    }
    if (isEnterForm) {
      if (Number(formData.amount) == 0) {
        // message.error("Please enter a number greater than zero");
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
    if (formAddress == toAddress) {
      setStatus(0);
    }
    if (isplatformCoin(addressStatus) && formAddress != toAddress) {
      setEffective(false);
      setStatus(1);
    } else {
      setEffective(true);
      setStatus(1);
    }
  };

  //授权
  const handleApprove = async () => {
    setLoading(true);
    let formApprove = isApptove;
    let toApprove = isApptove1;
    var amount =
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
    let status = null;
    let toStatus = null;
    if (!formApprove) {
      const contract = await getContract(
        formData.address,
        tokenAbi,
        walletType
      );
      var transaction = await contract
        .approve(routeContractAddress, amount)
        .catch((err: any) => {
          message.error("fail");
          setLoading(false);
        });

      status = await transaction.wait();
    } else {
      status = true;
    }
    if (!toApprove) {
      const contract = await getContract(toData.address, tokenAbi, walletType);
      var transaction1 = await contract
        .approve(routeContractAddress, amount)
        .catch((err: any) => {
          message.error("fail");
          setLoading(false);
        });
      toStatus = await transaction1.wait();
    } else {
      toStatus = true;
    }
    if (status && toStatus) {
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
      addShowModal();
    }
  };

  useEffect(() => {
    getTransactionData();
    getBalanceData();
  }, [formData.address, toData.address]);
  return (
    <div className={styles.wrap}>
      <div className={styles.title}>
        Add liquidity to get LP tokens
        <div className={styles.icon_wrap}>
          <img src={setting} onClick={showModal} alt="" />
          <img src={time} alt="" />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.from_wrap}>
          <div className={styles.from_title}>
            <span className={styles.name}>Token 1</span>
            <span className={styles.balance}>
              Balance: {formatAmount1(formBalance)}
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
            {/* <div className={styles.item}>50%</div> */}
            <div className={styles.item}>MAX</div>
          </div>
          <div className={styles.change_wrap}>
            {/* <div className={styles.line}></div> */}
            <img className={styles.change_icon} src={add} alt="" />
          </div>
        </div>
        <div className={styles.from_wrap}>
          <div className={styles.from_title}>
            <span className={styles.name}>Token 2</span>
            <span className={styles.balance}>
              Balance: {formatAmount1(toBalance)}
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
                value={toData.amount}
                type="text"
                placeholder={"0.0"}
                className={styles.input_inner}
              />
              {/* <div className={styles.num}>$8.67</div> */}
            </div>
          </div>
          <div className={styles.label_wrap}>
            {/* <div className={styles.item}>50%</div> */}
            <div className={styles.item}>MAX</div>
          </div>
        </div>
        {/* <div className={styles.initial_wrap}>
          <div className={styles.initial_title}>
            Initial Prices & Pool Share
          </div>
          <div className={styles.initial_content}>
            <div className={styles.item_wrap}>
              <div className={styles.item_num}>1</div>
              <div>USDC per SEI</div>
            </div>
            <div className={styles.item_wrap}>
              <div className={styles.item_num}>1</div>
              <div>USDC per SEI</div>
            </div>
            <div className={styles.item_wrap}>
              <div className={styles.item_num}>1</div>
              <div>USDC per SEI</div>
            </div>
          </div>
        </div> */}
        <div className={styles.btn_wrap}>
          <Button
            loading={loading}
            disabled={status == 0 || status == 1}
            className={styles.unlock_btn}
            onClick={handleSubmit}
          >
            {statusType[status]}
          </Button>
        </div>
      </div>

      <div className={styles.refresh_wrap}>Check my Liquidity Pools</div>
      <AddLiquidity
        handleCancel={handleAddCancel}
        isModalOpen={addModalOpen}
        formData={formData}
        toData={toData}
        settingData={settingData}
      ></AddLiquidity>
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
      {/* <ConfirmSwap
        handleCancel={handleAddCancel}
        isModalOpen={addModalOpen}
      ></ConfirmSwap> */}
      {/* <RemoveLiquidity
        handleCancel={handleAddCancel}
        isModalOpen={addModalOpen}
      ></RemoveLiquidity> */}
    </div>
  );
}

export default memo(Liquidity);
