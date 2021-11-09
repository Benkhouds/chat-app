const path = require('path')
const express= require('express')
const socketIo = require('socket.io')
const namespaces = require('./data/namespaces');

const app = express()
app.use(express.static(path.join(__dirname, '/public')))

const expressServer = app.listen(8080);

const io= socketIo(expressServer)

//sending available namespaces to the client
io.on('connection',(socket)=>{  
   const nsData = namespaces.map((ns)=>({endpoint: ns.endpoint ,img : ns.img }));
   socket.emit('nsInfo', nsData);
 
}) 


namespaces.forEach((namespace)=>{
    //after connection on a namespace
    io.of(namespace.endpoint).on('connection', (namespaceSocket)=>{
         const username = namespaceSocket.handshake.query.username ;
         console.log(`${namespaceSocket.id} has joined ${namespace.name} server`);
         //sending available rooms the the client 
         namespaceSocket.emit('roomsData', namespace.rooms);

         //handling the room join 
         namespaceSocket.on('joinRoom', async(roomToJoin)=>{
             //socket.rooms returns an object with containing the joined rooms
             //the socket always join its own specific room in addition to the custom rooms
             const rooms  =Array.from(namespaceSocket.rooms) 
             if(rooms.length > 1){
                 namespaceSocket.leave(rooms[1]);
                 await updateUsers(namespace.endpoint, rooms[1]);
             }
             namespaceSocket.join(roomToJoin);
            await updateUsers(namespace.endpoint, roomToJoin)
             const room = namespace.rooms.find(elem=> elem.name === roomToJoin);
             namespaceSocket.emit("roomHistory",room.history )
         })

        //handling user messages 
        namespaceSocket.on('messageToRoom',(data)=>{

            console.log(data)
            const message={
                text:data,
                username,
                image:'https://via.placeholder.com/30',
                time : Date.now()
            } 
            const roomName = Array.from(namespaceSocket.rooms)[1] ;
            //pushing the message to the room history
            const room = namespace.rooms.find(elem=> elem.name === roomName);
            room.history.push(message);
            //sending to everyone except sender (useful in notifications)
            //namespaceSocket.broadcast.emit('messageFromUser', data);
            io.of(namespace.endpoint).to(roomName).emit('messageFromUser', message);
        })
    })

})


async function updateUsers(namespace , room){
    const size = await io.of(namespace).in(room).allSockets();
    io.of(namespace).to(room).emit("updateUsers", size.size);
   
}