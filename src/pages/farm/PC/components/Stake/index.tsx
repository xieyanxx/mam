import close from "@/assets/logo/close.png";
import { getContract, toWei } from "@/components/EthersContainer";
import { farmAbi } from "@/components/EthersContainer/abj";
import {
  ChainToken,
  farmContractAddress,
} from "@/components/EthersContainer/address";
import { formatAmount1, isplatformCoin } from "@/utils";
import { Button, Input, Modal, message } from "antd";
import cx from "classnames";
import { memo, useCallback, useState } from "react";
import styles from "./index.less";

function Stake({
  handleCancel,
  isModalOpen,
  poolInfo,
}: {
  handleCancel: () => void;
  isModalOpen: boolean;
  poolInfo: any;
}) {
  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [walletType] = useState<string>(
    sessionStorage.getItem("walletType") || ""
  );
  const [address] = useState<string>(sessionStorage.getItem("address") || "");
  const deposit = useCallback(async () => {
    setLoading(true);
    const contract = await getContract(
      farmContractAddress,
      farmAbi,
      walletType
    );
    let status;
    if (isplatformCoin(poolInfo.token)) {
      //主网币的质押
      status = await contract
        .deposit(poolInfo.id, toWei(stakeAmount, poolInfo.decimals), {
          //这个value 就是用户质押的bnb数量
          value: toWei(stakeAmount, poolInfo.decimals),
        })
        .catch((err: any) => {
          message.error("fail");
          setLoading(false);
        });
    } else {
      //正常情况的deposit
      status = await contract
        .deposit(poolInfo.id, toWei(stakeAmount, poolInfo.decimals))
        .catch((err: any) => {
          message.error("fail");
          setLoading(false);
        });
    }
    let transaction = await status?.wait();
    if (transaction) {
      message.success("success");
      setLoading(false);
      handleCancel();
      setStakeAmount("");
    }
  }, [stakeAmount, poolInfo]);

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
            <p>Stake in Farm</p>
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
            <div className={styles.title}>
              <p>You are staking:</p>
              <div className={styles.title_r}>
                <img
                  src={
                    ChainToken.filter((i) => i.name == poolInfo.name?.[0])[0]
                      ?.src
                  }
                  alt=""
                />
                <p>{poolInfo?.name?.[0]}</p>
              </div>
            </div>
            <div className={styles.balance_text}>
              Balance: {formatAmount1(poolInfo.balance)}
            </div>
            <div className={styles.input_wrap}>
              <Input
                onChange={(e) => {
                  let value = e.target.value;
                  if (!value.match(/^\d+(\.\d{0,16})?$/)) {
                    value = value.slice(0, stakeAmount.length - 1);
                  }
                  if (Number(value) > Number(poolInfo.balance)) {
                    setStakeAmount(poolInfo.balance);
                  } else {
                    setStakeAmount(value);
                  }
                }}
                value={stakeAmount}
                type="text"
                placeholder={"0.0"}
                className={styles.input_inner}
              />
              {/* <div className={styles.num}>$8.67</div> */}
            </div>
            <div className={styles.label_wrap}>
              {/* <div className={styles.item}>25%</div>
              <div className={styles.item}>50%</div> */}
              <div
                className={styles.item}
                onClick={() => setStakeAmount(poolInfo.balance)}
              >
                MAX
              </div>
            </div>
            <div className={styles.btn_wrap}>
              <Button
                className={styles.btn}
                loading={loading}
                onClick={deposit}
              >
                Confirm
              </Button>
              <div className={cx(styles.btn, styles.sei_btn)}>Get SEI</div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default memo(Stake);
