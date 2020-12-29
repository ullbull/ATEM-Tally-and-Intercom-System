let isAlreadyCalling = false;
let getCalled = false;

const existingCalls = [];

const { RTCPeerConnection, RTCSessionDescription } = window;

const peerConnection = new RTCPeerConnection();

function unselectUsersFromList() {
   const alreadySelectedUser = document.querySelectorAll(
      ".active-user.active-user--selected"
   );

   alreadySelectedUser.forEach(el => {
      el.setAttribute("class", "active-user");
   });
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
      unselectUsersFromList();
      userContainerEl.setAttribute("class", "active-user active-user--selected");
      const talkingWithInfo = document.getElementById("talking-with-info");
      talkingWithInfo.innerHTML = `Talking with: "User: ${socketId}"`;
      callUser(socketId);
   });

   return userContainerEl;
}

async function callUser(socketId) {
   const offer = await peerConnection.createOffer();
   await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

   socket.emit("call-user", {
      offer,
      to: socketId
   });
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

// Connect socket
const socket = io();

socket.on('message', (message) => {
   console.log('Received message:', message);
});

socket.on("connected clients", (clientIDs) => {
   updateUserList(clientIDs, socket.id);
});

socket.on("call-made", async data => {
   await peerConnection.setRemoteDescription(
      new RTCSessionDescription(data.offer)
   );
   const answer = await peerConnection.createAnswer();
   await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

   socket.emit("make-answer", {
      answer,
      to: data.socket
   });
});

socket.on("answer-made", async data => {
   await peerConnection.setRemoteDescription(
      new RTCSessionDescription(data.answer)
   );

   if (!isAlreadyCalling) {
      callUser(data.socket);
      isAlreadyCalling = true;
   }
});

socket.on('disconnect client', (clientId) => {
   console.log('client disconnected:', clientId);
   //    const element = document.getElementById(clientId); 
   //    if (element) {
   //      element.remove();
   //    }
});

peerConnection.ontrack = function ({ streams: [stream] }) {
   const remoteAudio = document.getElementById("remote-audio");
   if (remoteAudio) {
      remoteAudio.srcObject = stream;
   }
};

navigator.getUserMedia(
   {
      // video: true,
      audio: true
   },
   stream => {
      const localAudio = document.getElementById("local-audio");
      if (localAudio) {
         localAudio.srcObject = stream;
      }

      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
   },

   error => {
      console.warn(error.message);
   }
);