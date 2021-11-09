

export default function joinRoom(nsSocket, roomName){

   const currentRoom = document.querySelector('.curr-room-text')
   currentRoom.innerHTML =roomName;
   nsSocket.emit('joinRoom', roomName);
 
}

