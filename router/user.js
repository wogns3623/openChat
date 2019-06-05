module.exports = class user{
    constructor(id, name, img){
        this.id = id;
        this.name = name;
        this.img = img;
        this.connectedRoom = null
    }
    
    connectRoom(room) {
        this.connectedRoom = room;
    }

    disconnectRoom() {
        this.connectedRoom = null;
    }
}