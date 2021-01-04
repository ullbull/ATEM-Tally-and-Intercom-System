const bgColor = document.body.style.backgroundColor;
const pptColor = 'rgb(131, 131, 131)';
const toggleTalk = document.getElementById('toggle-talk')
let isMuted = true;

function unmute(connection) {
   if (!connection.streamEvents.selectFirst({ local: true })) {
      return;
   }

   const firstLocalStream = connection.streamEvents.selectFirst({
      local: true
   }).stream;

   if (isMuted) {
      firstLocalStream.unmute('both');
      isMuted = false;

      console.log('unmuted');

      // Change background color
      // document.body.style.backgroundColor = pptColor;
      const x = document.getElementsByClassName('header');
      for (let i = 0; i < x.length; i++) {
         x[i].style.backgroundColor = pptColor;
      }

      toggleTalk.innerHTML = 'Mic is on';
   }
}

function mute(connection) {
   if (!connection.streamEvents.selectFirst({ local: true })) {
      return;
   }

   const firstLocalStream = connection.streamEvents.selectFirst({
      local: true
   }).stream;

   if (!isMuted) {
      firstLocalStream.mute('both');
      isMuted = true;

      console.log('muted');

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