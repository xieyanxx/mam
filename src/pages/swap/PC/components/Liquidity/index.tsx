import React, { memo } from "react";
import styles from "./index.less";
import cx from "classnames";
import setting from "@/assets/logo/setting.png";
import time from "@/assets/logo/time.png";
import sei1 from "@/assets/logo/sei1.png";
import down from "@/assets/logo/down.png";
import usdt from "@/assets/logo/usdt.png";
import add from "@/assets/logo/add.png";
import { Button } from "antd";

function Liquidity() {
  return (
    <div className={styles.wrap}>
      <div className={styles.title}>
        Add liquidity to get LP tokens
        <div className={styles.icon_wrap}>
          <img src={setting} alt="" />
          <img src={time} alt="" />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.from_wrap}>
          <div className={styles.from_title}>
            <span className={styles.name}>Token 1</span>
            <span className={styles.balance}>Balance: 10.265</span>
          </div>
          <div className={styles.from_input_wrap}>
            <div className={styles.type_wrap}>
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
            {/* <div className={styles.line}></div> */}
            <img className={styles.change_icon} src={add} alt="" />
          </div>
        </div>
        <div className={styles.from_wrap}>
          <div className={styles.from_title}>
            <span className={styles.name}>Token 2</span>
            <span className={styles.balance}>Balance: 10.265</span>
          </div>
          <div className={styles.from_input_wrap}>
            <div className={styles.type_wrap}>
              <img className={styles.icon_img} src={sei1} alt="" />
              <span>SEI</span>
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
        </div>
        <div className={styles.initial_wrap}>
        <div className={styles.initial_title}>Initial Prices & Pool Share</div>
        <div className={styles.initial_content}>
          <div className={styles.item_wrap}>
            <div className={styles.item_num}>1</div>
            <div>USDC per SEI</div>
          </div>
          <div className={styles.item_wrap}>
            <div className={styles.item_num}>1</div>
            <div>USDC per SEI</div>
          </div>
          <div className={styles.item_wrap}>
            <div className={styles.item_num}>1</div>
            <div>USDC per SEI</div>
          </div>
        </div>
      </div>
        <div className={styles.btn_wrap}>
          <Button className={styles.unlock_btn}>Add liquidity</Button>
        </div>
      </div>
     
      <div className={styles.refresh_wrap}>Check my Liquidity Pools</div>
    </div>
  );
}

export default memo(Liquidity);
