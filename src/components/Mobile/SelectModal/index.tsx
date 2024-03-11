import React, { memo, useState } from "react";
import styles from "./index.less";
import cx from "classnames";
import { Button, Input, Modal } from "antd";
import close from "@/assets/logo/close.png";

import search from "@/assets/logo/search.png";
import block1 from "@/assets/logo/block1.png";
import share from "@/assets/logo/share.png";
import coingecko from "@/assets/logo/coingecko.png";

function WalletModal({
  handleCancel,
  isModalOpen,
}: {
  handleCancel: () => void;
  isModalOpen: boolean;
}) {
  return (
    <div className={styles.wrap}>
      <Modal
        title=""
        open={isModalOpen}
        footer={""}
        closable={false}
        onCancel={handleCancel}
        wrapClassName={styles.modal_wrap}
        width={"95%"}
      >
        <div className={styles.content_warp}>
          <div className={styles.title_wrap}>
            <p>Select a token</p>
            <img src={close} alt="" onClick={handleCancel} />
          </div>
          <div className={styles.search_wrap}>
            <img src={search} alt="" />
            <Input
              className={styles.input_wrap}
              placeholder="Search name or paste address"
            />
          </div>
          <div className={styles.common_wrap}>
            <div className={styles.common_item}>
              <img src={block1} alt="" />
              MAMBA
            </div>
          </div>
          <div className={styles.line}></div>
          <div className={styles.item_wrap}>
            <div className={styles.item}>
              <img src="" alt="" className={styles.logo} />
              <div className={styles.name_wrap}>
                <div className={styles.name}>ASTRO</div>
                <div className={styles.sub_name}>Astroport</div>
              </div>
              <div className={styles.icon_wrap}>
                <img src={share} alt="" />
                <img src={coingecko} alt="" />
              </div>
            </div>
            <div className={styles.item}>
              <img src="" alt="" className={styles.logo} />
              <div className={styles.name_wrap}>
                <div className={styles.name}>ASTRO</div>
                <div className={styles.sub_name}>Astroport</div>
              </div>
              <div className={styles.icon_wrap}>
                <img src={share} alt="" />
                <img src={coingecko} alt="" />
              </div>
            </div>
            <div className={styles.item}>
              <img src="" alt="" className={styles.logo} />
              <div className={styles.name_wrap}>
                <div className={styles.name}>ASTRO</div>
                <div className={styles.sub_name}>Astroport</div>
              </div>
              <div className={styles.icon_wrap}>
                <img src={share} alt="" />
                <img src={coingecko} alt="" />
              </div>
            </div>
            <div className={styles.item}>
              <img src="" alt="" className={styles.logo} />
              <div className={styles.name_wrap}>
                <div className={styles.name}>ASTRO</div>
                <div className={styles.sub_name}>Astroport</div>
              </div>
              <div className={styles.icon_wrap}>
                <img src={share} alt="" />
                <img src={coingecko} alt="" />
              </div>
            </div>
            <div className={styles.item}>
              <img src="" alt="" className={styles.logo} />
              <div className={styles.name_wrap}>
                <div className={styles.name}>ASTRO</div>
                <div className={styles.sub_name}>Astroport</div>
              </div>
              <div className={styles.icon_wrap}>
                <img src={share} alt="" />
                <img src={coingecko} alt="" />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default memo(WalletModal);
