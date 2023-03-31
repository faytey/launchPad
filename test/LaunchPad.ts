import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { PromiseOrValue } from "../typechain-types/common";
import { LaunchPad, TokenA, TokenB } from "../typechain-types";

describe("LaunchPad", function () {
  let owner: { address: PromiseOrValue<string> },
    pad: LaunchPad,
    ownersBalanceA,
    ownersBalanceB,
    tokenA: TokenA,
    tokenB: TokenB;
  before(
    "it should deploy the launchpad contract instance first",
    async function () {
      [owner] = await ethers.getSigners();
      const Pad = await ethers.getContractFactory("LaunchPad");
      pad = await Pad.deploy(owner.address);
    }
  );
  it("Deployment of Token A should send total supply of tokens to owner", async function () {
    [owner] = await ethers.getSigners();
    const TokenA = await ethers.getContractFactory("TokenA");
    tokenA = await TokenA.deploy();
    ownersBalanceA = await tokenA.balanceOf(owner.address);
    expect(await tokenA.totalSupply()).to.eq(ownersBalanceA);
  });
  it("Deployment of Token B should send total supply of tokens to owner", async function () {
    [owner] = await ethers.getSigners();
    const TokenB = await ethers.getContractFactory("TokenB");
    tokenB = await TokenB.deploy();
    ownersBalanceB = await tokenB.balanceOf(owner.address);
    expect(await tokenB.totalSupply()).to.eq(ownersBalanceB);
  });
  it("it should set the owner to be the deployer of the contract", async function () {
    expect(await pad.owner()).to.eq(owner.address);
  });
  it("it should create a new launchpad", async function () {
    await tokenB.approve(pad.address, 70000);
    const deposit = await pad.createLaunchPad(
      "Faith",
      tokenA.address,
      tokenB.address,
      60,
      300,
      1000,
      1000,
      { value: ethers.utils.parseEther("0.01") }
    );
    const padInfo = await pad.padId(1);
    expect(padInfo.name).to.equal("Faith");
    expect(padInfo.TokenA).to.equal(tokenA.address);
    expect(padInfo.TokenB).to.equal(tokenB.address);
    expect(padInfo.startTime).to.not.equal(null);
    expect(padInfo.endTime).to.not.equal(null);
    expect(padInfo.tokenBQuantity).to.equal(1000);
    expect(padInfo.tokenANeeded).to.equal(1000);
    expect(padInfo.tokenABalance).to.equal(0);
    expect(padInfo.numberOfSubscribers).to.equal(0);
    // expect(padInfo.subscribers).to.be.an("array").that.is.empty;
    expect(padInfo.exists).to.equal(true);

    const creatorDetails = await pad.creator(1);
    expect(creatorDetails.id_).to.equal(1);
    expect(creatorDetails.nameOfPad).to.equal("Faith");
    expect(creatorDetails.creator).to.equal(owner.address);
  });
  it("should allow subscribers to deposit TokenA", async function () {
    await tokenA.approve(pad.address, 500);
    await pad.deposit(1, 50);
    const launchPadDetails = await pad.padId(1);
    expect(launchPadDetails.tokenABalance).to.equal(50);
    // expect(launchPadDetails.amount[owner.address]).to.equal(250);
    // expect(launchPadDetails.subscribers[0]).to.equal(owner.address);
    expect(launchPadDetails.numberOfSubscribers).to.equal(1);
    expect(pad.subscriberIndex(owner.address)).to.equal(1);
  });
});
