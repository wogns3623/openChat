var socket = io();

var inputFileReturnImg = function (input, inputId) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById(inputId).src = reader.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
};

var disconnect = function() {
    location.href = "/";
};

var createRoom_PopUp = function (tf) {
    var targetDom = document.getElementById("createRoom").children[0];
    var value;

    if (tf) value = "visible";
    else value = "hidden";

    document.getElementById("backgroundCover").style.visibility = value;
    targetDom.style.visibility = value;
};
var enterRoom_PopUp = function (tf, name, users, maxUser, img) {
    var targetDom = document.getElementById("enterRoom").children[0];
    var value;

    if (tf) {
        value = "visible";

        var info_field = targetDom.children[0].children[1];
        
        info_field.children[0].children[0].children[0].innerHTML = name;
        info_field.children[0].children[2].children[0].innerHTML = `현재 접속인원: ${users} / 최대 접속인원: ${maxUser}`;
        info_field.children[1].children[0].src = img;
    }
    else value = "hidden";


    document.getElementById("backgroundCover").style.visibility = value;
    targetDom.style.visibility = value;
};

//todo 바뀐 html구조에 맞게 수정하기
var createRoom = function(target){
    var targetDom = document.getElementById(target);
    var values = targetDom.getElementsByClassName("room_info");

    if(values.room_name.value == "") {
        alert("방 이름을 입력해주세요!");
        return;
    }
    
    var data = {
        room_name: values.room_name.value,
        room_pw: values.room_pw.value,
        room_maxUser: values.room_maxUser.value,
        room_img: values.room_img.files[0]
    };
    if(data.room_img) {
        data.img_name = values.room_img.files[0].name;
    }
    
    socket.emit("enter room", data);
}
var enterRoom = function(target){
    var targetDom = document.getElementById(target);
    var values = targetDom.getElementsByClassName("room_info");
    
    var data = {
        room_name: values.room_name.innerHTML,
        room_pw: values.room_pw.value,
    };
    
    socket.emit("enter room", data);
}

socket.on('connect', function (data) {
    console.log("socket connect");
    socket.emit("get cookie");
});

socket.on("get cookie success", function (data) {
    console.log("successfully get cookie");
    socket.user_name = data.user_name;
    socket.emit("get room_list");
});

socket.on("enter room success", function (data) {
    location.href = "/room/" + data.room_name;
});

socket.on("enter room fail", function (data) {
    alert(data);
});

socket.on("connection fail", function () {
    location.href = "/";
});

socket.on("update room_list", function (rooms) {
    console.log("update room_list");

    var roomArea = document.getElementById("list_area");
    roomArea.innerHTML = "";

    var rooms = Object.values(rooms);

    for (var i = 0; i < rooms.length; i++) {
        var room = rooms[i];
        var name = room.name;
        var img = room.img == null ? '/static/img/defaultRoom.png' : '/static/img/roomImg/'+room.img;
        var admin = room.admin;
        var usersColor = Object.keys(room.users).length == room.maxUser ? "red" : "green";
        var usersStr = `${Object.keys(room.users).length}/${room.maxUser}`;
        var onClickEvent;
        if(usersColor == "red"){
            onClickEvent = "alert('꽉 찬 방이라 들어갈 수 없어요!')";
        } else {
            onClickEvent = `enterRoom_PopUp(true, '${name}', '${Object.keys(room.users).length}', '${room.maxUser}', '${img}');`
        }
        var content = `<div class="room_container" id="room_${name}" onclick="${onClickEvent}">
            <button class="room_button">
                <img class="room_image" src="${img}">
                <div class="room_name">${name}</div>
                <div class="padding"></div>
                <div class="extra_info">
                    <div class="host_name">${admin}</div>
                    <div class="count" style="color:${usersColor}">
                        ${usersStr}
                    </div>
                </div>
            </button>
        </div>`;

        roomArea.innerHTML += content;
    }
});