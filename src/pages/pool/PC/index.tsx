import React, {
  CSSProperties,
  memo,
  useCallback,
  useRef,
  useState,
} from "react";
import styles from "./index.less";
import venom from "@/assets/logo/block3.png";
import cx from "classnames";
import { Button, Collapse, CollapseProps, Switch } from "antd";
import sei1 from "@/assets/logo/sei1.png";
import block1 from "@/assets/logo/block1.png";
import down from "@/assets/logo/down.png";
import share from "@/assets/logo/share.png";
import metamask from "@/assets/logo/metamask.png";
import Stake from "./components/Stake";
import ImportPool from "./components/ImportPool";

const tabData = [
  { id: 1, name: "Active" },
  { id: 2, name: "Finished" },
];

function PC() {
  const [current, setCurrent] = useState<number>(1);
  const [active, setActive] = useState<boolean>(false);
  const onChange = useCallback(() => {}, []);
  const [stakeModalOpen, setStakeModalOpen] = useState(false);
  const stakeShowModal = () => {
    setStakeModalOpen(true);
  };
  const handleStakeCancel = () => {
    setStakeModalOpen(false);
  };
  const getItems: () => CollapseProps["items"] = () => [
    {
      key: "1",
      label: active ? "Hide" : "Details",
      children: (
        <div className={styles.details_wrap}>
          <div className={styles.text_item}>
            <div className={styles.time_title}>End Time:</div>
            <div>June 27, 2024, 21:07 PM</div>
          </div>
          <div className={styles.text_item}>
            <div className={styles.time_title}>Days Left:</div>
            <div>120 days</div>
          </div>
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
      ),
    },
  ];
  return (
    <div className={styles.wrap}>
      <div className={styles.title_wrap}>
        <img src={venom} alt="" />
        <div className={styles.title_r}>
          <div className={styles.title}>DeFi Zone </div>
          <div className={styles.sub_title}>
            Stake LP tokens to earn. Provide liquidity and stake.
          </div>
        </div>
      </div>
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
        <Switch
          className={styles.switch_wrap}
          defaultChecked={false}
          onChange={onChange}
        />
        <div className={styles.switch_text}>Staked only</div>
      </div>
      <div className={styles.content}>
        <div>
          <div className={styles.item_wrap}>
            <div className={styles.top_wrap}>
              <div className={styles.top_l}>
                <div className={styles.name}>Stake SEI</div>
                <div className={styles.name_1}>Earn MAMBA</div>
              </div>
              <div className={styles.top_r}>
                <img className={styles.img_b} src={sei1} alt="" />
                <img className={styles.img_s} src={block1} alt="" />
              </div>
            </div>
            <div className={styles.stake}>
              <div>My Stake:</div>
              <div className={styles.num}>225 SEI</div>
            </div>
            <div className={styles.md_wrap}>
              <div className={styles.md_text_wrap}>
                <div className={styles.text_l}>APY:</div>
                <div className={styles.text_r}>37.2%</div>
              </div>
              <div className={styles.md_text_wrap}>
                <div className={styles.text_l}>TVL:</div>
                <div className={styles.text_r}>1,273,212 USDT</div>
              </div>
              <div className={styles.text_bt}>
                <div className={styles.bt_l}>
                  <div className={styles.bt_text}>MAMBA Earned</div>
                  <div>17.2</div>
                </div>
                <Button className={styles.btn}>Claim</Button>
              </div>
            </div>
            <Button className={styles.stake_btn} onClick={stakeShowModal}>
              Stake
            </Button>
            {/* <div className={styles.stake_wrap}>
              <Button className={cx(styles.stake_btn, styles.stake_btn1)}>
                Stake +
              </Button>
              <Button className={cx(styles.stake_btn, styles.stake_btn2)}>
                Unstake
              </Button>
            </div> */}
          </div>
          <Collapse
            onChange={(v) => (v.length ? setActive(true) : setActive(false))}
            bordered={false}
            className={styles.collapse_wrap}
            expandIcon={({ isActive }) => (
              <img
                src={down}
                style={{ rotate: isActive ? "180deg" : "360deg" }}
              />
            )}
            expandIconPosition={"end"}
            items={getItems()}
          />
        </div>
        <div>
          <div className={styles.item_wrap}>
            <div className={styles.top_wrap}>
              <div className={styles.top_l}>
                <div className={styles.name}>Stake SEI</div>
                <div className={styles.name_1}>Earn MAMBA</div>
              </div>
              <div className={styles.top_r}>
                <img className={styles.img_b} src={sei1} alt="" />
                <img className={styles.img_s} src={block1} alt="" />
              </div>
            </div>
            <div className={styles.stake}>
              <div>My Stake:</div>
              <div className={styles.num}>225 SEI</div>
            </div>
            <div className={styles.md_wrap}>
              <div className={styles.md_text_wrap}>
                <div className={styles.text_l}>APY:</div>
                <div className={styles.text_r}>37.2%</div>
              </div>
              <div className={styles.md_text_wrap}>
                <div className={styles.text_l}>TVL:</div>
                <div className={styles.text_r}>1,273,212 USDT</div>
              </div>
              <div className={styles.text_bt}>
                <div className={styles.bt_l}>
                  <div className={styles.bt_text}>MAMBA Earned</div>
                  <div>17.2</div>
                </div>
                <Button className={styles.btn}>Claim</Button>
              </div>
            </div>
            {/* <Button className={styles.stake_btn}>Stake</Button> */}
            <div className={styles.stake_wrap}>
              <Button className={cx(styles.stake_btn, styles.stake_btn1)}>
                Stake +
              </Button>
              <Button className={cx(styles.stake_btn, styles.stake_btn2)}>
                Unstake
              </Button>
            </div>
          </div>
          <Collapse
            onChange={(v) => (v.length ? setActive(true) : setActive(false))}
            bordered={false}
            className={styles.collapse_wrap}
            expandIcon={({ isActive }) => (
              <img
                src={down}
                style={{ rotate: isActive ? "180deg" : "360deg" }}
              />
            )}
            expandIconPosition={"end"}
            items={getItems()}
          />
        </div>
      </div>
      {/* <Stake
        isModalOpen={stakeModalOpen}
        handleCancel={handleStakeCancel}
      ></Stake> */}
      <ImportPool
        isModalOpen={stakeModalOpen}
        handleCancel={handleStakeCancel}
      ></ImportPool>
    </div>
  );
}

export default memo(PC);
