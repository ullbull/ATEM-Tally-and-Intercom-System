import * as elementHider from './elementHider.js';
import * as api from './api.js';

let MySource;

// Set mySource from url
const urlParams = new URLSearchParams(window.location.search);
let source = urlParams.get('source');
if (source) {
   setMySource(source);
}

async function promptUserForSource() {
   // Get config
   const config = await api.get('/get-config');

   addDropdownContent(config.sources);

   // Show prompt element
   elementHider.unhideElement("prompt");
}

async function setMySource(source) {
   // Get config
   const config = await api.get('/get-config');

   // Validate source
   if (!validateSource(source, config.sources)) {
      console.error(`The source ${source} is not valid!`);
      return;
   }

   MySource = source;

   const tallyDiv = document.getElementById("tally-div");
   tallyDiv.innerHTML = `Tally for ${MySource}`;
}

function validateSource(source, sources) {
   for (const key in sources) {
      if (Object.hasOwnProperty.call(sources, key)) {
         const element = sources[key];
         if (element == source) {
            return true;
         }
      }
   }
   return false;
}

function addDropdownContent(sources) {
   const div = document.getElementById("dropdown-content")
   for (const key in sources) {
      if (Object.hasOwnProperty.call(sources, key)) {
         const source = sources[key];
         const element = document.createElement("a");
         // element.setAttribute("id", source);
         element.href = '?source=' + source;
         element.innerHTML = source;
         div.appendChild(element);
      }
   }
}

function getMySource() {
   return MySource;
}

export {
   getMySource,
   promptUserForSource,
}