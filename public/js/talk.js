import { connection } from './connection.js';

const bgColor = document.body.style.backgroundColor;
const pptColor = 'rgb(197, 68, 68)';
const toggleTalk = document.getElementById('toggle-talk')
let isMuted = true;

function unmute() {
   if (!connection.streamEvents.selectFirst({ local: true })) {
      return;
   }

   const firstLocalStream = connection.streamEvents.selectFirst({
      local: true
   }).stream;
   // const thisStreamEvent = connection.streamEvents[firstLocalStream.id];

   if (isMuted) {
      
      firstLocalStream.unmute('both');
      isMuted = false;
      console.log('unmuted');
      
      connection.extra.isMuted = isMuted;
      connection.updateExtraData();

      console.log('connection.streamEvents: ', connection.streamEvents);

      // Change background color
      // document.body.style.backgroundColor = pptColor;
      const x = document.getElementsByClassName('header');
      for (let i = 0; i < x.length; i++) {
         x[i].style.backgroundColor = pptColor;
      }

      toggleTalk.innerHTML = 'Mic is on';
   }
}

function mute() {
   if (!connection.streamEvents.selectFirst({ local: true })) {
      return;
   }

   const firstLocalStream = connection.streamEvents.selectFirst({
      local: true
   }).stream;
   // const thisStreamEvent = connection.streamEvents[firstLocalStream.id];

   if (!isMuted) {
      firstLocalStream.mute('both');
      isMuted = true;
      console.log('muted');

      connection.extra.isMuted = isMuted;
      // connection.updateExtraData();

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
   isMuted,
   mute,
   unmute
}