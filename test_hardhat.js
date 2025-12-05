const fs = require('fs');
try {
    require("hardhat");
    fs.writeFileSync('hardhat_test_output.txt', "Hardhat loaded successfully");
} catch (error) {
    fs.writeFileSync('hardhat_test_output.txt', "Error loading hardhat: " + error.message + "\n" + error.stack);
}
