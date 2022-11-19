
const hre = require("hardhat");

async function main() {

  const JobsWeb3 = await hre.ethers.getContractFactory("jobsWeb3");
  const jobsWeb3 = await JobsWeb3.deploy('0x16019fc25Cc2fab1331c7150d2B4044EBB218cbd', 60);

  await jobsWeb3.deployed();

  console.log(
    `deployed to ${jobsWeb3.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
