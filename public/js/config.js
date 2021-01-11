import * as help from './help.js';
import * as api from './api.js';

help.displayHelp();
fillForm();

function setAttributes(element, attributes) {
   for (var key in attributes) {
      element.setAttribute(key, attributes[key]);
   }
}

async function fillForm() {
   const sourcesForm = document.getElementById('settings-form');
   const ip = document.getElementById('ip');

   // Get config
   const config = await api.getConfig();

   console.log(config);

   ip.value = config.ip;

   for (const key in config.sources) {
      if (Object.hasOwnProperty.call(config.sources, key)) {
         const value = config.sources[key];

         const label = document.createElement('label');
         const input = document.createElement('input');
         const br = document.createElement('br');

         label.innerHTML = `${key} `;
         setAttributes(input, { class: "inputs", type: "text", name: key, value: value });
         sourcesForm.appendChild(label);
         sourcesForm.appendChild(input);
         sourcesForm.appendChild(br);
      }
   }
   
   // Create submit button
   const submitButton = document.createElement('input');
   setAttributes(submitButton, {
      id: "save",
      class: "settings-container",
      type: "submit",
      value: "Save"
   });
   sourcesForm.appendChild(submitButton);
}
