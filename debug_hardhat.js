const fs = require('fs');
const { exec } = require('child_process');

exec('npx hardhat compile', (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        fs.writeFileSync('hardhat_debug.txt', `error: ${error.message}\nstderr: ${stderr}\nstdout: ${stdout}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        fs.writeFileSync('hardhat_debug.txt', `stderr: ${stderr}\nstdout: ${stdout}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    fs.writeFileSync('hardhat_debug.txt', `stdout: ${stdout}`);
});
