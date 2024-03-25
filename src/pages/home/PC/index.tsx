import React, { memo, useRef } from "react";
import styles from "./index.less";
import cx from "classnames";
import sei from "@/assets/logo/sei.png";
import block1 from "@/assets/logo/block1.png";
import block2 from "@/assets/logo/block2.png";
import block3 from "@/assets/logo/block3.png";
import WalletModal from "@/components/Web/WalletModal";
import { history } from "umi";

function PC() {
  return (
    <div className={styles.wrap}>
      <div className={styles.middle_content}>
        <div className={styles.title}>ENTER THE MAMBA</div>
        <div className={styles.sub_title}>
          Killer DeFi powered by
          <img src={sei} alt="" />
        </div>
        <div className={styles.item_wrap}>
          <div className={styles.item}>
            <img src={block1} alt="" />
            <p>MAMBA SWAP</p>
          </div>
          <div className={styles.item}>
            <img src={block2} alt="" />
            <p>VENOM CITY</p>
          </div>
          <div className={styles.item}>
            <img src={block3} alt="" />
            <p>DEFI ZONE</p>
          </div>
        </div>
        <div className={styles.btn_wrap}>
          {/* <div className={cx(styles.btn, styles.connect_btn)}>Connect Wallet</div> */}
          <WalletModal isbig></WalletModal>
          <div className={styles.btn} onClick={() => history.push("/Swap")}>
            Trade Now
          </div>
        </div>
        <div
          onClick={() => {
            window.open(
              "https://medium.com/@mambadefi/about-the-mamba-mentality-22f4217d8b7a",
              "_blank"
            );
          }}
          className={styles.link_text}
        >
          About the MAMBA Mentality
        </div>
      </div>
    </div>
  );
}

export default memo(PC);
