
function hideElement(elementID) {
   console.log('hiding ', elementID);
   const element = document.getElementById(elementID);
   if (element) {
      element.style.display = "none";
   }
}

function unhideElement(elementID) {
   console.log('unhide ', elementID);
   const element = document.getElementById(elementID);
   if (element) {
      element.style.display = "block";
   }
}

function toggleHide(elementID) {
   const element = document.getElementById(elementID);
   if (element.style.display === "none") {
      unhideElement(elementID);
   } else {
      hideElement(elementID);
   }
}

export {
   hideElement,
   unhideElement,
   toggleHide
}