import * as talk from './talk.js';

function getElement(mediaElement, config) {
   console.log('!½!!!!!', mediaElement);
   config = config || {};

   if (!mediaElement.nodeName || (mediaElement.nodeName.toLowerCase() != 'audio' && mediaElement.nodeName.toLowerCase() != 'video')) {
      if (!mediaElement.getVideoTracks().length) {
         return getAudioElement(mediaElement, config);
      }

      var mediaStream = mediaElement;
      mediaElement = document.createElement(mediaStream.getVideoTracks().length ? 'video' : 'audio');

      try {
         mediaElement.setAttributeNode(document.createAttribute('autoplay'));
         mediaElement.setAttributeNode(document.createAttribute('playsinline'));
      } catch (e) {
         mediaElement.setAttribute('autoplay', true);
         mediaElement.setAttribute('playsinline', true);
      }

      if ('srcObject' in mediaElement) {
         mediaElement.srcObject = mediaStream;
      } else {
         mediaElement[!!navigator.mozGetUserMedia ? 'mozSrcObject' : 'src'] = !!navigator.mozGetUserMedia ? mediaStream : (window.URL || window.webkitURL).createObjectURL(mediaStream);
      }
   }


   var mediaElementContainer = document.createElement('div');
   if (config.title) {
      mediaElementContainer.innerHTML = `User: ${config.title}<br>`;
   }
   mediaElementContainer.appendChild(mediaElement);
   mediaElementContainer.media = mediaElement;

   return mediaElementContainer;
}

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
   console.log('Incoming stream: ', event);
   console.log('connection.streamEvents: ', connection.streamEvents);
   const mediaElement = getElement(event.mediaElement, { title: event.userid });
   connection.audiosContainer.appendChild(mediaElement);

   // Pause stream
   if (event.extra.isMuted) {
      // mediaElement.media.pause();
      event.stream.mute('both');
   }

   mediaElement.id = event.streamid;
};

connection.onstreamended = function (event) {
   const mediaElement = document.getElementById(event.streamid);
   if (mediaElement) {
      mediaElement.parentNode.removeChild(mediaElement);
   }
};

connection.extra = {
   id: connection.userid,
   isMuted: true
}

export {
   connection
}