var socket = io();

$(document).ready(function () {
    socket.on('connect', function () {
        socket.emit("get visitor");
    });

    $("#user_info").submit(function (event) {
        console.log('서버에 로그인정보를 보냅니다!');
        event.preventDefault();
        data = {
            user_name: document.getElementById("user_name").value
        }
        socket.emit("login", data);
    });

    socket.on('login success', function (userObj) {
        console.log('login success!');

        $.ajax({
            url: "/saveUserInfo",
            async: true,
            type: "POST",
            data: {
                user_name: userObj.name
            },
            dataType: "json",
            success: function (res) {
                location.href = "/lobby"
            },
        });
    });

    socket.on("login fail", function (data) {
        console.log("이름이 같은 유저가 접속중입니다!");
    });

    socket.on("change visitor", function (data) {
        console.log("visitors change!");
        document.getElementsByClassName("count").innerText = data.visitors;
    });
});