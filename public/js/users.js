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
   // document.getElementById("my-id").innerHTML = `My ID: ${myId}`;

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

export {
   createUserItemContainer,
   updateUserList
}