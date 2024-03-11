import React, { memo } from "react";
import { useMobileToggle } from "@/hooks/useMobileToggle";
import PC from "./PC";
import Mobile from "./Mobile";
import { formWei, getContract } from "@/components/EthersContainer";
import { farmContractAddress } from "@/components/EthersContainer/address";
import { tokenAbi } from "@/components/EthersContainer/abj";

function IndexPage() {
  const isMobile = useMobileToggle();
  return isMobile ? <Mobile /> : <PC />;
}

export default memo(IndexPage);

export const getAllowance = async (
  tokenAddress: string,
  userAddress: string,
  walletType: string
) => {
  //判断认证状态
  const contract = await getContract(tokenAddress, tokenAbi, walletType);
  var allowed = await contract.allowance(userAddress, farmContractAddress);
  return allowed ? formWei(allowed) : "0";
};

//获取精度
export const getDecimals = async (tokenAddress: string, walletType: string) => {
  //判断认证状态
  const contract = await getContract(tokenAddress, tokenAbi, walletType);
  var decimals = await contract.decimals();
  return decimals;
};
