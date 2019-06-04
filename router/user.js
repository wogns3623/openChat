module.exports = class user{
    constructor(id, name, img, socket_id){
        this.id = id;
        this.name = name;
        this.img = img;
        this.socket_id = socket_id;
        this.connectedRoom = null
    }
    
    connectRoom(room) {
        this.connectedRoom = room;
    }

    disconnectRoom() {
        this.connectedRoom = null;
    }
}