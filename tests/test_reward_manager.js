const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RewardManager", function () {
  it("should mint and transfer tokens", async function () {
    const [owner, user] = await ethers.getSigners();
    const RewardManager = await ethers.getContractFactory("RewardManager");
    const rm = await RewardManager.deploy();
    await rm.deployed();

    await rm.mint(user.address, ethers.parseUnits("100", 18), "test");
    expect(await rm.balanceOf(user.address)).to.equal(ethers.parseUnits("100", 18));

    await rm.connect(user).transfer(owner.address, ethers.parseUnits("20", 18));
    expect(await rm.balanceOf(owner.address)).to.equal(ethers.parseUnits("20", 18));
  });
});













