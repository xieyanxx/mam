import React, { memo, useState } from "react";
import styles from "./index.less";
import cx from "classnames";
import { Button, Input, Modal, Radio } from "antd";
import close from "@/assets/logo/close.png";
import icon1 from "@/assets/logo/icon1.png";

function Unstake({
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
            <p>Unstake in Farm</p>
            <img src={close} alt="" onClick={handleCancel} />
          </div>
          <div className={styles.content}>
            <div className={styles.title}>
              <p>You are withdrawing:</p>
              <div className={styles.title_r}>
                <img src="" alt="" />
                <p>SEI</p>
              </div>
            </div>
            <div className={styles.balance_text}>Balance: 420</div>
            <div className={styles.input_wrap}>
              <input
                // onKeyUp={(e) => {
                //   if (!stakeAmount.match(/^\d+(\.\d{0,16})?$/)) {
                //     stakeAmount = stakeAmount.slice(0, stakeAmount.length - 1);
                //   }
                // }}
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
              <div className={styles.btn}>Confirm</div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default memo(Unstake);
