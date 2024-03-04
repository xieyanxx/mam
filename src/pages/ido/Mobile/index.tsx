import React, { memo, useState } from "react";
import { history } from "umi";
import styles from "./index.less";
import sei from "@/assets/logo/sei.png";
import snake from "@/assets/logo/snake.png";

function Mobile() {
  return (
    <div className={styles.wrap}>
      <div className={styles.title}>
        The LETHAL LAUNCHPAD to
        <img src={sei} alt="" />
      </div>
      <div className={styles.sub_title}>
        We make it simple, easy and secure <br /> to bring new and innovative
        assets to SEI
      </div>
      <div className={styles.coming_wrap}>Coming Soon</div>
      <div className={styles.get_wrap}>
        <img src={snake} alt="" />
        <div>Get ready...</div>
      </div>
    </div>
  );
}

export default memo(Mobile);
