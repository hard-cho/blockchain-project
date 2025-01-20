import { expect } from "chai";
import { ethers } from "hardhat";

describe("TradeContract", function () {
  let tradeContract: any;
  let buyer: any, seller: any, mediator: any;

  beforeEach(async function () {
    [buyer, seller, mediator] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("TradeContract");
    tradeContract = await factory.deploy();
  });

  it("should create and deposit a trade", async function () {
    const amount = ethers.parseEther("1.0");

    await tradeContract.connect(buyer).initiateTrade(seller.address, mediator.address, { value: amount });
    const [buyerAddress, sellerAddress, mediatorAddress, tradeAmount, tradeState] = await tradeContract.trades(1);

    expect(buyerAddress).to.equal(buyer.address);
    expect(sellerAddress).to.equal(seller.address);
    expect(mediatorAddress).to.equal(mediator.address);
    expect(tradeAmount).to.equal(amount);
    expect(tradeState).to.equal(0); // TradeState.PENDING
  });

  it("should allow the buyer to approve the trade", async function () {
    const tradeAmount = ethers.parseEther("1.0");

    await tradeContract.connect(buyer).initiateTrade(seller.address, mediator.address, { value: tradeAmount });

    await expect(tradeContract.connect(buyer).approveTrade(1)).to.changeEtherBalances(
      [tradeContract, seller],
      [-tradeAmount, tradeAmount],
    );

    const trade = await tradeContract.trades(1);
    expect(trade.tradeState).to.equal(1); // TradeState.COMPLETED
  });

  it("should allow parties to raise a dispute", async function () {
    const tradeAmount = ethers.parseEther("1.0");

    await tradeContract.connect(buyer).initiateTrade(seller.address, mediator.address, { value: tradeAmount });

    await tradeContract.connect(buyer).initiateDispute(1);
    const trade = await tradeContract.trades(1);

    expect(trade.tradeState).to.equal(2); // TradeState.DISPUTED
  });

  it("should allow the mediator to settle a dispute in favor of the seller", async function () {
    const tradeAmount = ethers.parseEther("1.0");

    await tradeContract.connect(buyer).initiateTrade(seller.address, mediator.address, { value: tradeAmount });

    await tradeContract.connect(buyer).initiateDispute(1);
    await expect(tradeContract.connect(mediator).settleDispute(1, true)).to.changeEtherBalances(
      [tradeContract, seller],
      [-tradeAmount, tradeAmount],
    );

    const trade = await tradeContract.trades(1);
    expect(trade.tradeState).to.equal(1); // TradeState.COMPLETED
  });

  it("should allow the mediator to settle a dispute in favor of the buyer", async function () {
    const tradeAmount = ethers.parseEther("1.0");

    await tradeContract.connect(buyer).initiateTrade(seller.address, mediator.address, { value: tradeAmount });

    await tradeContract.connect(buyer).initiateDispute(1);
    await expect(tradeContract.connect(mediator).settleDispute(1, false)).to.changeEtherBalances(
      [tradeContract, buyer],
      [-tradeAmount, tradeAmount],
    );

    const trade = await tradeContract.trades(1);
    expect(trade.tradeState).to.equal(1); // TradeState.COMPLETED
  });
});
