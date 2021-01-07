const atemIpInput = document.getElementById('atem-ip-input');

let url = window.location.hostname + ':' + window.location.port

const body = document.getElementsByTagName("BODY")[0]
const p = document.createElement("p");
p.innerHTML = `Go to link above and add the following address: ${url}`;
body.appendChild(p);

fetch('/get-config')
  .then(response => response.json())
  .then(data => {
     console.log(data);
     atemIpInput.value = data.ip;
   });