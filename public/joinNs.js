import joinRoom from './joinRoom.js';

export default function joinNamespace(namespace){
 //joining the desired namespace
 const nsSocket = io('http://localhost:8080'+namespace);

 nsSocket.on('roomsData', (rooms)=>{
    const roomsContainer = document.querySelector('.room-list');
    roomsContainer.innerHTML ="" ;
    //rendering the rooms
    rooms.forEach((room)=>{
      let iconType = room.privateRoom ? 'lock' : 'globe' ;   
      roomsContainer.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${iconType}"></span>${room.name}</li>` 
    })
    //joining a room on click
    const roomsList = document.querySelectorAll('.room');
     roomsList.forEach((room)=>{
       room.addEventListener('click',(e)=>{
          console.log(e.target.innerText);
       })
     })
    //joining a default room 
     joinRoom(nsSocket, rooms[0].name);
     nsSocket.emit('messageToRoom', 'hamza');
    
 })


}