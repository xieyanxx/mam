import React, { memo, useCallback, useState } from "react";
import { history } from "umi";
import cx from "classnames";
import styles from "./index.less";
import { Button, Collapse, CollapseProps, Switch } from "antd";
import down from "@/assets/logo/down.png";
import sei1 from "@/assets/logo/sei1.png";
import block1 from "@/assets/logo/block1.png";
import share from "@/assets/logo/share.png";
import metamask from "@/assets/logo/metamask.png";
import Stake from "./components/Stake";

const tabData = [
  { id: 1, name: "Active" },
  { id: 2, name: "Finished" },
];
function Mobile() {
  const [current, setCurrent] = useState<number>(1);
  const [hasListId, setHasListId] = useState<number[]>([0, 1]);
  const [active, setActive] = useState<boolean>(false);
  const [stakeModalOpen, setStakeModalOpen] = useState(false);
  const stakeShowModal = () => {
    setStakeModalOpen(true);
  };
  const handleStakeCancel = () => {
    setStakeModalOpen(false);
  };
  const getItems: (current: number) => CollapseProps["items"] = () => [
    {
      key: "1",
      label: (
        <div className={styles.header_wrap}>
          <div className={styles.name_wrap}>
            <div className={styles.name}>Stake SEI</div>
            <div className={styles.name1}>Earn MAMBA</div>
          </div>
          <div className={styles.top_m}>
            <img className={styles.img_b} src={sei1} alt="" />
            <img className={styles.img_s} src={block1} alt="" />
          </div>
          <div className={styles.top_r}>
            <div className={styles.top_r_text}>APY</div>
            <div>32.5%</div>
          </div>
        </div>
      ),
      children: (
        <div className={styles.details_wrap}>
          {active && (
            <div className={styles.text_num_wrap}>
              <div className={styles.num_item}>
                My Stake: <span>225 SEI</span>
              </div>
              <div className={styles.num_item}>
                TVL: <span>1,216,245 SEI</span>
              </div>
            </div>
          )}

          <div className={styles.claim_wrap}>
            <div className={styles.claim_l}>
              <div className={styles.claim_name}>MAMBA Earned</div>
              <div>17.2</div>
            </div>
            <Button className={styles.btn}>Claim</Button>
          </div>
          <div className={styles.btn_wrap}>
            <Button className={styles.stake_btn} onClick={stakeShowModal}>
              Stake
            </Button>
          </div>

          <div className={styles.stake_wrap}>
            <Button className={cx(styles.stake_btn, styles.stake_btn1)}>
              Stake +
            </Button>
            <Button className={cx(styles.stake_btn, styles.stake_btn2)}>
              Unstake
            </Button>
          </div>
          <div className={styles.bottom_wrap}>
            <div className={styles.left}>
              <div className={styles.left_item}>
                End Time:<span>June 27, 2024, 21:07 PM</span>
              </div>
              <div className={styles.left_item}>
                Days Left: <span>120 days</span>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.share_wrap}>
                <p>USDT Token Info</p> <img src={share} alt="" />
              </div>
              <div className={styles.share_wrap}>
                <p>Farm Contract</p> <img src={share} alt="" />
              </div>
              <div className={styles.share_wrap}>
                <p>Add to Wallet</p> <img src={metamask} alt="" />
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];
  const onChange = useCallback(() => {}, []);
  return (
    <div className={styles.wrap}>
      <div className={styles.content_wrap}>
        <div className={styles.tab_wrap}>
          {tabData.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setCurrent(tab.id)}
              className={cx(
                styles.tab_item,
                current == tab.id && styles.active
              )}
            >
              {tab.name}
            </div>
          ))}
        </div>
        <div className={styles.switch_wrap}>
          <Switch defaultChecked={false} onChange={onChange} />
          <div className={styles.switch_text}>Staked only</div>
        </div>
      </div>
      <div className={styles.list_wrap}>
        {tabData.map((item, index) => (
          <div className={styles.list_item} key={item.id}>
            <div className={styles.top_wrap}>
              <Collapse
                onChange={(v) => {
                  if (v.length) {
                    setActive(true);
                    setHasListId(hasListId.filter((i) => i !== index));
                  } else {
                    setActive(false);
                    setHasListId([...hasListId, index]);
                  }
                }}
                bordered={false}
                className={styles.collapse_wrap}
                expandIcon={({ isActive }) => (
                  <img
                    src={down}
                    style={{ rotate: isActive ? "180deg" : "360deg" }}
                  />
                )}
                expandIconPosition={"end"}
                items={getItems(index)}
              />
            </div>
            {hasListId.some((i) => i == index) && (
              <div className={styles.down_bottom}>
                <div className={styles.num_item}>
                  My Stake: <span>225 SEI</span>
                </div>
                <div className={styles.num_item}>
                  TVL: <span>1,216,245 SEI</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* <div className={styles.list_item}>
          <div className={styles.top_wrap}>
            <Collapse
              onChange={(v) => {
                v.length ? setActive(true) : setActive(false);
                setActiveCurrent(1);
              }}
              bordered={false}
              className={styles.collapse_wrap}
              expandIcon={({ isActive }) => (
                <img
                  src={down}
                  style={{ rotate: isActive ? "180deg" : "360deg" }}
                />
              )}
              expandIconPosition={"end"}
              items={getItems(1)}
            />
          </div>
          {current !== activeCurrent && !active && (
            <div className={styles.down_bottom}>
              <div className={styles.num_item}>
                My Stake: <span>225 SEI</span>
              </div>
              <div className={styles.num_item}>
                TVL: <span>1,216,245 SEI</span>
              </div>
            </div>
          )}
        </div> */}
      </div>
      <Stake
        isModalOpen={stakeModalOpen}
        handleCancel={handleStakeCancel}
      ></Stake>
    </div>
  );
}

export default memo(Mobile);
