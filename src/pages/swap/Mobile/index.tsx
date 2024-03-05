import React, { memo, useState } from "react";
import { history } from "umi";
import styles from "./index.less";
import cx from "classnames";
import Swap from "./components/Swap";
const tabData = [
  { id: 1, name: "Swap" },
  { id: 2, name: "Liquidity" },
];
function Mobile() {
  const [current, setCurrent] = useState<number>(1);
  return (
    <div className={styles.wrap}>
      <div className={styles.tab_wrap}>
        {tabData.map((item) => (
          <div
            key={item.id}
            className={cx(styles.tab_item, current == item.id && styles.active)}
            onClick={() => setCurrent(item.id)}
          >
            {item.name}
          </div>
        ))}
      </div>
      <Swap></Swap>
    </div>
  );
}

export default memo(Mobile);
