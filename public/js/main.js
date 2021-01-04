const roomId = 'apa';
const bgColor = document.body.style.backgroundColor;
const pptColor = 'rgb(131, 131, 131)';
const toggleTalk = document.getElementById('toggle-talk')

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

// Open or join room
connection.openOrJoin(roomId);

///////////////////////////////////////////////////////

// Mute my stream
// setTimeout(function () {
//    const myStream = connection.streamEvents.selectFirst({
//       local: true
//    }).stream;
//    myStream.mute('both');
// }, 1000);
let isMuted = true;

function unmute() {
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
      for (i = 0; i < x.length; i++) {
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

   if (!isMuted) {
      firstLocalStream.mute('both');
      isMuted = true;

      console.log('muted');

      // Change background color
      // document.body.style.backgroundColor = bgColor;
      const x = document.getElementsByClassName('header');
      for (i = 0; i < x.length; i++) {
         x[i].style.backgroundColor = bgColor;
      }

      toggleTalk.innerHTML = 'Mic is off';
   }
}

window.addEventListener('keydown', event => {
   if (event.shiftKey) {
      unmute();
   }

   if (event.ctrlKey) {
      console.log('ctrlkey down')
   }
});

window.addEventListener('keyup', event => {
   console.log(`${event.key} up`);
   console.log('connection', connection);


   if (event.key == 'Shift') {
      mute();
   }
});

window.addEventListener('touchstart', event => {
   unmute();
});

window.addEventListener('touchend', event => {
   mute();
});

toggleTalk.onclick = event => {
   if (isMuted) {
      unmute();
   }
   else {
      mute();
   }
}

function createUserItemContainer(socketId, thisUser = false) {
   const userContainerEl = document.createElement("div");
   const usernameEl = document.createElement("p");

   userContainerEl.setAttribute("class", "active-user");
   userContainerEl.setAttribute("id", socketId);
   usernameEl.setAttribute("class", "username");
   usernameEl.innerHTML = `User: ${socketId}`;

   userContainerEl.appendChild(usernameEl);

   if (thisUser) {
      usernameEl.innerHTML = `My id: ${socketId}`;
      return userContainerEl;
   }

   userContainerEl.addEventListener("click", () => {
      console.log(`Clicked ${socketId}`);
   });

   return userContainerEl;
}

function updateUserList(socketIds, myId) {
   const activeUserContainer = document.getElementById("active-user-container");
   // Set my id
   document.getElementById("my-id").innerHTML = `My ID: ${myId}`;

   // Clear list
   while (activeUserContainer.firstChild) {
      activeUserContainer.removeChild(activeUserContainer.lastChild);
   }

   // Fill list
   socketIds.forEach(socketId => {
      const alreadyExistingUser = document.getElementById(socketId);
      if (!alreadyExistingUser && socketId != myId) {
         const userContainerEl = createUserItemContainer(socketId);
         activeUserContainer.appendChild(userContainerEl);
      }
   });
}

const socket = connection.socket;

function sendData(type, payload) {
   socket.emit(type, payload);
}

socket.on('message', (message) => {
   console.log('Received message:', message);
});

socket.on("connected clients", (clientIDs) => {
   updateUserList(clientIDs, socket.id);
});

socket.on('disconnect client', (clientId) => {
   console.log('client disconnected:', clientId);
});