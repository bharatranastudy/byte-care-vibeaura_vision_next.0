const hre = require("hardhat");

async function main() {
  const RewardManager = await hre.ethers.getContractFactory("RewardManager");
  const rewardManager = await RewardManager.deploy();
  await rewardManager.deployed();
  console.log("RewardManager deployed to:", rewardManager.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});



