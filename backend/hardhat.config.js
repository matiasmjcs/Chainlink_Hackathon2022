require("@nomiclabs/hardhat-ethers");
require("dotenv").config()



const QUICKNODE_URL = process.env.QUICKNODE_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;


module.exports = {
  solidity: "0.8.6",
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545/'
    },
    mumbai: {
      url: QUICKNODE_URL,
      accounts: [PRIVATE_KEY]
    }
  }
};