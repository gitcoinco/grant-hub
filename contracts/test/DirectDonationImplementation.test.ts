import { upgrades } from "hardhat";

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

const PROJECT1 = "0x0000000000000000000000000000000000000000000000000000000000000001";
const createEncodedVote = (_token: string, _amount: number, _grantAddress: string, _projectId: string) => {
  return ethers.utils.defaultAbiCoder.encode(
    ["address", "uint256", "address", "bytes32"],
    [_token, _amount, _grantAddress, _projectId]
  );
};

describe("DirectDonationImplementation", function () {
  async function deployFixture() {
    const [owner, addr1] = await ethers.getSigners();

    const tokenFactory = await ethers.getContractFactory("MockERC20");

    const erc20 = await tokenFactory.deploy();
    await erc20.deployed();
    await erc20.mint(owner.address, 1000);

    const erc20B = await tokenFactory.deploy();
    await erc20B.deployed();
    await erc20B.mint(owner.address, 1000);

    const directDonationFactory = await ethers.getContractFactory("DirectDonationImplementation");
    const directDonations = await upgrades.deployProxy(directDonationFactory, []);
    await directDonations.deployed();

    await erc20.approve(directDonations.address, 1000);
    await erc20B.approve(directDonations.address, 1000);

    return { directDonations, erc20, erc20B, owner, addr1 };
  }

  describe("vote:single", function () {
    it("should allow a single vote with erc20", async function () {
      const { directDonations, erc20, addr1 } = await loadFixture(deployFixture);

      const encodedVote = createEncodedVote(erc20.address, 100, addr1.address, PROJECT1);
      await directDonations['vote(bytes)'](encodedVote);

      expect(await erc20.balanceOf(addr1.address)).to.equal(100);
    });

    it("should allow a single vote with eth", async function () {
      const { directDonations, addr1 } = await loadFixture(deployFixture);

      const addr1BalanceBefore = await ethers.provider.getBalance(addr1.address);

      const encodedVote = createEncodedVote(ethers.constants.AddressZero, 100, addr1.address, PROJECT1);
      await directDonations['vote(bytes)'](encodedVote, { value: 100 });

      expect(await ethers.provider.getBalance(addr1.address)).to.equal(addr1BalanceBefore.add(100));
    });

    it("should emit an event", async function () {
      const { directDonations, erc20, owner, addr1 } = await loadFixture(deployFixture);

      const encodedVote = createEncodedVote(erc20.address, 100, addr1.address, PROJECT1);

      await expect(directDonations['vote(bytes)'](encodedVote)).to.emit(directDonations, "Voted").withArgs(erc20.address, 100, owner.address, addr1.address, PROJECT1);
    });
    it("should cost less gas to use vote(bytes) instead of vote(bytes[])", async function () {
      const { directDonations, erc20, addr1 } = await loadFixture(deployFixture);

      const encodedVote = createEncodedVote(erc20.address, 100, addr1.address, PROJECT1);

      const tx = await (await directDonations['vote(bytes[])']([encodedVote], { gasPrice: ethers.utils.parseUnits('20', 'gwei') })).wait();
      const tx2 = await (await directDonations['vote(bytes)'](encodedVote, { gasPrice: ethers.utils.parseUnits('20', 'gwei') })).wait();

      expect(tx2.gasUsed.toNumber()).to.be.lessThan(tx.gasUsed.toNumber());

    });
  });
  describe("vote:batch", function () {
    it("should allow batch voting with erc20", async function () {
      const { directDonations, erc20, erc20B, addr1 } = await loadFixture(deployFixture);

      const encodedVote = createEncodedVote(erc20.address, 100, addr1.address, PROJECT1);
      const encodedVote2 = createEncodedVote(erc20B.address, 100, addr1.address, PROJECT1);
      const encodedVotes = [encodedVote, encodedVote2];

      await directDonations['vote(bytes[])'](encodedVotes);

      expect(await erc20.balanceOf(addr1.address)).to.equal(100);
      expect(await erc20B.balanceOf(addr1.address)).to.equal(100);
    });

    it("should allow batch voting with eth and erc20", async function () {
      const { directDonations, erc20B, addr1 } = await loadFixture(deployFixture);

      const addr1BalanceBefore = await ethers.provider.getBalance(addr1.address);

      const encodedVote = createEncodedVote(ethers.constants.AddressZero, 100, addr1.address, PROJECT1);
      const encodedVote2 = createEncodedVote(erc20B.address, 100, addr1.address, PROJECT1);
      const encodedVotes = [encodedVote, encodedVote2];

      await directDonations['vote(bytes[])'](encodedVotes, { value: 100 });

      expect(await erc20B.balanceOf(addr1.address)).to.equal(100);
      expect(await ethers.provider.getBalance(addr1.address)).to.equal(addr1BalanceBefore.add(100));
    });

    it("should emit multiple events", async function () {
      const { directDonations, erc20B, owner, addr1 } = await loadFixture(deployFixture);

      const encodedVote = createEncodedVote(ethers.constants.AddressZero, 100, addr1.address, PROJECT1);
      const encodedVote2 = createEncodedVote(erc20B.address, 100, addr1.address, PROJECT1);
      const encodedVotes = [encodedVote, encodedVote2];

      await expect(directDonations['vote(bytes[])'](encodedVotes, { value: 100 })).to.emit(directDonations, "Voted").withArgs(ethers.constants.AddressZero, 100, owner.address, addr1.address, PROJECT1)
        .and.to.emit(directDonations, "Voted").withArgs(erc20B.address, 100, owner.address, addr1.address, PROJECT1);
    });

    it("should fail when batch voting with eth and erc20 and not enough eth", async function () {
      const { directDonations, erc20B, addr1 } = await loadFixture(deployFixture);

      const encodedVote = createEncodedVote(ethers.constants.AddressZero, 100, addr1.address, PROJECT1);
      const encodedVote2 = createEncodedVote(erc20B.address, 100, addr1.address, PROJECT1);
      const encodedVotes = [encodedVote, encodedVote2];

      await expect(directDonations['vote(bytes[])'](encodedVotes, { value: 1 })).to.revertedWith('Address: insufficient balance');
    });
  });

});