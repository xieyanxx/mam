import React, { memo, useState } from "react";
import styles from "./index.less";
import cx from "classnames";
import { Button, Input, Modal, Radio } from "antd";
import close from "@/assets/logo/close.png";
import down1 from "@/assets/logo/down1.png";
import { formatAmount, formatAmount1 } from "@/utils";

function AddLiquidity({
  handleCancel,
  isModalOpen,
  formData,
  toData,
  settingData,
}: {
  handleCancel: () => void;
  isModalOpen: boolean;
  formData: any;
  toData: any;
  settingData: any;
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
            <p>Confirm Swap</p>
            <img src={close} alt="" onClick={handleCancel} />
          </div>
          <div className={styles.content}>
            <div className={styles.num_wrap}>
              <div className={styles.num_item}>
                <p className={styles.num}>{formatAmount1(formData.amount)}</p>
                <div className={styles.num_r}>
                  <img src={formData.src} alt="" />
                  <p>{formData.name}</p>
                </div>
              </div>
              <img className={styles.icon} src={down1} alt="" />
              <div className={styles.num_item}>
                <p className={styles.num}>{formatAmount1(toData.amount)}</p>
                <div className={styles.num_r}>
                  <img src={toData.src} alt="" />
                  <p>{toData.name}</p>
                </div>
              </div>
            </div>
            <div className={styles.share_wrap}>
              <div>Slippage Tolerance: </div>
              <div className={styles.Share_r}>{settingData.num}%</div>
            </div>
            <div className={styles.price_wrap}>
              <div className={styles.price_item}>
                <p className={styles.name}>price:</p>
                <p>10.5 MAMBA</p>
              </div>
              <div className={styles.price_item}>
                <p className={styles.name}>Minimum received:</p>
                <p>10.5 MAMBA</p>
              </div>
              <div className={styles.price_item}>
                <p className={styles.name}>Price impact:</p>
                <p>10.5 MAMBA</p>
              </div>
              <div className={styles.price_item}>
                <p className={styles.name}>Trading fee:</p>
                <p>0.00002 SEI</p>
              </div>
            </div>
            <div className={styles.btn_wrap}>
              <div className={styles.btn}>Swap</div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default memo(AddLiquidity);
