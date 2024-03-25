import React, { useEffect, useState } from "react";
import { history, Link, NavLink } from "umi";

import styles from "./index.less";
import logo from "@/assets/logo/logo.png";
import English from "@/assets/logo/English.png";
import cx from "classnames";
import WalletModal from "../WalletModal";
type Props = {
  isIndex?: boolean;
};

const Header: React.FC<Props> = () => {
  const getActiveClass = ({ isActive }: { isActive: any }) => {
    return isActive ? "navActivem" : "navItemm";
  };
  const routeData = [
    {
      name: "Home",
      urlLink: "/",
    },
    {
      name: "Pool",
      urlLink: "Pool",
    },
    {
      name: "Farm",
      urlLink: "Farm",
    },
    {
      name: "Swap",
      urlLink: "Swap",
    },
    {
      name: "IDO",
      urlLink: "Ido",
    },
  ];
  const onMenuClick = (path: string) => {
    history.push(path);
  };

  return (
    <div className={styles.header_warp}>
      <div className={styles.header_top}>
        <div className={styles.header_left} onClick={() => onMenuClick("/")}>
          <img src={logo} alt="#" className={styles.logo} />
          <span>MAMBA</span>
        </div>
        <div className={styles.header_right}>
          <div className={styles.lang_wrap}>
            <img src={English} alt="" />
          </div>
          <WalletModal></WalletModal>
          {/* <div className={styles.connect_btn}>Connect</div> */}
        </div>
      </div>
      <div className={styles.header_middle}>
        {routeData.map((item) => {
          return (
            <NavLink
              to={item.urlLink}
              key={item.urlLink}
              className={getActiveClass}
            >
              {item.name}
            </NavLink>
          );
        })}
      </div>
      {/* <WalletModal></WalletModal> */}
      {/* <div className={styles.connect_btn}>Connect Wallet</div> */}
    </div>
  );
};
export default Header;
