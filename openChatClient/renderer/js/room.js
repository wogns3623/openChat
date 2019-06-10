const io = require("socket.io-client");
const {ipcRenderer} = require("electron");
const serverIP = ipcRenderer.sendSync("get serverIP");
const user_name = ipcRenderer.sendSync("get userName");
const room_name = ipcRenderer.sendSync("get currentRoom");
const socket = io(serverIP);

var addMessage = function (currentMsg) {
    var chat_area = document.getElementById("chat_area");
    messageHtml = `<div class="message box" id="message_${currentMsg.id}">
        <img src="${serverIP}/static/img/${currentMsg.writerImg}" alt="" class="message user_img">
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
    console.log("leave room");
    ipcRenderer.send('render', "lobby.html");
}

var submitMessage = function() {
    socket.emit('send message', {
        user_name: user_name,
        content: document.getElementById("input_text").value,
        date: new Date().toISOString(),
    });
    document.getElementById("input_text").value = '';
}

socket.on('connect', function (data) {
    console.log("socket connect");
    socket.emit("send userInfo", {
        user_name: user_name
    });
});

socket.on('get userInfo success', function (data) {
    console.log("send userInfo success!");
    socket.user_name = data.user_name;
    //socket.id = socket.user_name;
    socket.emit('join room', {
        room_name: room_name,
        user_name: user_name
    });
});

socket.on("join room success", function(data) {
    console.log("join room success!");
    document.getElementById('room_name').innerHTML = room_name;
    document.getElementById("room_image").children[0].src = serverIP+"/static/img/"+data.img;
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
    console.log("room removed")
    ipcRenderer.send('render', "lobby.html");
});

socket.on("connection fail", function () {
    console.log("connect fail")
    ipcRenderer.send('render', "login.html");
});

socket.on("update user_list", function(userList) {
    console.log("update user list!");
    userListDom = document.getElementById("user_list");
    userListDom.innerHTML = "";

    for(var i=0; i<userList.length; i++){
        var user = userList[i];
        userListDom.innerHTML += `<div class="list_profile">
            <img src="${serverIP}/static/img/${user.img}" alt="" class="profile_picture">
            <p class="user_name" style="font-size: 1.5em; margin: 0.5%; text-align: center; padding-top: 0.6em;">${user.name}</p>
        </div>`
    }
});