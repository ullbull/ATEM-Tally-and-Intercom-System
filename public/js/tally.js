import * as elementHider from './elementHider.js';

const bgColor = document.body.style.backgroundColor;
const programColor = 'rgb(197, 68, 68)';
const previewColor = 'rgb(71, 194, 97)';
const noConnectionColor = 'rgb(194, 194, 194)';

function camOnProgram() {
   changeColorTo(programColor);
}

function camOnPreview() {
   changeColorTo(previewColor);
}

function camFree() {
   changeColorTo(bgColor);
}

const switcherState = document.getElementById("atem-switcher-state")
const fontSize = switcherState.style.fontSize;

function switcherNotConnected() {
   console.log('switcherNotConnected')

   changeColorTo(noConnectionColor);
   elementHider.hideElement('tally-div');
   elementHider.hideElement('program');
   elementHider.hideElement('preview');

   switcherState.style.fontSize = '25px';
}

function switcherConnected() {
   changeColorTo(bgColor);
   elementHider.unhideElement('tally-div');
   elementHider.unhideElement('program');
   elementHider.unhideElement('preview');

   switcherState.style.fontSize = fontSize;
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
   camFree,
   switcherNotConnected,
   switcherConnected
}