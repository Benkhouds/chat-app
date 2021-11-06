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
    
    io.of(namespace.endpoint).on('connection', (namespaceSocket)=>{

         console.log(`${namespaceSocket.id} has joined ${namespace.name} server`);
         //sending available rooms the the client 
         namespaceSocket.emit('roomsData', namespace.rooms);

         //handling the room join 
         namespaceSocket.on('joinRoom', async(roomToJoin, cb)=>{
             namespaceSocket.join(roomToJoin);
             namespaceSocket.join('Editors');
             console.log(namespaceSocket.rooms)
             const size = await io.of(namespace.endpoint).in(roomToJoin).allSockets();
             console.log(size)
             cb(size.size)
         })

         //handling user messages 
        namespaceSocket.on('messageToRoom',(data)=>{
            console.log(data)
        })
    })

})

