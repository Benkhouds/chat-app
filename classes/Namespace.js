

class Namespace {
   
  constructor(id , name , img , endpoint){
      this.id = id ;
      this.name = name ;
      this.img = img ;
      this.endpoint = endpoint ;
      this.rooms = [];
  }

  addRoom(room){
    this.rooms.push(room);
  }

}

module.exports = Namespace ;