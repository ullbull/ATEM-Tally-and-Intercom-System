const atemIpInput = document.getElementById('atem-ip-input');

fetch('/get-config')
  .then(response => response.json())
  .then(data => {
     console.log(data);
     atemIpInput.value = data.ip;
   });