const hre = require("hardhat");

async function main() {
    const ChainTicketPlus = await hre.ethers.getContractFactory("ChainTicketPlus");
    const chainTicketPlus = await ChainTicketPlus.deploy();

    await chainTicketPlus.waitForDeployment();

    console.log("ChainTicketPlus deployed to:", await chainTicketPlus.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
