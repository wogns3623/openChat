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

socket.on('connect', function () {
    socket.emit("get visitor");
});

var login = function () {
    console.log('서버에 로그인정보를 보냅니다!');

    data = {
        user_name: document.getElementById("user_name").value,
        user_img: document.getElementById("user_img").files[0]
    }
    if(data.user_img) data.img_name = document.getElementById("user_img").files[0].name;

    socket.emit("login", data);
}

socket.on('login success', function (userObj) {
    console.log('login success!');

    var httpR = new XMLHttpRequest();
    httpR.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            location.href = "/lobby"
        }
    };
    httpR.open("POST", "/saveUserInfo", true);
    httpR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    httpR.send('user_name=' + encodeURIComponent(userObj.name));
});

socket.on("login fail", function (data) {
    console.log(data.reason);
});

socket.on("concurrent user", function (data) {
    console.log("visitors change!");
    document.getElementsByClassName("count").innerText = data.visitors;
});