import React, { memo, useRef } from "react";
import styles from "./index.less";
import telegrama from "@/assets/logo/telegrama.png";
import Twitter from "@/assets/logo/Twitter.png";
import medium from "@/assets/logo/medium.png";
import github from "@/assets/logo/github.png";
import telegrama1 from "@/assets/logo/telegrama1.png";
import Twitter1 from "@/assets/logo/Twitter1.png";
import medium1 from "@/assets/logo/medium1.png";
import github1 from "@/assets/logo/github1.png";
import { useMobileToggle } from "@/hooks/useMobileToggle";
import cx from "classnames";

function Footer() {
  const isMobile = useMobileToggle();
  const linkData = [
    { id: 1, src: telegrama, src1: telegrama1, link: "https://t.me/MAMBADeFi" },
    {
      id: 2,
      src: Twitter,
      src1: Twitter1,
      link: "https://twitter.com/MambaDeFi",
    },
    {
      id: 3,
      src: medium,
      src1: medium1,
      link: "https://medium.com/@mambadefi",
    },
    { id: 4, src: github, src1: github1, link: "https://github.com/" },
  ];
  return (
    <div className={cx(styles.footer, isMobile && styles.m_footer)}>
      <div className={styles.link_wrap}>
        {linkData.map((item) => (
          <img
            className={isMobile ? styles.img_icon : ""}
            src={isMobile ? item.src1 : item.src}
            key={item.id}
            onClick={() => window.open(item.link)}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(Footer);
