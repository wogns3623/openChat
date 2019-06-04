module.exports = class message{
    constructor(id, writer, contents, date, isJoinMsg = false){
        this.id = id;
        this.writer = writer;
        this.contents = contents;
        this.date = date;
        this.isJoinMsg = isJoinMsg;
    }
}