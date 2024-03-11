import { message } from "antd";
import { useContext } from "react";
import { EthersContext } from "@/components/EthersContainer";
import dayjs from "dayjs";

export function IsMobile() {
  let plat = navigator.userAgent.match(
    // 判断不同端
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  );
  return plat ? true : false;
}

export function useCheckWallet() {
  const { address } = useContext(EthersContext);
  return () => {
    if (!address) {
      message.warning("pleaseConnectWallet!");
      return false;
    }
    return true;
  };
}

export function clearStorage() {
  sessionStorage.setItem("Token", "");
  sessionStorage.setItem("address", "");
  sessionStorage.setItem("walletType", "");
  sessionStorage.setItem("chainId", "");
}

export function parseURL(url: string) {
  const a = document.createElement("a");
  a.href = url;
  return {
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function () {
      const ret: any = {};
      const seg = a.search.replace(/^\?/, "").split("&");
      const len = seg.length;
      let i = 0;
      let s;
      for (; i < len; i++) {
        if (!seg[i]) {
          continue;
        }
        s = seg[i].split("=");
        ret[s[0]] = s[1];
      }
      return ret;
    })(),
    hash: a.hash.replace("#", ""),
  };
}
export function getSubStr(str: string) {
  var subStr1 = str.substring(0, 4);
  var subStr2 = str.slice(-4);
  var subStr = subStr1 + "..." + subStr2;
  return subStr;
}
// 保留两位小数
export function formatAmount(num: string) {
  if (!num) {
    return "0.00";
  }
  return Math.floor(Number(num) * 100) / 100;
}

export function getTime(time: string | number) {
  return dayjs(Number(time) * 1000).format("MMM DD,YYYY,HH:mm A");
}
// 判断是否结束
export function timeIsEnd(time: string | number) {
  return new Date().getTime()>Number(time) * 1000;
} 
