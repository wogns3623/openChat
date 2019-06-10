module.exports = class user{
    constructor(id, name, img=null){
        this.id = id;
        this.name = name;
        this.img = img;
        this.connectedRoom = null;
        this.visitedRooms = {};

        this.currentSocket = null;
        this.timer = null;
        this.roomTimer = null;
    }

    setSocket(socket) {
        this.currentSocket = socket;
    }
    
    connectRoom(room) {
        this.connectedRoom = room;
        this.visitedRooms[room] = room;
    }

    disconnectRoom() {
        this.connectedRoom = null;
        try {
            this.currentSocket.emit('remove room');
        } catch (error) {
            console.error(error);
        }
    }

    setTimer(timer) {
        this.timer = timer;
    }

    distroyTimer() {
        if(this.timer != null){
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    distroyRoomTimer() {
        if(this.roomTimer != null){
            clearTimeout(this.roomTimer);
            this.roomTimer = null;
        }
    }
}