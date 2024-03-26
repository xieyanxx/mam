import cx from "classnames";
import { memo, useCallback, useEffect, useState } from "react";
import Liquidity from "./components/Liquidity";
import MyLps from "./components/MyLps";
import Swap from "./components/Swap";
import styles from "./index.less";
const tabData = [
  { id: 1, name: "Swap" },
  { id: 2, name: "Liquidity" },
  { id: 3, name: "My LPs" },
];
function Mobile() {
  const [current, setCurrent] = useState<number>(1);
  const onChangeTab = useCallback((val: number) => {
    setCurrent(val);
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    if (id) {
      setCurrent(Number(id));
    }
  }, []);
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
      {current == 1 && <Swap></Swap>}
      {current == 2 && <Liquidity />}
      {current == 3 && <MyLps onchangTab={(val: number) => onChangeTab(val)} />}
    </div>
  );
}

export default memo(Mobile);
