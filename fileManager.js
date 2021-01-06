const fs = require('fs');

const path = './';
const configFilename = 'atem-config.json';

// Loads the config file
function loadConfig() {
   return loadFile(configFilename)
}

// Saves passed data to config file
function saveConfig(data) {
   saveFile(data, configFilename);
}

// Loads file.
// Returns empty object if file doesn't exist
function loadFile(filename = configFilename) {
   const filePath = path + filename;

   try {
      const rawData = fs.readFileSync(filePath);
      const data = JSON.parse(rawData);
      return data;
   }
   catch (error) {
      if (error.code == 'ENOENT') {
         console.error('Could not find the file', filePath);
      } else {
         console.error(error);
      }
      return {};
   }
}

// Saves a file. Overwrites if file exist
function saveFile(data, filename) {
   // const dataString = JSON.stringify(data);

   // Make easy to read data string
   const dataString = JSON.stringify(data, null, 2);

   const tempFilePath = path + filename + '_tmp';
   const filePath = path + filename;

   // Save temporary file
   fs.writeFile(tempFilePath, dataString, (err) => {
      if (err) {
         console.error('Error in write file: ', err);
         return;
      }

      // Write to temporary file was successful!
      // Now copy the temporary file
      fs.copyFile(tempFilePath, filePath, (err) => {
         if (err) {
            console.error(`Error when trying to rename ${tempFilePath} to ${filePath}:\n`, err);
            return;
         }
      });

      console.log('Saved the file ', filePath);
   });
}

module.exports = {
   loadConfig,
   saveConfig,
   loadFile,
   saveFile,
}