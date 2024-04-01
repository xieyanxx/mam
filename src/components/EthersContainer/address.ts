import block1 from "@/assets/logo/block1.png";
import sei1 from "@/assets/logo/sei1.png";
import usdt from "@/assets/logo/usdt.png";
import usdc from "@/assets/logo/usdc.png";

// 测试
export const defaultRpc='https://data-seed-prebsc-1-s1.bnbchain.org:8545'; //没链接钱包是默认的rpc
export const network = "bsc";
export const farmContractAddress = "0x0F005666480aF784f12446Ed6835B35308EDEC0e"; //farm合约地址
export const poolContractAddress = "0x4864e451aFA91ddCE8a2c7870186Ff994e4b5007"; //pool合约地址
export const routeContractAddress =
  "0x5975863B45c2cF941BF232029944a981975Ea439";
export const factoryContractAddress =
  "0x74dB217b86341b8515b842775930f2b7D7Ac1b6A";
export const readyContractAddress =
  "0x2CF737fbCae290db246F7eCB71152910Bedb8Dfc";
export const claimMAMBAContractAddress = "0x1e98D91428cbFd8c1957Fac9AcCcb69a071E84eF";
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

