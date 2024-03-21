import React, { memo, useCallback, useState } from "react";
import styles from "./index.less";
import cx from "classnames";
import { Button, Input, Modal, Radio, message } from "antd";
import close from "@/assets/logo/close.png";
import icon1 from "@/assets/logo/icon1.png";
import { getContract, toWei } from "@/components/EthersContainer";
import {
  ChainToken,
  poolContractAddress,
} from "@/components/EthersContainer/address";
import { poolAbi } from "@/components/EthersContainer/abj";
import { formatAmount1 } from "@/utils";

function Unstake({
  handleCancel,
  isModalOpen,
  poolInfo,
}: {
  handleCancel: () => void;
  isModalOpen: boolean;
  poolInfo: any;
}) {
  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [walletType] = useState<string>(
    sessionStorage.getItem("walletType") || ""
  );
  const [loading, setLoading] = useState<boolean>(false);
  const submit = useCallback(async () => {
    setLoading(true);
    const contract = await getContract(
      poolContractAddress,
      poolAbi,
      walletType
    );
    let transaction = await contract
      .withdraw(poolInfo.id, toWei(stakeAmount, poolInfo.decimals))
      .catch((err: any) => {
        message.error("fail");
        setLoading(false);
      });
    let status = await transaction.wait();
    if (status) {
      message.success("success");
      setLoading(false);
      handleCancel();
      setStakeAmount('');
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
        width={"95%"}
      >
        <div className={styles.content_warp}>
          <div className={styles.title_wrap}>
            <p>Stake LP in Pools</p>
            <img src={close} alt="" onClick={handleCancel} />
          </div>
          <div className={styles.content}>
            <div className={styles.title}>
              <p>Unstake LP in Pools</p>
              <div className={styles.title_r}>
                <p>{poolInfo?.name?.[0]}</p>
              </div>
            </div>
            <div className={styles.balance_text}>
              <div className={styles.balance_text_l}>
                <img
                  src={
                    ChainToken.filter(
                      (i) =>
                        i.name == poolInfo.name?.[0].split(" ")[0].split("-")[0]
                    )[0]?.src
                  }
                  alt=""
                />
                <img
                  src={
                    ChainToken.filter(
                      (i) =>
                        i.name ==
                        poolInfo?.name?.[0].split(" ")[0].split("-")[1]
                    )[0]?.src
                  }
                  alt=""
                />
              </div>
              <p>Balance: {formatAmount1(poolInfo.amount)}</p>
            </div>
            <div className={styles.input_wrap}>
              <Input
                onChange={(e) => {
                  let value = e.target.value;
                  if (!value.match(/^\d+(\.\d{0,16})?$/)) {
                    let newValue = value.slice(0, stakeAmount.length - 1);
                    setStakeAmount(newValue);
                  } else {
                    setStakeAmount(value);
                  }
                }}
                value={stakeAmount}
                type="text"
                placeholder={"0.0"}
                className={styles.input_inner}
              />
              {/* <div className={styles.num}>8.5 SEI</div> */}
            </div>
            <div className={styles.label_wrap}>
              {/* <div className={styles.item}>25%</div>
              <div className={styles.item}>50%</div> */}
              <div
                className={styles.item}
                onClick={() => setStakeAmount(poolInfo.amount)}
              >
                MAX
              </div>
            </div>
            <div className={styles.btn_wrap}>
              <Button loading={loading} onClick={submit} className={styles.btn}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default memo(Unstake);
