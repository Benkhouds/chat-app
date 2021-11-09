
import joinRoom from './joinRoom.js'


export default function joinNs(namespace){
  
 //joining the desired namespace
 const nsSocket = io('http://localhost:8080'+namespace);

  nsSocket.on('roomsData', (rooms)=>{
      const roomsContainer = document.querySelector('.room-list');
      roomsContainer.innerHTML ="" ;
      //rendering the rooms
      rooms.forEach((room)=>{
       //conditional icon (private or public)
       const icon = room.privateRoom ? "<i class='bx bxs-lock-alt'></i>" :  "<i class='bx bx-globe'></i>"
        roomsContainer.innerHTML += `
        <li class="room flex justify-between px-2 py-1 border-2 border-gray-100 mb-1 rounded cursor-pointer font-semibold">
          ${room.name}<span>${icon}</span>
        </li>
        ` 
      })
      //joining a room on click
      const roomsList = document.querySelectorAll('.room');
      roomsList.forEach((room)=>{
        room.addEventListener('click',(e)=>joinRoom(nsSocket, e.target.innerText))
      })
      //joining the first room after joining a namespace 
      joinRoom(nsSocket, rooms[0].name); 
        //getting old messages
        nsSocket.on('roomHistory', (data)=>{
          renderOldMessages(data);
      })
      //getting messages
      nsSocket.on('messageFromUser',(data)=>{ 
        console.log(data)
        const message = buildHtmlMessage(data);
        const wrapper = document.getElementById('messages');
        wrapper.innerHTML += message;
        wrapper.scrollTo(0, wrapper.scrollHeight);  
      })
      //sending message
      const form = document.getElementById('message-form');
      form.addEventListener('submit', submitForm)


      nsSocket.on('updateUsers', (onlineUsers)=>{
        console.log(onlineUsers)
        const activeUsers = document.querySelector('.curr-room-num-users')
        activeUsers.innerHTML =  'Active users :'+ onlineUsers;
      })
  })
  
  nsSocket.on('disconnect', ()=>{
    console.log('disconnecting')
    document.querySelector('#message-form').removeEventListener('submit', submitForm)
  })
  //form submission
  function submitForm(e){
      e.preventDefault();
      const message = document.getElementById('user-message')
      if(message){
          nsSocket.emit('messageToRoom', message.value.trim());
      }
      message.value ="";
  }
  return nsSocket;
}

//rendering a single message
function buildHtmlMessage(msg){
  return `
      <li class="flex items-center mb-2">
        <div class="user-image mr-3">
            <img src="${msg.image}" class="rounded" />
        </div>
        <div class="user-message">
            <div class="user-name-time text-gray-600 mr-2">${msg.username} <span class="text-sm text-gray-300">${new Date(msg.time).toLocaleTimeString()}</span></div>
            <div class="message-text">${msg.text}</div>
        </div>
    </li>
  `
}
//rendering old messages
function renderOldMessages(messages){
   const wrapper = document.getElementById('messages')
   wrapper.innerHTML ="";
   messages.length && messages.forEach((message)=>{
     wrapper.innerHTML += buildHtmlMessage(message);
    })
    wrapper.scrollTo(0, wrapper.scrollHeight)
}
