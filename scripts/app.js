console.clear();
function Init(event) {
    if (document.getElementById("MiniPlayer") != null)
        return;
    console.log("YMP開始初始化");
    var content = document.getElementById('content');
    var miniVideo = document.createElement('canvas');
    miniVideo.id = "MiniPlayer";
    miniVideo.width = 380;
    miniVideo.height = 200;
    miniVideo.style.zIndex = "999999";
    miniVideo.style.position = "fixed";
    miniVideo.style.right = (window.innerWidth - content.offsetWidth) / 2 + "px";
    miniVideo.style.bottom = "15px";
    miniVideo.style.cursor = "move";
    miniVideo.style.boxShadow = "0px 0px 5px black";
    miniVideo.style.borderRadius = "8px";
    miniVideo.style.display = "none";
    var Moveable = false;
    miniVideo.onmousedown = function (event) {
        if (event.offsetX <= 32 && event.offsetY <= 32)
            Moveable = true;
    };
    miniVideo.onmouseup = function (event) {
        Moveable = false;
    };
    //miniVideo.onmouseout = miniVideo.onmouseup;
    miniVideo.onmousemove = function (event) {
        if (event.offsetX > 32 || event.offsetY > 32) {
            this.style.cursor = "pointer";
        }
        else {
            this.style.cursor = "move";
        }
    };
    window.onmousemove = function (event) {
        console.log(event);
        if (!Moveable)
            return;
        miniVideo.style.right = parseInt(miniVideo.style.right) - event.movementX + "px";
        miniVideo.style.bottom = parseInt(miniVideo.style.bottom) - event.movementY + "px";
    };
    miniVideo.onclick = function (event) {
        if (event.offsetX <= 32 && event.offsetY <= 32)
            return;
        if (!video.paused) {
            video.pause();
        }
        else {
            video.play();
        }
    };
    document.getElementById('watch7-main').appendChild(miniVideo);
    var video = document.getElementsByClassName('html5-main-video')[0];
    var timer = null;
    function StartMiniPlayer() {
        if (timer)
            return; //已經啟動
        timer = setInterval(function () {
            var context = miniVideo.getContext('2d');
            var k = parseInt(video.style.width) / parseInt(video.style.height);
            miniVideo.width = miniVideo.height * k;
            context.drawImage(video, 0, 0, miniVideo.width, miniVideo.height);
        }, 60);
    }
    function StopMiniPlayer() {
        window.clearInterval(timer);
        timer = null;
    }
    window.onscroll = function () {
        if (video.ended || window.scrollY < (parseInt(video.style.height) + 10) / 2) {
            miniVideo.style.display = "none";
            StopMiniPlayer();
            return;
        }
        miniVideo.style.display = "initial";
        StartMiniPlayer();
    };
    console.log("YMP初始化完成");
}
Init();
document.addEventListener('DOMNodeInserted', Init);
//# sourceMappingURL=app.js.map