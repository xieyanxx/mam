import React, { memo, useState } from "react";
import styles from "./index.less";
import cx from "classnames";
import { Button, Input, Modal, Radio } from "antd";
import close from "@/assets/logo/close.png";
import icon1 from "@/assets/logo/icon1.png";

function SettingModal({
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
            <p>Settings</p>
            <img src={close} alt="" onClick={handleCancel} />
          </div>
          <div className={styles.content}>
            <div className={styles.title}>
              Slippage Tolerance <img src={icon1} alt="" />
            </div>
            <Radio.Group
              defaultValue="a"
              buttonStyle="solid"
              className={styles.radio_wrap}
            >
              <Radio.Button value="0.3">0.3%</Radio.Button>
              <Radio.Button value="0.5">0.5</Radio.Button>
              <Radio.Button value="1">1%</Radio.Button>
              <Radio.Button value="0">Custom 0.00%</Radio.Button>
            </Radio.Group>
            <div className={styles.time_wrap}>
              <p>Transaction Deadline</p>
              <img src={icon1} alt="" />
              <Input
                // placeholder="Basic usage"
                defaultValue="20"
                className={styles.input_wrap}
              />
              <p>Minutes</p>
            </div>
            <div className={styles.btn_wrap}>
              <div className={styles.btn}>Save</div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default memo(SettingModal);
