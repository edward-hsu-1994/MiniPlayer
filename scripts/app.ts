interface Node {
    paused: boolean;
    ended: boolean;
    pause(): void;
    play(): void;
    getCanvas(): HTMLCanvasElement; 
    style: CSSStyleDeclaration;
}
interface HTMLElement {
    getCanvas(): HTMLCanvasElement; 
}
interface StyleSheet {
    rules: any;
    cssRules: any;
}
interface HTMLVideoElement extends HTMLImageElement {//Fix Type Convert

}
enum PlayStatus { Play, Pause };

declare var chrome;


console.clear();

function StringToElements(HTML: string): Node[]{
    var temp = document.createElement('div');
    temp.innerHTML = HTML;

    var result: Node[] = new Array<Node>();
    for (var i = 0; i < temp.childNodes.length; i++) {
        result.push(temp.childNodes.item(i));
    }
    return result;
}

function CreateMiniPlayer(): HTMLElement {
    console.info("產生迷你播放器...開始");
    
    var Request = new XMLHttpRequest();
    Request.open("Get", chrome.extension.getURL("templets/MiniPlayer.html"), false);
    Request.send();

    var MiniPlayerTemplet = Request.responseText;
    var MiniPlayer = StringToElements(MiniPlayerTemplet)[0];

    var YoutubeContent = document.getElementById('content');
    MiniPlayer.style.right = (window.innerWidth - YoutubeContent.offsetWidth) / 2 + "px";

    document.getElementById('watch7-main').appendChild(MiniPlayer);
    console.info("產生迷你播放器...完成");

    MiniPlayer.getCanvas = function () {
        return <HTMLCanvasElement>document.getElementById('MiniPlayerCanvas');
    }
    return <HTMLElement>MiniPlayer;
}

function ChangeControllerIcon(Status : PlayStatus) {
    document.getElementById('PlayCtrl').style.background = "url('" + chrome.extension.getURL('images/controller/' + PlayStatus[Status] + '.png') + "')";
}



function Init(event?) {
    if (document.getElementById("MiniPlayer") != null) return;

    var MiniPlayer: HTMLElement = CreateMiniPlayer();
    var PlayCtrl = document.getElementById('PlayCtrl');
    console.log("YMP開始初始化");

    var Moveable = false;
    MiniPlayer.onmousedown = function (event) {
        document.body.onselectstart = function () { return false;}
        Moveable = true;
    }

    MiniPlayer.onmouseup = function (event) {
        document.body.onselectstart = null;
        Moveable = false;
    }
    
    PlayCtrl.onmousemove =

    window.onmouseup = MiniPlayer.onmouseup;
    window.onmousemove = function (event) {
        if (!Moveable) return;
        MiniPlayer.style.right = parseInt(window.getComputedStyle(document.getElementById("MiniPlayer")).right) - event.movementX + "px";
        MiniPlayer.style.bottom = parseInt(window.getComputedStyle(document.getElementById("MiniPlayer")).bottom) - event.movementY + "px";
    }
    PlayCtrl.onmousemove = window.onmousemove;

    var video: HTMLVideoElement = <HTMLVideoElement>document.getElementsByClassName('html5-main-video')[0];

    var timer = null;

    PlayCtrl.onclick = function () {
        if (!video.paused) {
            video.pause();
            ChangeControllerIcon(PlayStatus.Play);
        } else {
            video.play();
            ChangeControllerIcon(PlayStatus.Pause);
        }
    }

    video.onplaying = function () {
        ChangeControllerIcon(PlayStatus.Pause);
    }
    video.onpause = (video.onended = function () {
        ChangeControllerIcon(PlayStatus.Play);
    })


    function StartMiniPlayer() {
        if (timer) return;//已經啟動
        timer = setInterval(function () {
            var Context: CanvasRenderingContext2D = MiniPlayer.getCanvas().getContext('2d');
            var VideoScale = parseInt(video.style.width) / parseInt(video.style.height);
            MiniPlayer.getCanvas().width = MiniPlayer.getCanvas().height * VideoScale;
            Context.drawImage(<HTMLImageElement>video, 0, 0, MiniPlayer.getCanvas().width, MiniPlayer.getCanvas().height);
        }, 60);
    }

    function StopMiniPlayer() {
        window.clearInterval(timer);
        timer = null;
    }
    window.onscroll = function () {
        if (video.ended || window.scrollY < (parseInt(video.style.height) + 10) / 2) {
            MiniPlayer.getCanvas().style.display = "none";
            StopMiniPlayer();
            return;
        }
        MiniPlayer.getCanvas().style.display = "initial";
        StartMiniPlayer();
    }
    console.log("YMP初始化完成");
}

document.addEventListener('DOMNodeInserted', Init);

Init();