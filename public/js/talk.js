import { connection } from './connection.js';

const bgColor = document.body.style.backgroundColor;
const pptColor = 'rgb(197, 68, 68)';
const toggleTalk = document.getElementById('toggle-talk')
// let isMuted = true;

// Set mic on of
const urlParams = new URLSearchParams(window.location.search);
const micOn = urlParams.get('mic-on');

if (micOn) {
   console.log('mic is on', micOn);
   setTimeout(unmuteMyStream, 5000);
}

window.onkeydown = event => {
   if (event.shiftKey) {
      unmuteMyStream();
   }
}

window.onkeyup = event => {
   if (event.key == 'Shift') {
      muteMyStream();
   }
}

window.ontouchstart = event => {
   unmuteMyStream();
}

window.ontouchend = event => {
   muteMyStream();
}

toggleTalk.onclick = event => {
   if (getMyStream().isMuted) {
      unmuteMyStream();
      // location.href='?mic-on=1';
   }
   else {
      muteMyStream();
      // location.href='/';
   }
}

function getMyStream() {
   if (!connection.streamEvents.selectFirst({ local: true })) {
      return;
   }

   const myStream = connection.streamEvents.selectFirst({
      local: true
   }).stream;

   if (myStream.isMuted === undefined) {
      myStream.isMuted = true;
   }

   return myStream;
}

function unmuteMyStream() {
   const myStream = getMyStream()
   if (!myStream) {
      return;
   }

   if (myStream.isMuted) {
      // Unmute stream
      myStream.unmute('both');

      console.log('unmuted');
      myStream.isMuted = false;
      connection.extra.isMuted = myStream.isMuted;
      connection.updateExtraData();

      // Change background color
      // document.body.style.backgroundColor = pptColor;
      const x = document.getElementsByClassName('header');
      for (let i = 0; i < x.length; i++) {
         x[i].style.backgroundColor = pptColor;
      }

      toggleTalk.innerHTML = 'Mic is on';
   }
}

function muteMyStream() {
   const myStream = getMyStream()
   if (!myStream) {
      return;
   }

   if (!myStream.isMuted) {
      // Mute stream
      myStream.mute('both');

      console.log('muted');
      myStream.isMuted = true;
      connection.extra.isMuted = myStream.isMuted;
      connection.updateExtraData();

      // Change background color
      // document.body.style.backgroundColor = bgColor;
      const x = document.getElementsByClassName('header');
      for (let i = 0; i < x.length; i++) {
         x[i].style.backgroundColor = bgColor;
      }

      toggleTalk.innerHTML = 'Mic is off';
   }
}

export {
   getMyStream,
   muteMyStream,
   unmuteMyStream
}