module.exports = class message{
    constructor(id, writer, writerImg, content, date, isJoinMsg = false){
        this.id = id;
        this.writer = writer;
        this.writerImg = writerImg;
        this.content = content;
        this.date = date;
        this.isJoinMsg = isJoinMsg;
    }
}