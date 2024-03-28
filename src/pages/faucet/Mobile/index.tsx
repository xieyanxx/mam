import { getContract } from "@/components/EthersContainer";
import { claimAbi } from "@/components/EthersContainer/abj";
import { claimMAMBAContractAddress } from "@/components/EthersContainer/address";
import { Button, message } from "antd";
import { memo, useState } from "react";
import styles from "./index.less";

function Mobile() {
  const [loading, setLoading] = useState<boolean>(false);
  const [address] = useState<string>(sessionStorage.getItem("address") || "");
  const [walletType] = useState<string>(
    sessionStorage.getItem("walletType") || ""
  );
  const handleClaim = async () => {
    setLoading(true);
    const contract = await getContract(
      claimMAMBAContractAddress,
      claimAbi,
      walletType
    );

    let transaction = await contract.claimToken().catch((err: any) => {
      message.error("Received today");
      setLoading(false);
    });
    let status = await transaction?.wait();
    if (status) {
      message.success("success");
      setLoading(false);
    }
  };
  return (
    <div className={styles.wrap}>
      <div className={styles.sub_title}>
        Each account can receive 10,000 MAMBA every day
      </div>
      <Button
        className={styles.coming_wrap}
        loading={loading}
        onClick={handleClaim}
      >
        claim MAMBA
      </Button>
    </div>
  );
}

export default memo(Mobile);
