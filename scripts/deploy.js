const hre = require("hardhat");

async function main() {

  // 1. Deploy Token Contract
  const NFT1155 = await hre.ethers.getContractFactory("NFT1155");
  const nft1155 = await NFT1155.deploy();

  await nft1155.deployed();

  console.log("NFT1155 deployed to:", nft1155.address);
  // NFT1155 at 0xff4E335171630DF2698D31bd3B7734DB1930DBF6
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});