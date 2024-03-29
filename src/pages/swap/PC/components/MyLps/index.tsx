import icon1 from "@/assets/logo/icon1.png";
import setting from "@/assets/logo/setting.png";
import time from "@/assets/logo/time.png";
import {
  formWei,
  getAllowance,
  getContract,
} from "@/components/EthersContainer";
import { readyAbi, tokenAbi } from "@/components/EthersContainer/abj";
import {
  ChainToken,
  readyContractAddress,
  routeContractAddress,
} from "@/components/EthersContainer/address";
import SettingModal from "@/components/Web/SettingModal";
import { formatAmount1, isplatformCoin } from "@/utils";
import { Button, message } from "antd";
import { memo, useEffect, useState } from "react";
import RemoveLiquidity from "../RemoveLiquidity";
import styles from "./index.less";

function MyLps({ onchangTab }: { onchangTab: (val: number) => void }) {
  const [walletType] = useState<string>(
    sessionStorage.getItem("walletType") || ""
  );
  const [address] = useState<string>(sessionStorage.getItem("address") || "");
  const [listData, setListData] = useState<any>([]);
  const [removeModalOpen, setRemoveModalOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [removeData, setRemoveData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(0);
  const [settingData, setSetingData] = useState({
    time: Number(localStorage.getItem("removeTime")) || 20, //默认时间
    num: Number(localStorage.getItem("removeNum")) || 1, //默认选择1%
  });
  //获取列表数据
  const getLpsList = async () => {
    const contract = await getContract(
      readyContractAddress,
      readyAbi,
      walletType
    );
    const getLpsAddress = await contract.getliquidyList(address);
    const newAddressList = getLpsAddress[0].map((item: any, index: number) => {
      return { address: item, value: getLpsAddress[1][index] };
    });
    let effectiveAddress = newAddressList.filter(
      (item: any) => !isplatformCoin(item.address)
    ); //过滤掉0x000的无效地址
    let list = effectiveAddress.map(async (item: any, index: number) => {
      let newObj: any = {};
      const getTokenInfo = await contract.gettokeninfo(item.address);
      let value = await getAllowance(
        item.address,
        address,
        walletType,
        tokenAbi,
        routeContractAddress
      );
      if (Number(value) > Number(formWei(item.value))) {
        newObj.approve = true;
      } else {
        newObj.approve = false;
      }
      newObj.token1 = getTokenInfo[0];
      newObj.token2 = getTokenInfo[1];
      newObj.tokenName1 = getTokenInfo[2];
      newObj.tokenName2 = getTokenInfo[3];
      newObj.amount = formWei(item.value);
      newObj.address = item.address;
      return newObj;
    });
    let allData = await Promise.all(list);
    setListData(allData);
  };

  //授权
  const handleApprove = async (tokenAddress: string) => {
    setLoading(true);
    var amount =
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
    const contract = await getContract(tokenAddress, tokenAbi, walletType);
    var transaction = await contract
      .approve(routeContractAddress, amount)
      .catch((err: any) => {
        message.error("fail");
        setLoading(false);
      });
    let status = await transaction?.wait();
    if (status) {
      message.success("success");
      getLpsList();
      setLoading(false);
    }
  };

  const removeSubmit = async (val: any) => {
    setRemoveData(val);
    handleRemoveModalOpen();
  };
  //remove弹窗
  const handleRemoveModalOpen = () => {
    setRemoveModalOpen(true);
  };
  const handleRemoveModalClose = () => {
    setRemoveModalOpen(false);
    getLpsList();
  };

  //setting弹窗
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  //保存设置
  const saveSetting = (time: number, num: number) => {
    localStorage.setItem("removeNum", num.toString());
    localStorage.setItem("removeTime", time.toString());
    setSetingData({
      time,
      num,
    });
  };
  useEffect(() => {
    if (!address) return;
    getLpsList();
  }, []);
  return (
    <div className={styles.wrap}>
      <div className={styles.title}>
        Check and remove your Liquidity
        <div className={styles.icon_wrap}>
          <img src={setting} onClick={showModal} alt="" />
          <img src={time} alt="" />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.from_title}>
          <span className={styles.name}>My Liquidity</span>
          <img src={icon1} alt="" />
        </div>
        {listData.map((item: any, index: number) => (
          <div className={styles.item_wrap} key={index}>
            <div className={styles.info_wrap}>
              <div className={styles.info_name}>
                {item.tokenName1}-{item.tokenName2} LP
              </div>
              <div className={styles.img_wrap}>
                <img
                  src={
                    ChainToken.filter((i) => i.name == item.tokenName1)[0]?.src
                  }
                  alt=""
                />
                <img
                  src={
                    ChainToken.filter((i) => i.name == item.tokenName2)[0]?.src
                  }
                  alt=""
                />
              </div>
            </div>
            {/* <div className={styles.info_num}>
              <p>
                {formatAmount1(item.amount)} {item.tokenName1}
              </p>
              <p>
                {formatAmount1(item.amount)} {item.tokenName2}
              </p>
            </div> */}
            <div className={styles.type_wrap}>
              <div className={styles.type_name}>Available</div>
              <div className={styles.type_num}>
                {formatAmount1(item.amount)} LP
              </div>
              {/* <div className={styles.type_name}>Staked</div>
              <div className={styles.type_num}>0 LP</div> */}
            </div>
            <Button
              loading={current == index && loading}
              className={styles.remove_btn}
              onClick={() => {
                setCurrent(index);
                if (item.approve) {
                  removeSubmit(item);
                } else {
                  handleApprove(item.address);
                }
              }}
            >
              {item.approve ? "remove" : "approve"}
            </Button>
          </div>
        ))}
        <div className={styles.tip_text}>
          Don’t see a pool you joined?<span>Import it.</span>
        </div>
      </div>
      <div className={styles.refresh_wrap} onClick={() => onchangTab(2)}>
        Add Liquidity
      </div>
      <RemoveLiquidity
        handleCancel={handleRemoveModalClose}
        isModalOpen={removeModalOpen}
        removeData={removeData}
        settingData={settingData}
      ></RemoveLiquidity>
      <SettingModal
        settingData={settingData}
        saveSetting={(time: number, num: number) => saveSetting(time, num)}
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
      ></SettingModal>
    </div>
  );
}

export default memo(MyLps);
