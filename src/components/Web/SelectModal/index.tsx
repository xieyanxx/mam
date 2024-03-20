import React, { memo, useCallback, useState } from "react";
import styles from "./index.less";
import cx from "classnames";
import { Button, Input, Modal, message } from "antd";
import close from "@/assets/logo/close.png";

import search from "@/assets/logo/search.png";
import share from "@/assets/logo/share.png";
import coingecko from "@/assets/logo/coingecko.png";
import icon1 from "@/assets/logo/icon1.png";
import {
  ChainToken,
  readyContractAddress,
} from "@/components/EthersContainer/address";
import { getContract } from "@/components/EthersContainer";
import { readyAbi } from "@/components/EthersContainer/abj";
import { debounce, slice } from "lodash";

function WalletModal({
  handleCancel,
  isModalOpen,
  selectAddress,
}: {
  handleCancel: () => void;
  isModalOpen: boolean;
  selectAddress: (val: any) => void;
}) {
  const [walletType] = useState<string>(
    sessionStorage.getItem("walletType") || ""
  );
  const [address] = useState<string>(sessionStorage.getItem("address") || "");
  const [searchValue, setSearchValue] = useState<string>("");
  const [listData, setListData] = useState<any>(
    ChainToken.concat(JSON.parse(localStorage.getItem("storageList") || "[]"))
  );
  const getSerchData = useCallback(
    debounce(async (val: string) => {
      //有值就查询、无值显示默认
      if (val) {
        const contract = await getContract(
          readyContractAddress,
          readyAbi,
          walletType
        );
        const addresData = await contract.getContract(val).catch(() => {
          message.error("invalid address");
        });
        if (addresData) {
          //表示默认值中存在，不需要存在storage中
          let isExist = ChainToken.filter((item) => item.name == addresData[0]);
          if (isExist.length) {
            setListData(isExist);
          } else {
            let newObj = {
              id: ChainToken.length + 1,
              src: icon1,
              name: addresData[0],
              name1: addresData[1],
              address: val,
              address1: val,
            };
            let storageData = JSON.parse(
              localStorage.getItem("storageList") || "[]"
            );
            localStorage.setItem(
              "storageList",
              JSON.stringify(storageData.concat([newObj]))
            );
            setListData([newObj]);
          }
        }
      } else {
        let storageData = JSON.parse(
          localStorage.getItem("storageList") || "[]"
        );
        setListData(ChainToken.concat(storageData));
      }
    }, 500),
    []
  );
  return (
    <div className={styles.wrap}>
      <Modal
        title=""
        open={isModalOpen}
        footer={""}
        closable={false}
        onCancel={handleCancel}
        wrapClassName={styles.modal_wrap}
        width={839}
      >
        <div className={styles.content_warp}>
          <div className={styles.title_wrap}>
            <p>Select a token</p>
            <img
              src={close}
              alt=""
              onClick={() => {
                handleCancel();
                setSearchValue("");
                getSerchData("");
              }}
            />
          </div>
          <div className={styles.search_wrap}>
            <img src={search} alt="" />
            <Input
              onChange={(e) => {
                let value = e.target.value;
                let newValue = value.replace(/[^a-zA-Z0-9]/g, "");
                setSearchValue(newValue);
                getSerchData(newValue);
              }}
              value={searchValue}
              className={styles.input_wrap}
              placeholder="Search name or paste address"
            />
          </div>
          <div className={styles.common_wrap}>
            {ChainToken.slice(0, 4).map((item) => (
              <div
                className={styles.common_item}
                key={item.id}
                onClick={() => {
                  selectAddress(item);
                  setSearchValue("");
                  getSerchData("");
                }}
              >
                <img src={item.src} alt="" />
                {item.name}
              </div>
            ))}
          </div>
          <div className={styles.line}></div>
          <div className={styles.item_wrap}>
            {listData.map((item: any) => (
              <div
                key={item.address}
                className={styles.item}
                onClick={() => {
                  selectAddress(item);
                  setSearchValue("");
                  getSerchData("");
                }}
              >
                <img src={item.src} alt="" className={styles.logo} />
                <div className={styles.name_wrap}>
                  <div className={styles.name}>{item.name}</div>
                  <div className={styles.sub_name}>{item.name1}</div>
                </div>
                <div className={styles.icon_wrap}>
                  <img src={share} alt="" />
                  <img src={coingecko} alt="" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default memo(WalletModal);
