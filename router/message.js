module.exports = class message{
    constructor(id, writer, contents, date){
        this.id = id;
        this.writer = writer;
        this.contents = contents;
        this.date = date;
    }
}