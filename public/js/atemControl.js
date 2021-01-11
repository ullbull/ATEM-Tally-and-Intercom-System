import * as cts from './connectionToServer.js';

function keyUp(event) {
   if (event.code == 'Enter' || event.code == 'Space') {
      cts.sendData('cut');
   } 
   else if (event.which >= 48) {
      const preview = event.which - 48;
      cts.sendData('setPreview', preview);
   }
}

export {
   keyUp
}