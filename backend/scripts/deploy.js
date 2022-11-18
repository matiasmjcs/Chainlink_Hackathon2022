
const hre = require("hardhat");

async function main() {

  const JobsWeb3 = await hre.ethers.getContractFactory("jobsWeb3");
  const jobsWeb3 = await JobsWeb3.deploy('0x02777053d6764996e594c3E88AF1D58D5363a2e6', 60);

  await jobsWeb3.deployed();

  console.log(
    `deployed to ${jobsWeb3.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
