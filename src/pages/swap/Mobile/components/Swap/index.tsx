import React, { memo, useState } from "react";
import styles from "./index.less";
import cx from "classnames";
import setting from "@/assets/logo/setting.png";
import time from "@/assets/logo/time.png";
import sei1 from "@/assets/logo/sei1.png";
import down from "@/assets/logo/down.png";
import usdt from "@/assets/logo/usdt.png";
import change from "@/assets/logo/change.png";
import refresh from "@/assets/logo/refresh.png";
import { Button } from "antd";
import SettingModal from "@/components/Mobile/SettingModal";
import SelectModal from "@/components/Mobile/SelectModal";

function Swap() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const selectShowModal = () => {
    setSelectModalOpen(true);
  };
  const selectHandleCancel = () => {
    setSelectModalOpen(false);
  };
  return (
    <div className={styles.wrap}>
      <div className={styles.title}>
        Trade tokens at MAMBA speed
        <div className={styles.icon_wrap}>
          <img src={setting} alt="" onClick={showModal} />
          <img src={time} alt="" />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.from_wrap}>
          <div className={styles.from_title}>
            <span className={styles.name}>From</span>
            <span className={styles.balance}>Balance: 10.265</span>
          </div>
          <div className={styles.from_input_wrap}>
            <div className={styles.type_wrap} onClick={selectShowModal}>
              <img className={styles.icon_img} src={usdt} alt="" />
              <span>USDC</span>
              <img src={down} alt="" />
            </div>
            <div>
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
          </div>
          <div className={styles.label_wrap}>
            <div className={styles.item}>50%</div>
            <div className={styles.item}>MAX</div>
          </div>
          <div className={styles.change_wrap}>
            <div className={styles.line}></div>
            <img className={styles.change_icon} src={change} alt="" />
          </div>
        </div>
        <div className={styles.from_wrap}>
          <div className={styles.from_title}>
            <span className={styles.name}>To</span>
            <span className={styles.balance}>Balance: 10.265</span>
          </div>
          <div className={styles.from_input_wrap}>
            <div className={styles.type_wrap}>
              <img className={styles.icon_img} src={sei1} alt="" />
              <span>SEI</span>
              <img src={down} alt="" />
            </div>
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
          </div>
          <div className={styles.label_wrap}>
            <div className={styles.item}>50%</div>
            <div className={styles.item}>MAX</div>
          </div>
        </div>
        <div className={styles.btn_wrap}>
          <Button className={styles.unlock_btn}>Unlock Wallet</Button>
        </div>
      </div>
      <div className={styles.refresh_wrap}>
        <div className={styles.refresh}>
          <img src={refresh} alt="" />
        </div>
      </div>
      <SettingModal
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
      ></SettingModal>
      <SelectModal
        isModalOpen={selectModalOpen}
        handleCancel={selectHandleCancel}
      ></SelectModal>
    </div>
  );
}

export default memo(Swap);
