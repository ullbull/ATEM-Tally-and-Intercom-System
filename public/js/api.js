async function get(url) {
   const res = await fetch(url);
   return await res.json();
}

async function getConfig() {
   return await get('/get-config');
}

export {
   get,
   getConfig
}