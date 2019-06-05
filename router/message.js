module.exports = class message{
    constructor(id, writer, content, date, isJoinMsg = false){
        this.id = id;
        this.writer = writer;
        this.content = content;
        this.date = date;
        this.isJoinMsg = isJoinMsg;
    }
}