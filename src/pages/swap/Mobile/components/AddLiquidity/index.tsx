import React, { memo, useState } from "react";
import styles from "./index.less";
import cx from "classnames";
import { Button, Input, Modal, Radio } from "antd";
import close from "@/assets/logo/close.png";
import icon1 from "@/assets/logo/icon1.png";

function AddLiquidity({
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
        width={"95%"}
      >
        <div className={styles.content_warp}>
          <div className={styles.title_wrap}>
            <p>Add Liquidity</p>
            <img src={close} alt="" onClick={handleCancel} />
          </div>
          <div className={styles.content}>
            <div className={styles.title}>
              <img src="" alt="" />
              <img src="" alt="" />
              <p>MAMBA-SEI </p>
            </div>
            <div className={styles.num_wrap}>
              <div className={styles.num_item}>
                <img src="" alt="" />
                <p>10.5 MAMBA</p>
              </div>
              <div className={styles.num_item}>
                <img src="" alt="" />
                <p>8.5 SEI</p>
              </div>
            </div>
            <div className={styles.transfer_wrap}>
              <div>Rates:</div>
              <div className={styles.transfer_r}>
                <p>1 MAMBA = 1.23 SEI</p>
                <p>1 SEI = 0.81 MAMBA</p>
              </div>
            </div>
            <div className={styles.Share_wrap}>
              <div>Share of pool: </div>
              <div className={styles.Share_r}>0.25%</div>
            </div>
            <div className={styles.btn_wrap}>
              <div className={styles.btn}>Add</div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default memo(AddLiquidity);
