import { ethers } from "hardhat";

async function main() {
  const [owner, profile1, profile3] = await ethers.getSigners();

  const TokenA = await ethers.getContractFactory("TokenA");
  const tokenA = await TokenA.deploy();
  await tokenA.deployed();
  console.log(`Token A contract deployed to ${tokenA.address}`);

  const TokenB = await ethers.getContractFactory("TokenB");
  const tokenB = await TokenB.deploy();
  await tokenB.deployed();
  console.log(`Token B contract deployed to ${tokenB.address}`);

  const balance = await tokenB.balanceOf(tokenB.address);
  console.log("balance of tokenB is ", balance);

  await tokenB.transfer(profile1.address, 2000);

  const balance1 = await tokenB.balanceOf(profile1.address);
  console.log("balance of user is ", balance1);
  console.log("success");

  const LaunchPad = await ethers.getContractFactory("LaunchPad");
  const launchpad = await LaunchPad.deploy(owner.address);
  await launchpad.deployed();
  console.log(`Launch Pad contract deployed to ${launchpad.address}`);

  const amount = ethers.utils.parseEther("0.01");

  const approval = await tokenB
    .connect(profile1)
    .approve(launchpad.address, 2000);
  console.log(
    "launchpad allowance of token b is",
    await tokenB.allowance(profile1.address, launchpad.address)
  );

  const createPad = await launchpad
    .connect(profile1)
    .createLaunchPad(
      "Faith's Funds",
      tokenA.address,
      tokenB.address,
      60,
      300,
      100,
      100,
      { value: amount }
    );
  console.log("success");
  console.log(
    "tokenB balance of launchpad is ",
    await tokenB.balanceOf(launchpad.address)
  );

  const warpTime = await ethers.provider.send("evm_mine", [1680262530]);
  await tokenA.approve(launchpad.address, 100);

  const deposit = await launchpad.deposit(1, 100);
  console.log("deposited successfully");
  console.log(
    "tokenA balance of launchpad is ",
    await tokenB.balanceOf(launchpad.address)
  );

  //CHECKING OUT DEPOSIT AFTER MAXIMUM AMOUNT REACHED
  // const deposit1 = await launchpad.connect(profile3).deposit(1, 100);
  // console.log("deposited successfully");
  // console.log(
  //   "tokenA balance of launchpad is ",
  //   await tokenB.balanceOf(launchpad.address)
  // );
  await ethers.provider.send("evm_mine", [1680270400]);

  // const transferTokenA = await launchpad
  //   .connect(profile1)
  //   .transferTokenA(1, 100);
  console.log(await owner.getBalance());
  const withdraw = await launchpad.withdrawEth();
  console.log("successfully withdrawn");
  console.log(await owner.getBalance());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
