import React, { memo, useState } from "react";
import styles from "./index.less";
import cx from "classnames";
import { Button, Input, Modal, Radio } from "antd";
import close from "@/assets/logo/close.png";
import icon1 from "@/assets/logo/icon1.png";
import down from "@/assets/logo/down.png";
import add from "@/assets/logo/add.png";

function ImportPool({
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
            <div className={styles.title_l}>
              <p>Import Pool</p>
              <img className={styles.tip_icon} src={icon1} alt="" />
            </div>
            <img src={close} alt="" onClick={handleCancel} />
          </div>
          <div className={styles.content}>
            <div className={styles.item_wrap}>
              <div className={styles.item}>
                <img src="" alt="" />
                <p>USDC</p>
                <img className={styles.down} src={down} alt="" />
              </div>
            </div>
            <img className={styles.add_icon} src={add} alt="" />
            <div className={styles.item_wrap}>
              <div className={styles.item}>
                <img src="" alt="" />
                <p>USDC</p>
                <img className={styles.down} src={down} alt="" />
              </div>
            </div>
            <div className={styles.btn_wrap}>
              <div className={styles.btn}>Import</div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default memo(ImportPool);
