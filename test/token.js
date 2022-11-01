const { expect } = require("chai");

let nft1155
let owner, user1, user2, user3, user4;
describe("NFT 1155", function() {
  this.beforeEach(async function () {
    // get users
    [owner, user1, user2, user3, user4] = await ethers.getSigners();

    // deploy DEXLimitOrder contract
    const NFT1155 = await ethers.getContractFactory("NFT1155");
    nft1155 = await NFT1155.deploy();
    await nft1155.deployed();
  });

  describe("NFT 1155 not in batch", async function () {
    it("Should mint NFT1155", async function () {
      await nft1155.connect(owner).mint(owner.address, 1, 10)
      const balance = await nft1155.balanceOf(owner.address, 1)
      expect(10).to.equal(Number(balance.toString()));
    });

    it("Should be able to setURI", async function () {
      let uriLink = 'ipfs://QmVxnd4TWkaxb5F6eAJwBJVgbavaWQUUbCGk5FTknCmrhC/metadata.json'
      await nft1155.connect(owner).mint(owner.address, 2, 5)
      await nft1155.connect(owner).setURI(2, uriLink)
      const getURI = await nft1155.uri(2)
      expect(getURI).to.equal(uriLink)
      const emtpyURINotSet = await nft1155.uri(3)
      expect(emtpyURINotSet).to.equal('')
    });

    it("Should burn NFT1155", async function () {
      await nft1155.connect(owner).mint(owner.address, 3, 30)
      const beforeBurnBalance = await nft1155.balanceOf(owner.address, 3)
      await nft1155.connect(owner).burn(3, 10)
      const afterBurnBalance = await nft1155.balanceOf(owner.address, 3)
      expect(beforeBurnBalance - 10).to.equal(afterBurnBalance);
    });
  });

  describe("NFT 1155 in batch", async function () {
    it("Should mint NFT1155 in batch", async function () {
      await nft1155.connect(owner).mintBatch(owner.address, [4, 5, 6], [10, 20, 30])
      const balance = await nft1155.balanceOfBatch([owner.address, owner.address, owner.address], [4, 5, 6])
      expect(10).to.equal(Number(balance[0].toString()));
      expect(20).to.equal(Number(balance[1].toString()));
      expect(30).to.equal(Number(balance[2].toString()));
    });

    it("Should burn NFT1155 in batch", async function () {
      await nft1155.connect(owner).mintBatch(owner.address, [7, 8], [12, 15])
      const beforeBurnBalance = await nft1155.balanceOfBatch([owner.address, owner.address], [7, 8])
      await nft1155.connect(owner).burnBatch([7, 8], [5, 8])
      const afterBurnBalance = await nft1155.balanceOfBatch([owner.address, owner.address], [7, 8])
      expect(beforeBurnBalance[0] - 5).to.equal(afterBurnBalance[0]);
      expect(beforeBurnBalance[1] - 8).to.equal(afterBurnBalance[1]);
    });
  });

  describe("NFT 1155 transfer", async function () {
    it("Owner can transfer NFT", async function () {
      await nft1155.connect(owner).mint(owner.address, 1, 11)
      const beforeTransferBalance = await nft1155.balanceOf(owner.address, 1)
      await nft1155.safeTransferFrom(owner.address, user1.address, 1, 1, "0x00")
      const afterTransferBalance = await nft1155.balanceOf(owner.address, 1)
      expect(beforeTransferBalance - 1).to.equal(afterTransferBalance);
    });

    it("Owner can transfer NFT in batch", async function () {
      await nft1155.connect(owner).mintBatch(owner.address, [4, 5], [10, 20])
      const beforeTransferBalance = await nft1155.balanceOfBatch([owner.address, owner.address], [4, 5])
      await nft1155.safeBatchTransferFrom(owner.address, user1.address, [4, 5], [1, 2], "0x00")
      const afterTransferBalance = await nft1155.balanceOfBatch([owner.address, owner.address], [4, 5])
      expect(beforeTransferBalance[0] - 1).to.equal(afterTransferBalance[0]);
      expect(beforeTransferBalance[1] - 2).to.equal(afterTransferBalance[1]);
    });

  });
});