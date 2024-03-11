import React, { memo, useState } from "react";
import styles from "./index.less";
import cx from "classnames";
import { Button, Input, Modal, Radio } from "antd";
import close from "@/assets/logo/close.png";
import icon1 from "@/assets/logo/icon1.png";

function Stake({
  handleCancel,
  isModalOpen,
}: {
  handleCancel: () => void;
  isModalOpen: boolean;
}) {
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
            <p>Stake LP in Pools</p>
            <img src={close} alt="" onClick={handleCancel} />
          </div>
          <div className={styles.content}>
            <div className={styles.title}>
              <p>You are staking:</p>
              <div className={styles.title_r}>
                <p>MAMBA-SEI LP</p>
              </div>
            </div>
            <div className={styles.balance_text}>
              <div className={styles.balance_text_l}>
                <img src="" alt="" />
                <img src="" alt="" />
              </div>
              <p>Balance: 420</p>
            </div>
            <div className={styles.input_wrap}>
              <div className={styles.num}>10.5 MAMBA</div>
              <div className={styles.num}>8.5 SEI</div>
            </div>

            <div className={styles.btn_wrap}>
              <div className={styles.btn}>Confirm</div>
              <div className={cx(styles.btn, styles.sei_btn)}>
                Add Liquidity
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default memo(Stake);
