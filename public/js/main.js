$(document).ready(function () {

   // const mic = document.getElementById('mic');


   // var socket = io("https://server:4000", verify=false);
   var socket = io();
   socket.on('audio stream', function (name, blob) {
      var video = document.querySelector('video');
      video.src = blob;
   });
   $('#ptt').click(function () {
      micOn();
      document.getElementById("ptt").disabled = true;
      document.getElementById("ptt-off").disabled = false;
   });
   $('#ptt-off').click(function () {
      stream.getAudioTracks()[0].stop();
      document.getElementById("ptt").disabled = false;
      document.getElementById("ptt-off").disabled = true;
   });
   function micOn() {
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      var constraints = {
         audio: true,
         //   video: false
      };
      //   var video = document.querySelector('video');

      function successCallback(stream) {
         const mic = document.querySelector('#mic');
         // window.stream = stream; // stream available to console
         // var blob = window.URL.createObjectURL(stream);

         // Create media recorder
         const mediaRecorder = new MediaRecorder(stream);

         console.log('starting media recorder')
         mediaRecorder.start(500);
         console.log(mediaRecorder);

         let chunks = [];

         mediaRecorder.ondataavailable = function (e) {
            console.log('e.data:', e.data);

            chunks.push(e.data);


            const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
            chunks.length = 1;
            const audioURL = window.URL.createObjectURL(blob);
            mic.src = audioURL;
            mic.play();

         }

         mediaRecorder.onstop = function (e) {

            // const clipContainer = document.createElement('article');
            // const clipLabel = document.createElement('p');
            // const audio = document.createElement('audio');
            // const deleteButton = document.createElement('button');

            // clipContainer.classList.add('clip');
            // audio.setAttribute('controls', '');
            // deleteButton.innerHTML = "Delete";
            // clipLabel.innerHTML = clipName;

            // clipContainer.appendChild(audio);
            // clipContainer.appendChild(clipLabel);
            // clipContainer.appendChild(deleteButton);
            // soundClips.appendChild(clipContainer);

            const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
            chunks = [];
            const audioURL = window.URL.createObjectURL(blob);
            mic.src = audioURL;
            // audio.src = audioURL;

            // deleteButton.onclick = function(e) {
            //   let evtTgt = e.target;
            //   evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
            // }
         }




         // var blob = stream.toBlob();
         // socket.emit('audio stream', myName, blob);
         // console.log('blob: ', blob);
         // mic.srcObject = stream;

      }

      function errorCallback(error) {
         console.log('navigator.getUserMedia error: ', error);
      }

      navigator.getUserMedia(constraints, successCallback, errorCallback);
   }
});