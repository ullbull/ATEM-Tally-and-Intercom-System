import * as cts from './connectionToServer.js';

let program = 0;
let preview = 0;

function keyUp(event) {
   if (event.code == 'Enter' ||
      event.code == 'Space') 
      {
      switchProgramPreview();
   } else if (event.which >= 48) {
      preview = event.which - 48;
   }

   cts.sendData('simulate ATEM', { program, preview });
}

function switchProgramPreview() {
   let temp = preview;
   preview = program;
   program = temp;
}

export {
   keyUp
}