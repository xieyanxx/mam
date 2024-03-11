import React, { memo } from "react";
import styles from "./index.less";
import cx from "classnames";
import setting from "@/assets/logo/setting.png";
import icon1 from "@/assets/logo/icon1.png";
import time from "@/assets/logo/time.png";


function MyLps() {
  return (
    <div className={styles.wrap}>
      <div className={styles.title}>
        Check and remove your Liquidity
        <div className={styles.icon_wrap}>
          <img src={setting} alt="" />
          <img src={time} alt="" />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.from_title}>
          <span className={styles.name}>My Liquidity</span>
          <img src={icon1} alt="" />
        </div>

        <div className={styles.item_wrap}>
          <div className={styles.info_wrap}>
            <div className={styles.info_name}>MAMBA-SEI LP</div>
            <div className={styles.img_wrap}>
              <img src="" alt="" />
              <img src="" alt="" />
            </div>
          </div>
          <div className={styles.info_num}>
            <p>225 MAMBA</p>
            <p>225 SEI</p>
          </div>
          <div className={styles.type_wrap}>
            <div className={styles.type_name}>Available</div>
            <div className={styles.type_num}>0 LP</div>
            <div className={styles.type_name}>Staked</div>
            <div className={styles.type_num}>0 LP</div>
          </div>
          <div className={styles.remove_btn}>Remove Liquidity</div>
        </div>
        <div className={styles.item_wrap}>
          <div className={styles.info_wrap}>
            <div className={styles.info_name}>MAMBA-SEI LP</div>
            <div className={styles.img_wrap}>
              <img src="" alt="" />
              <img src="" alt="" />
            </div>
          </div>
          <div className={styles.info_num}>
            <p>225 MAMBA</p>
            <p>225 SEI</p>
          </div>
          <div className={styles.type_wrap}>
            <div className={styles.type_name}>Available</div>
            <div className={styles.type_num}>0 LP</div>
            <div className={styles.type_name}>Staked</div>
            <div className={styles.type_num}>0 LP</div>
          </div>
          <div className={styles.remove_btn}>Remove Liquidity</div>
        </div>
        <div className={styles.tip_text}>
          Don’t see a pool you joined?<span>Import it.</span>
        </div>
      </div>
      <div className={styles.refresh_wrap}>Add Liquidity</div>
    </div>
  );
}

export default memo(MyLps);
