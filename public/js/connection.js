// ......................................................
// ..................RTCMultiConnection Code.............
// ......................................................

var connection = new RTCMultiConnection();

// by default, socket.io server is assumed to be deployed on your own URL
connection.socketURL = '/';

connection.socketMessageEvent = 'audio-conference-demo';

connection.session = {
   audio: true,
   video: false
};

connection.mediaConstraints = {
   audio: true,
   video: false
};

connection.sdpConstraints.mandatory = {
   OfferToReceiveAudio: true,
   OfferToReceiveVideo: false
};

// https://www.rtcmulticonnection.org/docs/iceServers/
// use your own TURN-server here!
connection.iceServers = [{
   'urls': [
      'stun:stun.l.google.com:19302',
      'stun:stun1.l.google.com:19302',
      'stun:stun2.l.google.com:19302',
      'stun:stun.l.google.com:19302?transport=udp',
   ]
}];

connection.audiosContainer = document.getElementById('audios-container');
connection.onstream = function (event) {
   var mediaElement = yey(event.mediaElement, { title: event.userid });

   connection.audiosContainer.appendChild(mediaElement);

   // Pause stream
   mediaElement.media.pause();

   mediaElement.id = event.streamid;
};

connection.onstreamended = function (event) {
   var mediaElement = document.getElementById(event.streamid);
   if (mediaElement) {
      mediaElement.parentNode.removeChild(mediaElement);
   }
};

export {
   connection
}