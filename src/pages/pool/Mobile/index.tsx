import React, { memo, useCallback, useEffect, useState } from "react";
import { history } from "umi";
import cx from "classnames";
import styles from "./index.less";
import { Button, Collapse, CollapseProps, Switch, message } from "antd";
import down from "@/assets/logo/down.png";
import sei1 from "@/assets/logo/sei1.png";
import block1 from "@/assets/logo/block1.png";
import share from "@/assets/logo/share.png";
import metamask from "@/assets/logo/metamask.png";
import Stake from "./components/Stake";
import { formWei, formTo, getContract } from "@/components/EthersContainer";
import {
  ChainToken,
  poolContractAddress,
} from "@/components/EthersContainer/address";
import { poolAbi, tokenAbi } from "@/components/EthersContainer/abj";
import { getAllowance, getDecimals } from "..";
import { formatAmount, getTime, timeIsEnd } from "@/utils";
import Unstake from "./components/Unstake";

const tabData = [
  { id: 1, name: "Active" },
  { id: 2, name: "Finished" },
];
function Mobile() {
  const [address] = useState<string>(sessionStorage.getItem("address") || "");
  const [walletType] = useState<string>(
    sessionStorage.getItem("walletType") || ""
  );
  const [current, setCurrent] = useState<number>(1);
  const [hasListId, setHasListId] = useState<number[]>([0, 1]);
  const [active, setActive] = useState<boolean>(false);
  const [stakeModalOpen, setStakeModalOpen] = useState(false);
  const [unstakeModalOpen, setUnstakeModalOpen] = useState(false);
  const [poolData, setPoolData] = useState<any>([]);
  const [poolList, setPoolList] = useState<any>([]);
  const [currenPoolInfo, setCurrenPoolInfo] = useState<any>({});
  const [poolId, setPoolId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [claimLoading, setClaimLoading] = useState<boolean>(false);
  const [isOnly, setisOnly] = useState<boolean>(false);

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
      poolContractAddress,
      poolAbi,
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
      newInfo.amount = formWei(userInfo.amount, decimals);
      newInfo.token = item.token;
      newInfo.rewaredtoken = item.rewaredtoken;
      newInfo.starttime = formTo(item.starttime);
      newInfo.endtime = formTo(item.endtime);
      newInfo.totalStake = formWei(item.totalStake, decimals);
      newInfo.name = item.name.split(",");
      newInfo.userReward = formWei(pendingInfo, decimals);
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
      .approve(poolContractAddress, amount)
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
    setClaimLoading(true);
    const contract = await getContract(
      poolContractAddress,
      poolAbi,
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
  ) => [
    {
      key: "1",
      label: (
        <div className={styles.header_wrap}>
          <div className={styles.name_wrap}>
            <div className={styles.name}> {details.name[0].split(" ")[0]}</div>
            <div className={styles.name1}>{details.name[0].split(" ")[1]}</div>
          </div>
          <div className={styles.top_m}>
            <img
              className={styles.img_b}
              src={
                ChainToken.filter(
                  (i) => i.name == details.name[0].split(" ")[0].split("-")[0]
                )[0]?.src
              }
              alt=""
            />
            <img
              className={styles.img_s}
              src={
                ChainToken.filter(
                  (i) => i.name == details.name[0].split(" ")[0].split("-")[1]
                )[0]?.src
              }
              alt=""
            />
          </div>
          <div className={styles.top_r}>
            <div className={styles.top_r_text}>APY</div>
            <div>32.5%</div>
          </div>
        </div>
      ),
      children: (
        <div className={styles.details_wrap}>
          {active && (
            <div className={styles.text_num_wrap}>
              <div className={styles.num_item}>
                My Stake: <span>225 SEI</span>
              </div>
              <div className={styles.num_item}>
                TVL: <span>1,216,245 SEI</span>
              </div>
            </div>
          )}

          <div className={styles.claim_wrap}>
            <div className={styles.claim_l}>
              <div className={styles.claim_name}>{details.name[1]} Earned</div>
              <div>{formatAmount(details.userReward)}</div>
            </div>
            <Button
              className={styles.btn}
              loading={claimLoading}
              onClick={() => handleClaim(current)}
            >
              Claim
            </Button>
          </div>
          {!Number(details.amount) ? (
            <div className={styles.btn_wrap}>
              <Button
                className={styles.stake_btn}
                loading={current == poolId ? loading : false}
                onClick={
                  !details.stakeStatue
                    ? () => handleApprove(details.token, current)
                    : () => stakeShowModal(details, current)
                }
              >
                {details.stakeStatue ? "Stake" : "approve"}
              </Button>
            </div>
          ) : (
            <div className={styles.stake_wrap}>
              <Button
                className={cx(styles.stake_btn, styles.stake_btn1)}
                onClick={() => stakeShowModal(details, current)}
              >
                Stake +
              </Button>
              <Button
                className={cx(styles.stake_btn, styles.stake_btn2)}
                onClick={() => unstakeShowModal(details, current)}
              >
                Unstake
              </Button>
            </div>
          )}

          <div className={styles.bottom_wrap}>
            <div className={styles.left}>
              <div className={styles.left_item}>
                End Time:<span>{getTime(details.endtime)}</span>
              </div>
              <div className={styles.left_item}>
                Days Left: <span>120 days</span>
              </div>
            </div>
            <div className={styles.right}>
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
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className={styles.wrap}>
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
        <div className={styles.switch_wrap}>
          <Switch defaultChecked={false} onChange={onChange} />
          <div className={styles.switch_text}>Staked only</div>
        </div>
      </div>
      <div className={styles.list_wrap}>
        {poolList.map((item: any, index: number) => (
          <div className={styles.list_item} key={item.id}>
            <div className={styles.top_wrap}>
              <Collapse
                onChange={(v) => {
                  if (v.length) {
                    setActive(true);
                    setHasListId(hasListId.filter((i) => i !== index));
                  } else {
                    setActive(false);
                    setHasListId([...hasListId, index]);
                  }
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
            {hasListId.some((i) => i == index) && (
              <div className={styles.down_bottom}>
                <div className={styles.num_item}>
                  My Stake: <span>225 SEI</span>
                </div>
                <div className={styles.num_item}>
                  TVL: <span>1,216,245 SEI</span>
                </div>
              </div>
            )}
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

export default memo(Mobile);
