import React, { memo, useCallback, useEffect, useState } from "react";
import styles from "./index.less";
import cx from "classnames";
import { Button, Input, Modal, Radio, message } from "antd";
import close from "@/assets/logo/close.png";
import icon1 from "@/assets/logo/icon1.png";

function SettingModal({
  handleCancel,
  isModalOpen,
  saveSetting,
  settingData,
}: {
  handleCancel: () => void;
  isModalOpen: boolean;
  saveSetting: (time: number, num: number) => void;
  settingData: {
    time: number;
    num: number;
  };
}) {
  const [time, setTime] = useState(settingData.time);
  const [num, setNum] = useState(settingData.num);
  const [enterNum, setEnterNum] = useState("");
  const changeNum = useCallback((e: any) => {
    if (e.target.value !== 0) {
      setEnterNum("");
    }
    setNum(e.target.value);
  }, []);
  const submit = () => {
    let saveNum = 0;
    if (num !== 0) {
      saveNum = num;
    } else {
      saveNum = Number(enterNum);
    }
    if (!saveNum || !time) {
      message.error("Please enter");
      return;
    }
    saveSetting(time, saveNum);
    handleCancel();
  };
  const getNum = () => {
    if (
      settingData.num !== 0.3 &&
      settingData.num !== 0.5 &&
      settingData.num !== 1
    ) {
      setEnterNum(settingData.num.toString());
      setNum(0);
    } else {
      setNum(settingData.num);
      setEnterNum("");
    }
  };
  useEffect(() => {
    if (isModalOpen) getNum();
  }, [isModalOpen]);
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
            <p>Settings</p>
            <img src={close} alt="" onClick={handleCancel} />
          </div>
          <div className={styles.content}>
            <div className={styles.title}>
              Slippage Tolerance <img src={icon1} alt="" />
            </div>
            <Radio.Group
              value={num}
              buttonStyle="solid"
              className={styles.radio_wrap}
              onChange={changeNum}
            >
              <Radio.Button value={0.3}>0.3%</Radio.Button>
              <Radio.Button value={0.5}>0.5</Radio.Button>
              <Radio.Button value={1}>1%</Radio.Button>
              <Radio.Button value={0}>
                <Input
                  onChange={(e) => {
                    let value = e.target.value;
                    if (!value.match(/^\d+(\.\d{0,16})?$/)) {
                      let newValue = value.slice(0, -1);
                      setEnterNum(newValue);
                    } else {
                      setEnterNum(value);
                    }
                    setNum(0);
                  }}
                  value={enterNum}
                  type="text"
                  placeholder={"Custom 0.0% "}
                  className={styles.input_inner}
                />
              </Radio.Button>
            </Radio.Group>
            <div className={styles.time_wrap}>
              <p>Transaction Deadline</p>
              <img src={icon1} alt="" />
              <Input
                // placeholder="Basic usage"
                onChange={(e) => {
                  let value = e.target.value;
                  if (!value.match(/^\d*$/)) {
                    let newValue = value.slice(0, -1);
                    setTime(Number(newValue));
                  } else {
                    setTime(Number(value));
                  }
                }}
                value={time}
                className={styles.input_wrap}
              />
              <p>Minutes</p>
            </div>
            <div className={styles.btn_wrap}>
              <div className={styles.btn} onClick={submit}>
                Save
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default memo(SettingModal);
