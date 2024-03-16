import React, { memo, useState } from "react";
import styles from "./index.less";
import cx from "classnames";
import { Button, Input, Modal, Progress, Radio } from "antd";
import close from "@/assets/logo/close.png";
import icon1 from "@/assets/logo/icon1.png";

function RemoveLiquidity({
  handleCancel,
  isModalOpen,
  removeData,
}: {
  handleCancel: () => void;
  isModalOpen: boolean;
  removeData:any
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
            <Radio.Group
              defaultValue="a"
              buttonStyle="solid"
              className={styles.radio_wrap}
            >
              <Radio.Button value="0.3">25%</Radio.Button>
              <Radio.Button value="0.5">50%</Radio.Button>
              <Radio.Button value="1">75%</Radio.Button>
              <Radio.Button value="0">Max</Radio.Button>
            </Radio.Group>
            <Progress className={styles.progress_wrap} strokeLinecap="butt" percent={75} />
            <div className={styles.btn_wrap}>
              <div className={styles.btn}>Remove</div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default memo(RemoveLiquidity);
