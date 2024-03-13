import block1 from "@/assets/logo/block1.png";
import sei1 from "@/assets/logo/sei1.png";
import usdt from "@/assets/logo/usdt.png";
import usdc from "@/assets/logo/usdc.png";

// 测试
export const network = "bsc";
export const farmContractAddress = "0x983562C75D92610D06a118F2ad35e2c015120D0C"; //farm合约地址
export const poolContractAddress = "0x1586d26cf1717d4d520bA3f02D4E9E1286BBF51c"; //pool合约地址
export const ChainToken = [
  { id: 1, src: block1, name: "MAMABA", name1: "Mamaba" },
  { id: 2, src: sei1, name: "SEI", name1: "Sei" },
  { id: 3, src: usdc, name: "USDC", name1: "Usdc" },
  { id: 4, src: usdt, name: "USDT", name1: "Usdt" },
];

//预发布
// export const network0913 = 'Goerli';
// export const contractAddress0913 = '0x3FEbE371052828A94f6cC475e3579819e6E133C9'; //合约地址

//正式
// export const network0913 = 'eth';
// export const contractAddress0913 = '0xE4173508c2C4a1FB23088D1C6154f91EE5D55Bdb'; //合约地址
