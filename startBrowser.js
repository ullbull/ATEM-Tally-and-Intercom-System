const { exec } = require("child_process");

function runCommand(command) {
   exec(command, (error, stdout, stderr) => {
      if (error) {
         console.log(`error: ${error.message}`);
         return;
      }
      if (stderr) {
         console.log(`stderr: ${stderr}`);
         return;
      }
      console.log(`stdout: ${stdout}`);
   });
}

function startBrowser() {
   // Open webpage
   runCommand("chromium-browser --kiosk https://localhost:5000/?mic-on=1");
}

module.exports = {
   runCommand,
   startBrowser
}