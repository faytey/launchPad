import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { PromiseOrValue } from "../typechain-types/common";
import { LaunchPad } from "../typechain-types";

describe("TokenA", function () {
  it("Deployment of Token A should send total supply of tokens to owner", async function () {
    const [owner] = await ethers.getSigners();
    const TokenA = await ethers.getContractFactory("TokenA");
    const tokenA = await TokenA.deploy();
    const ownersBalance = await tokenA.balanceOf(owner.address);
    expect(await tokenA.totalSupply()).to.eq(ownersBalance);
  });
});

describe("TokenB", function () {
  it("Deployment of Token B should send total supply of tokens to owner", async function () {
    const [owner] = await ethers.getSigners();
    const TokenB = await ethers.getContractFactory("TokenB");
    const tokenB = await TokenB.deploy();
    const ownersBalance = await tokenB.balanceOf(owner.address);
    expect(await tokenB.totalSupply()).to.eq(ownersBalance);
  });
});

describe("LaunchPad", function () {
  let owner: { address: PromiseOrValue<string> }, pad: LaunchPad;
  before(
    "it should deploy the launchpad contract instance first",
    async function () {
      [owner] = await ethers.getSigners();
      const Pad = await ethers.getContractFactory("LaunchPad");
      pad = await Pad.deploy(owner.address);
    }
  );
  it("it should set the owner to be the deployer of the contract", async function () {
    expect(await pad.owner()).to.eq(owner.address);
  });
});
