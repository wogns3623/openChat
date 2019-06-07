var socket = io();

var addMessage = function (currentMsg) {
    var chat_area = document.getElementById("chat_area");
    messageHtml = `<div class="message box" id="message_${currentMsg.id}">
    <img src="/static/img/userImg/${currentMsg.writer.img}" alt="" class="message writer_picture">
    <p class="message writer_name">${currentMsg.writer}</p>
    <p class="message content">${currentMsg.content}</p>
    </div>`
    
    
    chat_area.innerHTML += messageHtml;
    chat_area.scrollTop = chat_area.scrollHeight;
};

var leaveRoom = function () {
    socket.disconnect();
}

document.getElementById('room_name').innerHTML = location.href.split("/")[4];

$(document).ready(function () {

    socket.on('connect', function (data) {
        socket.emit("get cookie");
    });

    socket.on('get cookie success', function (data) {
        socket.user_name = data.user_name;
        //socket.id = socket.user_name;
        socket.emit('join room', {
            room_name: location.href.split("/")[4]
        });
    });

    $("input_area").submit(function (event) {
        console.log('메시지를 송신합니다!');
        event.preventDefault();

        socket.emit('send message', {
            content: $("#input_text").val(),
            date: new Date().toISOString(),
        });
        $("#input_text").val('');
    });

    socket.on("receive beforeMessages", function (data) {
        console.log("이전에 주고받은 메시지들을 수신하였습니다!");
        //if(currentMsg.isJoinMsg) //TODO join메시지만의 형식 필요함
        for (var i = 0; i < data.msgs.length; i++) {
            var msg = data.msgs[i];
            addMessage(msg);
        }
    });

    socket.on("receive message", function (data) {
        console.log("메시지를 수신하였습니다!");
        //if(currentMsg.isJoinMsg) //TODO join메시지만의 형식 필요함
        addMessage(data.msg);
    });

    socket.on("remove room", function () {
        location.href = "/lobby";
    });

    socket.on("connection fail", function () {
        location.href = "/";
    });

});