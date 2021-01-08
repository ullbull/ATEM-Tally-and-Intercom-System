
const bgColor = document.body.style.backgroundColor;
const programColor = 'rgb(197, 68, 68)';
const previewColor = 'rgb(71, 194, 97)';

function camOnProgram() {
   changeColorTo(programColor);
}

function camOnPreview() {
   changeColorTo(previewColor);
}

function camFree() {
   changeColorTo(bgColor);
}

function changeColorTo(color) {
   // const x = document.getElementsByClassName('content-container');
   // for (let i = 0; i < x.length; i++) {
   //    x[i].style.backgroundColor = color;
   // }

   // Change background color
   document.body.style.backgroundColor = color;
}

export {
   camOnProgram,
   camOnPreview,
   camFree
}