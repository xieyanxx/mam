import change from "@/assets/logo/change.png";
import down from "@/assets/logo/down.png";
import refresh from "@/assets/logo/refresh.png";
import setting from "@/assets/logo/setting.png";
import time from "@/assets/logo/time.png";
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
  readyAbi,
  routeAbi,
  tokenAbi,
} from "@/components/EthersContainer/abj";
import {
  ChainToken,
  factoryContractAddress,
  readyContractAddress,
  routeContractAddress,
} from "@/components/EthersContainer/address";
import SelectModal from "@/components/Mobile/SelectModal";
import SettingModal from "@/components/Mobile/SettingModal";
import { formatAmount1, isplatformCoin } from "@/utils";
import { Button, Input, message } from "antd";
import { debounce, throttle } from "lodash";
import { memo, useCallback, useEffect, useState } from "react";
import ConfirmSwap from "../ConfirmSwap";
import styles from "./index.less";
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
  const [isChange, setIsChange] = useState(false); //是否点了切换
  const [maxValue, setMaxValue] = useState<string>("0");
  const [formData, setFormData] = useState({
    ...ChainToken[3],
    amount: "", //输入金额
    balance: 0, //账户金额
    decimal: 18, //精度
  });
  const [toData, setToData] = useState({
    ...ChainToken[0],
    amount: "",
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
        balance: 0,
        decimal: 18,
      });
      setToData({ ...toData, amount: "" });
    } else {
      setToData({
        ...toData,
        ...val,
        amount: "",
        balance: 0,
        decimal: 18,
      });
      setFormData({ ...formData, amount: "" });
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
  const getInputMaxValue = async () => {
    const contract = await getContract(
      readyContractAddress,
      readyAbi,
      walletType
    );
    let formAddress = isplatformCoin(formData.address)
      ? formData.address1
      : formData.address; //需要判断是否是平台币
    let toAddress = isplatformCoin(toData.address)
      ? toData.address1
      : toData.address;
    const getMaxValue = await contract
      .getBalance(formAddress, toAddress)
      .catch((e: any) => {
        console.log(e);
      });
    setMaxValue(formWei(getMaxValue));
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
      } else {
        setStatus(2);
      }
    } else {
      setStatus(3);
    }
  };

  //输入获取值
  const getEnterNum = useCallback(
    debounce(async (val: string, type: number) => {
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
      if (type == 1) {
        if (Number(val) == 0) {
          setToData({
            ...toData,
            amount: "",
          });
          return;
        }
        let amount = toWei(val, formData.decimal);
        const getToNum = await contract
          .getAmountsOut(amount, [formAddress, toAddress])
          .catch((e: any) => {
            message.error(e.message);
          });
        if (getToNum) {
          setToData({
            ...toData,
            amount: formWei(getToNum[1], toData.decimal),
          });
          getApproveStatus();
        }
      } else {
        if (Number(val) == 0) {
          setFormData({
            ...formData,
            amount: "",
          });
          return;
        }
        let amount = toWei(val, toData.decimal);
        const getFormNum = await contract
          .getAmountsIn(amount, [toAddress, formAddress])
          .catch((err: any) => {
            message.error(err.message);
          });
        if (getFormNum) {
          setFormData({
            ...formData,
            amount: formWei(getFormNum[0], formData.decimal),
          });
          getApproveStatus();
        }
      }
    }, 300),
    []
  );

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
      if (!formData.amount && !toData.amount) {
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
  //切换按钮
  const changeForm = useCallback(
    throttle(async (formValue: any, toValue: any) => {
      const contract = await getContract(
        routeContractAddress,
        routeAbi,
        walletType
      );
      let formAddress = isplatformCoin(formValue.address)
        ? formValue.address1
        : formValue.address; //需要判断是否是平台币
      let toAddress = isplatformCoin(toValue.address)
        ? toValue.address1
        : toValue.address;
      if (Number(formValue.amount) == 0) {
        return;
      }
      let amount = toWei(formValue.amount, formValue.decimal);
      const getToNum = await contract
        .getAmountsOut(amount, [formAddress, toAddress])
        .catch((e: any) => {
          message.error(e.message);
        });
      if (getToNum) {
        setToData({
          ...toValue,
          amount: formWei(getToNum[1], toValue.decimal),
        });
        setFormData({
          ...formValue,
        });
        getApproveStatus();
      }
    }, 500),
    []
  );
  //切换form-to
  const changeFormTo = () => {
    setIsChange((val) => {
      if (!val) {
        changeForm(toData, formData);
      } else {
        changeForm(toData, formData);
      }
      return !val;
    });
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
    if (!address) return;
    getInputMaxValue();
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

            <Input
              onChange={(e) => {
                let value = e.target.value;
                if (!value.match(/^\d+(\.\d{0,16})?$/)) {
                  value = value.slice(0, -1);
                }
                if (Number(value) > Number(formBalance)) {
                  setFormData({ ...formData, amount: formBalance });
                  getEnterNum(value, 1);
                } else {
                  setFormData({ ...formData, amount: value });
                  getEnterNum(value, 1);
                }
                // if (!value.match(/^\d+(\.\d{0,16})?$/)) {
                //    value = value.slice(0, -1);
                //   setFormData({ ...formData, amount: newValue });
                //   getEnterNum(newValue, 1);
                // } else {
                //   setFormData({ ...formData, amount: value });
                //   getEnterNum(value, 1);
                // }
              }}
              value={formData.amount}
              type="text"
              placeholder={"0.0"}
              className={styles.input_inner}
            />
            {/* <div className={styles.num}>$8.67</div> */}
          </div>
          <div className={styles.label_wrap}>
            {/* <div className={styles.item}>50%</div> */}
            <div
              className={styles.item}
              onClick={() => {
                getEnterNum(formBalance, 1);
                setFormData({ ...formData, amount: formBalance });
              }}
            >
              MAX
            </div>
          </div>
          <div className={styles.change_wrap}>
            <div className={styles.line}></div>
            <img
              className={styles.change_icon}
              src={change}
              alt=""
              onClick={changeFormTo}
            />
          </div>
        </div>
        <div className={styles.from_wrap}>
          <div className={styles.from_title}>
            <span className={styles.name}>To</span>
            <span className={styles.balance}>
              Balance: {formatAmount1(toBalance)}
            </span>
          </div>
          <div className={styles.from_input_wrap}>
            <div className={styles.type_wrap}>
              <img className={styles.icon_img} src={toData.src} alt="" />
              <span>{toData.name}</span>
              <img src={down} alt="" />
            </div>
            <Input
              onChange={(e) => {
                let value = e.target.value;
                if (!value.match(/^\d+(\.\d{0,16})?$/)) {
                  value = value.slice(0, -1);
                }
                if (
                  Number(value) > Number(toBalance) &&
                  Number(toBalance) < Number(maxValue)
                ) {
                  setToData({ ...toData, amount: toBalance });
                  getEnterNum(toBalance, 2);
                }
                if (
                  Number(value) > Number(maxValue) &&
                  Number(toBalance) > Number(maxValue)
                ) {
                  let val = (
                    Number(maxValue) -
                    Number(maxValue) * 0.1
                  ).toString();
                  setToData({
                    ...toData,
                    amount: val,
                  });
                  getEnterNum(val, 2);
                }
                if (
                  Number(value) < Number(maxValue) &&
                  Number(value) < Number(toBalance)
                ) {
                  setToData({ ...toData, amount: value });
                  getEnterNum(value, 2);
                }
                // if (!value.match(/^\d+(\.\d{0,16})?$/)) {
                //   let newValue = value.slice(0, -1);
                //   setToData({ ...toData, amount: newValue });
                //   getEnterNum(newValue, 2);
                // } else {
                //   setToData({ ...toData, amount: value });
                //   getEnterNum(value, 2);
                // }
              }}
              value={toData.amount}
              type="text"
              placeholder={"0.0"}
              className={styles.input_inner}
            />
          </div>
          <div className={styles.label_wrap}>
            {/* <div className={styles.item}>50%</div> */}
            <div
              className={styles.item}
              onClick={() => {
                if (
                  Number(toData.amount) > Number(toBalance) &&
                  Number(toBalance) < Number(maxValue)
                ) {
                  setToData({ ...toData, amount: toBalance });
                  getEnterNum(toBalance, 2);
                }
                if (
                  Number(toData.amount) > Number(maxValue) &&
                  Number(toBalance) > Number(maxValue)
                ) {
                  let val = (
                    Number(maxValue) -
                    Number(maxValue) * 0.1
                  ).toString();
                  setToData({
                    ...toData,
                    amount: val,
                  });
                  getEnterNum(val, 2);
                }
              }}
            >
              MAX
            </div>
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
