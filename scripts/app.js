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
    miniVideo.style.cursor = "pointer";
    miniVideo.style.boxShadow = "0px 0px 5px black";
    miniVideo.style.borderRadius = "8px";
    miniVideo.style.display = "none";
    document.getElementById('watch7-main').appendChild(miniVideo);
    var video = document.getElementsByClassName('html5-main-video')[0];
    var timer = null;
    miniVideo.addEventListener('click', function () {
        if (!video.paused) {
            video.pause();
        }
        else {
            video.play();
        }
    }, false);
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