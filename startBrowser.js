const { exec } = require("child_process");

function startBrowser() {
   exec("chromium-browser --kiosk https://localhost:5000/?mic-on=1",
      (error, stdout, stderr) => {
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

module.exports = {
   startBrowser
}