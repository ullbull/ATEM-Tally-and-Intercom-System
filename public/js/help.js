function displayHelp() {
   let url = 'http://' + window.location.hostname + ':' + window.location.port;

   const body = document.getElementsByTagName("BODY")[0]
   const p = document.createElement("p");
   const p2 = document.createElement("p");
   p.innerHTML = `Go to link below. Find the section "Insecure origins treated as secure" and add the following address: ${url}`;
   p2.innerHTML = 'chrome://flags/#unsafely-treat-insecure-origin-as-secure';
   body.appendChild(p);
   body.appendChild(p2);
}

export {
   displayHelp
}