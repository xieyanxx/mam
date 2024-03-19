import block1 from "@/assets/logo/block1.png";
import sei1 from "@/assets/logo/sei1.png";
import usdt from "@/assets/logo/usdt.png";
import usdc from "@/assets/logo/usdc.png";

// 测试
export const network = "bsc";
export const farmContractAddress = "0x4BF4F322F1ee0953A2EF12E2E34c99FF63631a95"; //farm合约地址
export const poolContractAddress = "0x5D2D7f28F99C0CDf09D4175C159A505559A74c76"; //pool合约地址
export const routeContractAddress =
  "0x62ae1cd50c392e78e9482a151240302A30610635";
export const factoryContractAddress =
  "0x07820957A53A2Eea3d94d0fca9Cc693a23530ceD";
export const readyContractAddress =
  "0xe17A5A27438C13E072CB8E8585837955a082881F";
export const ChainToken = [
  {
    id: 1,
    src: block1,
    name: "MAMBA",
    name1: "Mamba",
    address: "0x61b040e9630873138329E706f20ef534Bb77cB5E",
    address1: "",
  },
  {
    id: 2,
    src: sei1,
    name: "SEI",
    name1: "Sei",
    address: "0x0000000000000000000000000000000000000000",
    address1: "0x149f9234B8327C7Bb279E9Fd100919fc0a3e2Abd",
  },
  {
    id: 3,
    src: usdc,
    name: "USDC",
    name1: "Usdc",
    address: "0x54317F70bBF9776C817BDA9455D8179C70c429aA",
    address1: "",
  },
  {
    id: 4,
    src: usdt,
    name: "USDT",
    name1: "Usdt",
    address: "0x3A989dc09dA5623A7c868061ff7ae0b7fA4A3EC3",
    address1: "",
  },
];

//预发布
// export const network0913 = 'Goerli';
// export const contractAddress0913 = '0x3FEbE371052828A94f6cC475e3579819e6E133C9'; //合约地址

//正式
// export const network0913 = 'eth';
// export const contractAddress0913 = '0xE4173508c2C4a1FB23088D1C6154f91EE5D55Bdb'; //合约地址
