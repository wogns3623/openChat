var socket = io();

inputFileReturnImg = function (input, inputId) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById(inputId).src = reader.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

$(document).ready(function () {
    socket.on('connect', function () {
        socket.emit("get visitor");
    });

    $("#user_info").submit(function (event) {
        console.log('서버에 로그인정보를 보냅니다!');
        event.preventDefault();
        data = {
            user_name: document.getElementById("user_name").value,
            user_img: document.getElementById("user_img").files[0],
            img_name: document.getElementById("user_img").files[0].name
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
        console.log(data.reason);
    });

    socket.on("concurrent user", function (data) {
        console.log("visitors change!");
        document.getElementsByClassName("count").innerText = data.visitors;
    });
});