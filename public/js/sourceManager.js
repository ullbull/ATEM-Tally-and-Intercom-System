
fetch('/get-config')
   .then(response => response.json())
   .then(config => {

      // Set this camera
      const urlParams = new URLSearchParams(window.location.search);
      let source = urlParams.get('source');

      // Validate source
      if (validateSource(source, config.sources)) {
         // Source is valid!

         // Remove select-source
         document.getElementById('select-source').remove();

         displaySelectedSource(source);
      } else {
         console.log('No selected source', source);
      }
   });

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

function addSources(sources) {
   console.log('add sources', sources);
   const div = document.getElementById("dropdown-content")
   console.log('div', div);
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

function displaySelectedSource(source) {
   // const container = document.getElementById("main-container");
   const div = document.getElementById("tally-div");
   // const div = document.createElement("div");
   const camID = document.createElement("p");
   // div.setAttribute("class", "tally-for");
   camID.setAttribute("class", "tally-for");
   camID.setAttribute("id", "camera-id");
   camID.innerHTML = source;
   div.appendChild(camID);
   // container.insertBefore(div, container.firstChild);
}

export {
   addSources,
}