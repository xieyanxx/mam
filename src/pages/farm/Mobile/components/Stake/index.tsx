import React, { memo, useCallback, useState } from "react";
import styles from "./index.less";
import cx from "classnames";
import { Button, Input, Modal, Radio, message } from "antd";
import close from "@/assets/logo/close.png";
import icon1 from "@/assets/logo/icon1.png";
import { getContract, toWei } from "@/components/EthersContainer";
import { farmContractAddress } from "@/components/EthersContainer/address";
import { farmAbi } from "@/components/EthersContainer/abj";

function Stake({
  handleCancel,
  isModalOpen,
  poolId,
  poolInfo,
}: {
  handleCancel: () => void;
  isModalOpen: boolean;
  poolId: number;
  poolInfo: any;
}) {
  const [stakeAmount, setStakeAmount] = useState<string>("0");
  const [walletType] = useState<string>(
    sessionStorage.getItem("walletType") || ""
  );
  const [loading, setLoading] = useState<boolean>(false);

  const deposit = useCallback(async () => {
    const contract = await getContract(
      farmContractAddress,
      farmAbi,
      walletType
    );
    let transaction = await contract
      .deposit(poolId, toWei(stakeAmount, poolInfo.decimals))
      .wait()
      .catch((err: any) => {
        message.error("fail");
        setLoading(false);
      });
    if (transaction) {
      message.success("success");
      setLoading(false);
      handleCancel();
    }
  }, [stakeAmount]);
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
            <p>Stake in Farm</p>
            <img src={close} alt="" onClick={handleCancel} />
          </div>
          <div className={styles.content}>
            <div className={styles.title}>
              <p>You are staking:</p>
              <div className={styles.title_r}>
                <img src="" alt="" />
                <p>{poolInfo?.name?.[0]}</p>
              </div>
            </div>
            <div className={styles.balance_text}>Balance: 420</div>
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
              <div className={styles.num}>$8.67</div>
            </div>
            <div className={styles.label_wrap}>
              <div className={styles.item}>25%</div>
              <div className={styles.item}>50%</div>
              <div className={styles.item}>MAX</div>
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
