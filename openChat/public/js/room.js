var socket = io();

var addMessage = function (currentMsg) {
    var chat_area = document.getElementById("chat_area");
    messageHtml = `<div class="message box" id="message_${currentMsg.id}">
        <img src="/static/img/${currentMsg.writerImg}" alt="" class="message user_img">
        <p class="message user_name">
            ${currentMsg.writer}
            <span class="message date" style="font-size: 0.7em; left: 170px; color: gray">${currentMsg.date}</span>
        </p>
        <p class="message content">${currentMsg.content}</p>
    </div>`

    chat_area.innerHTML += messageHtml;
    chat_area.scrollTop = chat_area.scrollHeight;
};

var leaveRoom = function (data) {
    location.href = "/lobby";
}

document.title = decodeURI(location.href.split("/")[4]);
document.getElementById('room_name').innerHTML = document.title;

socket.on('connect', function (data) {
    socket.emit("get cookie");
});

socket.on('get cookie success', function (data) {
    socket.user_name = data.user_name;
    //socket.id = socket.user_name;
    socket.emit('join room', {
        room_name: document.title
    });
});

socket.on("join room success", function(data) {
    document.getElementById("room_image").children[0].src = "/static/img/"+data.img;
});

var submitMessage = function() {
    socket.emit('send message', {
        content: document.getElementById("input_text").value,
        date: new Date().toISOString(),
    });
    document.getElementById("input_text").value = '';
}

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

socket.on("update user_list", function(userList) {
    console.log("update user list!");
    userListDom = document.getElementById("user_list");
    userListDom.innerHTML = "";

    for(var i=0; i<userList.length; i++){
        var user = userList[i];
        userListDom.innerHTML += `<div class="list_profile">
            <img src="/static/img/${user.img}" alt="" class="profile_picture">
            <p class="user_name" style="font-size: 1.5em; margin: 0.5%; text-align: center; padding-top: 0.6em;">${user.name}</p>
        </div>`
    }
});