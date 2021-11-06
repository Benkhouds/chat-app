


class Room {
   
    constructor(id , name , namespace, privateRoom = false ){
        this.id = id ;
        this.name = name ;
        this.namespace = namespace ;
        this.privateRoom= privateRoom;
        this.history = [];
    }
    addMessage(message){
        this.history.push(message);
    }
    clearHistory(){
     this.history = [];
    }


}

module.exports = Room ; 