import * as api from './api.js';
import * as simulateAtemControl from './simulateAtemControl.js';

window.onkeyup = event => {
   simulateAtemControl.keyUp(event);

   console.log(`${event.key} up`);
   console.log('event', event);
}

const which = 48;

document.getElementById('button-1').onclick = () => {
   simulateAtemControl.keyUp({ which: which + 1 });
}
document.getElementById('button-2').onclick = () => {
   simulateAtemControl.keyUp({ which: which + 2 });
}
document.getElementById('button-3').onclick = () => {
   simulateAtemControl.keyUp({ which: which + 3 });
}
document.getElementById('button-4').onclick = () => {
   simulateAtemControl.keyUp({ which: which + 4 });
}
document.getElementById('button-5').onclick = () => {
   simulateAtemControl.keyUp({ which: which + 5 });
}
document.getElementById('button-6').onclick = () => {
   simulateAtemControl.keyUp({ which: which + 6 });
}
document.getElementById('button-7').onclick = () => {
   simulateAtemControl.keyUp({ which: which + 7 });
}
document.getElementById('button-8').onclick = () => {
   simulateAtemControl.keyUp({ which: which + 8 });
}

document.getElementById('button-cut').onclick = () => {
   simulateAtemControl.keyUp({ code: 'Enter' });
}
