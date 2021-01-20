import * as elementHider from './elementHider.js';

const bgColor = document.body.style.backgroundColor;
const programColor = 'rgb(197, 68, 68)';
const previewColor = 'rgb(71, 194, 97)';
const noConnectionColor = 'rgb(194, 194, 194)';
const switcherStateElement = document.getElementById("atem-switcher-state")
const fontSize = switcherStateElement.style.fontSize;

function camOnProgram() {
   changeColorTo(programColor);
}

function camOnPreview() {
   changeColorTo(previewColor);
}

function camFree() {
   changeColorTo(bgColor);
}

function switcherNotConnected() {
   changeColorTo(noConnectionColor);
   elementHider.hideElement('tally-div');
   elementHider.hideElement('program');
   elementHider.hideElement('preview');

   switcherStateElement.style.fontSize = '25px';
}

function switcherConnected() {
   changeColorTo(bgColor);
   elementHider.unhideElement('tally-div');
   elementHider.unhideElement('program');
   elementHider.unhideElement('preview');

   switcherStateElement.style.fontSize = fontSize;
}

function changeColorTo(color) {
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