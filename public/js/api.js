async function get(url) {
   const res = await fetch(url);
   return await res.json();
}

export {
   get
}