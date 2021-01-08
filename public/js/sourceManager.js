import * as elementHider from './elementHider.js';
import * as api from './api.js';

let MySource;

async function getSource() {
   console.log('getSource()');

   // Set mySource from url
   const urlParams = new URLSearchParams(window.location.search);
   const source = urlParams.get('source');
   const config = await api.getConfig();

   // Prompt user to choose source if source is not valid
   if (!validateSource(source, config.sources)) {
      promptUserForSource();
   } else {
      // Source is valid.
      // Hide prompt element
      elementHider.hideElement("prompt");

      MySource = source;

      displayMySource(source);
   }
}

function getMySource() {
   return MySource;
}

async function promptUserForSource() {
   // Get config
   const config = await api.get('/get-config');

   setDropdownContent(config.sources);

   // Show prompt element
   elementHider.unhideElement("prompt");
}

function displayMySource(source) {
   const tallyDiv = document.getElementById("tally-div");
   tallyDiv.innerHTML = `Tally for ${source}`;
}

function validateSource(source, sources) {
   for (const key in sources) {
      if (Object.hasOwnProperty.call(sources, key)) {
         const element = sources[key];
         if (element == source) {
            console.log('valid source! ', source)
            return true;
         }
      }
   }
   console.error(`The source ${source} is not valid!`);
   return false;
}

function setDropdownContent(sources) {
   const div = document.getElementById("dropdown-content")

   // Remove content
   div.innerHTML = '';

   // Add content
   for (const key in sources) {
      if (Object.hasOwnProperty.call(sources, key)) {
         const source = sources[key];
         const element = document.createElement("a");
         element.href = '?source=' + source;
         element.innerHTML = key + ': ' + source;
         div.appendChild(element);
      }
   }
}

export {
   getSource,
   getMySource
}