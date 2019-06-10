const io = require("socket.io-client");
const {ipcRenderer} = require('electron');
const serverIP = ipcRenderer.sendSync("get serverIP");
const socket = io(serverIP);

var inputFileReturnImg = function (input, inputId) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById(inputId).src = reader.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

var login = function () {
    console.log('서버에 로그인정보를 보냅니다!');

    data = {
        user_name: document.getElementById("user_name").value,
        user_img: document.getElementById("user_img").files[0]
    }
    if(data.user_img) data.img_name = data.user_img.name;

    socket.emit("login", data);
}

socket.on('connect', () => {
    socket.emit("get concurrent user");
});

socket.on('connect_error', (error) => {
    if(socket.disconnected){
        alert("서버 점검중입니다!");
        ipcRenderer.send("quit app");
    }
});

socket.on('login success', (userObj) => {
    console.log('login success!');

    ipcRenderer.send('set cookie', userObj.name);
});

socket.on("login fail", (data) => {
    alert(data.reason);
});

socket.on("concurrent user", (data) => {
    console.log("visitors change!");
    document.getElementsByClassName("count").innerText = data.visitors;
});

ipcRenderer.on("set cookie success", () => {
    ipcRenderer.send('render', 'lobby.html');
});