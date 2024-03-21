import block1 from "@/assets/logo/block1.png";
import sei1 from "@/assets/logo/sei1.png";
import usdt from "@/assets/logo/usdt.png";
import usdc from "@/assets/logo/usdc.png";

// 测试
export const network = "bsc";
export const farmContractAddress = "0xF55f6528316c8FDaf47C531721f459733cC25055"; //farm合约地址
export const poolContractAddress = "0x5fdEAA3073dea7b0bB20c3E18BF285dF1A97649A"; //pool合约地址
export const routeContractAddress =
  "0x5975863B45c2cF941BF232029944a981975Ea439";
export const factoryContractAddress =
  "0x74dB217b86341b8515b842775930f2b7D7Ac1b6A";
export const readyContractAddress =
  "0xd66F738Fb55c88A6992D4E477e033bC51650a779";
export const ChainToken = [
  {
    id: 1,
    src: block1,
    name: "MAMBA",
    name1: "Mamba",
    address: "0xd77cfa1C2A24AC939507632c833b3D623123eE7D",
    address1: "",
  },
  {
    id: 2,
    src: sei1,
    name: "SEI",
    name1: "Sei",
    address: "0x0000000000000000000000000000000000000000",
    address1: "0xFC0b7E9E72fA2c6e2181B1c57A6b862831AECF6B",
  },

  {
    id: 3,
    src: usdc,
    name: "USDC",
    name1: "Usdc",
    address: "0xAb2f5A0E23FF19e3630C2eA0fE98382949995209",
    address1: "",
  },
  {
    id: 4,
    src: usdt,
    name: "USDT",
    name1: "Usdt",
    address: "0xaBBEd9873127e3d41d2C3dA17C5f6Ef4D60a788B",
    address1: "",
  },
  {
    id: 5,
    src: sei1,
    name: "WSEI",
    name1: "Wsei",
    address: "0xFC0b7E9E72fA2c6e2181B1c57A6b862831AECF6B",
    address1: "",
  },
];

//预发布
// export const network0913 = 'Goerli';
// export const contractAddress0913 = '0x3FEbE371052828A94f6cC475e3579819e6E133C9'; //合约地址

//正式
// export const network0913 = 'eth';
// export const contractAddress0913 = '0xE4173508c2C4a1FB23088D1C6154f91EE5D55Bdb'; //合约地址
