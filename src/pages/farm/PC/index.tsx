import React, {
  CSSProperties,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./index.less";
import venom from "@/assets/logo/venom city logo.png";
import cx from "classnames";
import { Button, Collapse, CollapseProps, Switch, message } from "antd";
import sei1 from "@/assets/logo/sei1.png";
import block1 from "@/assets/logo/block1.png";
import down from "@/assets/logo/down.png";
import share from "@/assets/logo/share.png";
import metamask from "@/assets/logo/metamask.png";
import Stake from "./components/Stake";
import { bigNumberTo, formTo, getContract } from "@/components/EthersContainer";
import { farmAbi, tokenAbi } from "@/components/EthersContainer/abj";
import { farmContractAddress } from "@/components/EthersContainer/address";
import { formatAmount, getTime, timeIsEnd } from "@/utils";
import { getAllowance, getDecimals } from "..";
import Unstake from "./components/Unstake";
const tabData = [
  { id: 1, name: "Active" },
  { id: 2, name: "Finished" },
];

function PC() {
  const [address] = useState<string>(sessionStorage.getItem("address") || "");
  const [walletType] = useState<string>(
    sessionStorage.getItem("walletType") || ""
  );
  const [current, setCurrent] = useState<number>(1);
  const [active, setActive] = useState<boolean>(false);
  const [isOnly, setisOnly] = useState<boolean>(false);
  const [activeCurrent, setActiveCurrent] = useState<number>(0);
  const [stakeModalOpen, setStakeModalOpen] = useState(false);
  const [unstakeModalOpen, setUnstakeModalOpen] = useState(false);
  const [poolData, setPoolData] = useState<any>([]);
  const [poolList, setPoolList] = useState<any>([]);
  const [currenPoolInfo, setCurrenPoolInfo] = useState<any>({});
  const [poolId, setPoolId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [claimLoading, setClaimLoading] = useState<boolean>(false);

  const stakeShowModal = (pool: any, poolId: number) => {
    setCurrenPoolInfo(pool);
    setPoolId(poolId);
    setStakeModalOpen(true);
  };
  const handleStakeCancel = () => {
    setStakeModalOpen(false);
    getPool();
    getPoolList();
  };
  const unstakeShowModal = (pool: any, poolId: number) => {
    setCurrenPoolInfo(pool);
    setPoolId(poolId);
    setUnstakeModalOpen(true);
  };
  const handleUnstakeCancel = () => {
    setUnstakeModalOpen(false);
    getPool();
    getPoolList();
  };

  const onChange = (checked: boolean) => {
    setisOnly(checked);
  };

  //获取pool数组
  async function getPool() {
    const contract = await getContract(
      farmContractAddress,
      farmAbi,
      walletType
    );
    let getPoolList = await contract.getpool();
    console.log(getPoolList, "==>getPoolList");
    let newList = getPoolList.map(async (item: any, index: number) => {
      let userInfo = await contract.users(index, address);
      let pendingInfo = await contract.pending(index, address);
      let stakeStatue = await getAllowance(item.token, address, walletType);
      let decimals = await getDecimals(item.token, walletType);
      let newInfo: any = {};
      newInfo.amount = bigNumberTo(userInfo.amount, decimals);
      newInfo.token = item.token;
      newInfo.rewaredtoken = item.rewaredtoken;
      newInfo.starttime = formTo(item.starttime);
      newInfo.endtime = formTo(item.endtime);
      newInfo.totalStake = bigNumberTo(item.totalStake, decimals);
      newInfo.name = item.name.split(",");
      newInfo.userReward = bigNumberTo(pendingInfo, decimals);
      if (Number(stakeStatue) > Number(newInfo.amount)) {
        //判断授权状态  true:已授权，fasle:未授权
        newInfo.stakeStatue = true;
      } else {
        newInfo.stakeStatue = false;
      }
      return await newInfo;
    });
    let allData = await Promise.all(newList);
    setPoolData(allData);
  }
  //获取pool卡片数据
  const getPoolList = useCallback(() => {
    if (current === 1) {
      if (isOnly) {
        console.log(isOnly, "==>isOnly");
        //返回用户已经质押的池子
        return setPoolList(
          poolData.filter((item: any) => Number(item.amount) > 0)
        );
      } else {
        return setPoolList(
          poolData.filter((item: any) => !timeIsEnd(item.endtime))
        );
      }
    } else {
      if (isOnly) {
        return setPoolList(
          poolData.filter((item: any) => Number(item.amount) > 0)
        );
      } else {
        return setPoolList(
          poolData.filter((item: any) => timeIsEnd(item.endtime))
        );
      }
    }
  }, [current, poolData, isOnly]);
  //授权
  const handleApprove = async (tokenAddress: string, poolId: number) => {
    setPoolId(poolId);
    setLoading(true);
    var amount =
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
    const contract = await getContract(tokenAddress, tokenAbi, walletType);
    var transaction = await contract
      .approve(farmContractAddress, amount)
      .wait()
      .catch((err: any) => {
        message.error("fail");
        setLoading(false);
      });
    if (transaction) {
      message.success("success");
      getPool();
      getPoolList();
      setLoading(false);
    }
  };

  //领取奖励
  const handleClaim = async (poolId: number) => {
    const contract = await getContract(
      farmContractAddress,
      farmAbi,
      walletType
    );
    var transaction = await contract
      .reclaimReward(poolId)
      .wait()
      .catch((err: any) => {
        message.error("fail");
        setClaimLoading(false);
      });
    if (transaction) {
      message.success("success");
      getPool();
      getPoolList();
      setClaimLoading(false);
    }
  };
  useEffect(() => {
    getPoolList();
  }, [current, poolData, isOnly]);
  useEffect(() => {
    getPool();
  }, [walletType]);
  const getItems: (current: number, details: any) => CollapseProps["items"] = (
    current,
    details
  ) => {
    return [
      {
        key: current,
        label: active && current == activeCurrent ? "Hide" : "Details",
        children: (
          <div className={styles.details_wrap}>
            <div className={styles.text_item}>
              <div className={styles.time_title}>End Time:</div>
              <div>{getTime(details.endtime)}</div>
            </div>
            <div className={styles.text_item}>
              <div className={styles.time_title}>Days Left:</div>
              <div>120 days</div>
            </div>
            <div className={styles.share_wrap}>
              <p>USDT Token Info</p> <img src={share} alt="" />
            </div>
            <div className={styles.share_wrap}>
              <p>Farm Contract</p> <img src={share} alt="" />
            </div>
            <div className={styles.share_wrap}>
              <p>Add to Wallet</p> <img src={metamask} alt="" />
            </div>
          </div>
        ),
      },
    ];
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.title_wrap}>
        <img src={venom} alt="" />
        <div className={styles.title_r}>
          <div className={styles.title}>Venom City </div>
          <div className={styles.sub_title}>
            Stake tokens to earn. Farming with hot APYs.
          </div>
        </div>
      </div>
      <div className={styles.content_wrap}>
        <div className={styles.tab_wrap}>
          {tabData.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setCurrent(tab.id)}
              className={cx(
                styles.tab_item,
                current == tab.id && styles.active
              )}
            >
              {tab.name}
            </div>
          ))}
        </div>
        <Switch
          className={styles.switch_wrap}
          defaultChecked={isOnly}
          onChange={onChange}
        />
        <div className={styles.switch_text}>Staked only</div>
      </div>
      <div className={styles.content}>
        {poolList.map((item: any, index: number) => (
          <div key={index}>
            <div className={styles.item_wrap}>
              <div className={styles.top_wrap}>
                <div className={styles.top_l}>
                  <div className={styles.name}>Stake {item.name[0]}</div>
                  <div className={styles.name_1}>Earn {item.name[1]}</div>
                </div>
                <div className={styles.top_r}>
                  <img className={styles.img_b} src={sei1} alt="" />
                  <img className={styles.img_s} src={block1} alt="" />
                </div>
              </div>
              <div className={styles.stake}>
                <div>My Stake:</div>
                <div className={styles.num}>{item.amount}</div>
              </div>
              <div className={styles.md_wrap}>
                <div className={styles.md_text_wrap}>
                  <div className={styles.text_l}>APY:</div>
                  <div className={styles.text_r}>37.2%</div>
                </div>
                <div className={styles.md_text_wrap}>
                  <div className={styles.text_l}>TVL:</div>
                  <div className={styles.text_r}>1,273,212 USDT</div>
                </div>
                <div className={styles.text_bt}>
                  <div className={styles.bt_l}>
                    <div className={styles.bt_text}>{item.name[1]} Earned</div>
                    <div>{formatAmount(item.userReward)}</div>
                  </div>
                  <Button
                    className={styles.btn}
                    onClick={() => handleClaim(index)}
                    loading={claimLoading}
                  >
                    Claim
                  </Button>
                </div>
              </div>
              {!Number(item.amount) ? (
                <Button
                  className={styles.stake_btn}
                  loading={index == poolId ? loading : false}
                  onClick={
                    !item.stakeStatue
                      ? () => handleApprove(item.token, index)
                      : () => stakeShowModal(item, index)
                  }
                >
                  {item.stakeStatue ? "Stake" : "approve"}
                </Button>
              ) : (
                <div className={styles.stake_wrap}>
                  <Button
                    className={cx(styles.stake_btn, styles.stake_btn1)}
                    onClick={() => stakeShowModal(item, index)}
                  >
                    Stake +
                  </Button>
                  <Button
                    className={cx(styles.stake_btn, styles.stake_btn2)}
                    onClick={() => unstakeShowModal(item, index)}
                  >
                    Unstake
                  </Button>
                </div>
              )}
            </div>
            <Collapse
              onChange={(v) => {
                v.length ? setActive(true) : setActive(false);
                setActiveCurrent(index);
              }}
              bordered={false}
              className={styles.collapse_wrap}
              expandIcon={({ isActive }) => (
                <img
                  src={down}
                  style={{ rotate: isActive ? "180deg" : "360deg" }}
                />
              )}
              expandIconPosition={"end"}
              items={getItems(index, item)}
            />
          </div>
        ))}
      </div>
      <Stake
        isModalOpen={stakeModalOpen}
        handleCancel={handleStakeCancel}
        poolId={poolId}
        poolInfo={currenPoolInfo}
      ></Stake>
      <Unstake
        isModalOpen={unstakeModalOpen}
        handleCancel={handleUnstakeCancel}
        poolId={poolId}
        poolInfo={currenPoolInfo}
      ></Unstake>
    </div>
  );
}

export default memo(PC);
