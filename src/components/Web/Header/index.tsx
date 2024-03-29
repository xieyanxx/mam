import React from "react";
import { history, NavLink } from "umi";

import logo from "@/assets/logo/logo.png";
import WalletModal from "../WalletModal";
import styles from "./index.less";
type Props = {
  isIndex?: boolean;
};

const Header: React.FC<Props> = () => {
  const getActiveClass = ({ isActive }: { isActive: any }) => {
    return isActive ? "navActive" : "navItem";
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
    {
      name: "Faucet",
      urlLink: "Faucet",
    },
  ];
  const onMenuClick = (path: string) => {
    history.push(path);
  };

  return (
    <div className={styles.header_warp}>
      <div className={styles.header_left} onClick={() => onMenuClick("/")}>
        <img src={logo} alt="#" className={styles.logo} />
        <span>MAMBA</span>
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
      <WalletModal iscard={false}></WalletModal>
    </div>
  );
};
export default Header;
