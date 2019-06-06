module.exports = class user{
    constructor(id, name, img){
        this.id = id;
        this.name = name;
        this.img = img;
        this.connectedRoom = null
        this.currentSocket = null
    }

    setSocket(socket) {
        this.currentSocket = socket;
    }
    
    connectRoom(room) {
        this.connectedRoom = room;
    }

    disconnectRoom() {
        this.connectedRoom = null;
        this.currentSocket.emit('remove room');
    }
}