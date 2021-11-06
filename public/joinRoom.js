

export default function joinRoom(nsSocket, roomName){
    
     nsSocket.emit('joinRoom', roomName, (res)=>{
        console.log(res)
     })
}