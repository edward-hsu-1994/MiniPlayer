interface HTMLVideoElement extends HTMLImageElement { }//Fix Type Convert
declare var chrome;
console.clear();

class Extension {//擴充功能靜態物件
    public static ConvertStringToNode(HTML: string): Node {
        return Extension.ConvertStringToNodes(HTML)[0];
    }
    public static ConvertStringToNodes(HTML: string): Node[] {
        var temp = document.createElement('div');
        temp.innerHTML = HTML;

        var result: Node[] = new Array<Node>();
        for (var i = 0; i < temp.childNodes.length; i++) {
            result.push(temp.childNodes.item(i));
        }
        return result;
    }
    public static IsWatchPage(): boolean {
        return location.pathname.toLowerCase() == "/watch";
    }
}

class MiniPlayer {//播放器物件
    private Id: string;

    //取得Youtube影片播放器
    private Timer: any;
    private _Visable: boolean;//物件目前是否為可見狀態
    private _Moveable: boolean;//物件目前是否為可移動狀態
    constructor(Id: string) {
        this.Id = Id;
        this.CreateElement();

        var THIS = this;
        this.Timer = setInterval(function () {
            if (!Extension.IsWatchPage()) return;//不是播放頁則不建立迷你播放器
            if (!THIS.HasElement) {//檢查DOM目前確實有播放器顯示元件，如果沒有則重建
                THIS.CreateElement();
            }
            THIS.Update();
        }, 60);


        document.addEventListener("mousemove", (e) => {
            if (!THIS._Moveable) return;
            THIS.MiniPlayer.style.right = parseInt(window.getComputedStyle(THIS.MiniPlayer).right) - e.movementX + "px";
            THIS.MiniPlayer.style.bottom = parseInt(window.getComputedStyle(THIS.MiniPlayer).bottom) - e.movementY + "px";
        });
        document.addEventListener("mouseup", (e) => {
            THIS._Moveable = false;
            document.body.onselectstart = null;//重新允許選取文字
        });
        window.onscroll = function () {
            if (window.scrollY < (parseInt(THIS.YoutubePlayer.style.height) + 10) / 2) {
                THIS.Visable = false;
                return;
            }
            THIS.Visable = true;
        }        
    }

    private CreateElement() {
        var MiniPlayer : HTMLElement = <HTMLElement>this.GetMiniPlayerNode("templets/MiniPlayer.html");
        MiniPlayer.setAttribute("id", this.Id);
        //#region 初始化位置
        var YoutubeContent = document.getElementById('content');

        MiniPlayer.style.right = (window.innerWidth - YoutubeContent.offsetWidth) / 2 + "px";
        //#endregion

        document.getElementById('watch7-main').appendChild(MiniPlayer);

        this.Scaling();//顯示比例調整
        this.AddMoveEvent();
        this.AddControllerEvent();
    }
    
    public Update() {
        var Context: CanvasRenderingContext2D = this.Canvas.getContext('2d');
        Context.drawImage(<HTMLImageElement>this.YoutubePlayer, 0, 0, this.Canvas.width, this.Canvas.height);

        this.Controller.style.background = "url('" + chrome.extension.getURL('images/controller/' + (!this.YoutubePlayer.paused ? "pause" : "play") + '.png') + "')";

        if (document.getElementById("caption-window-0") != null) {
            (<HTMLElement>document.querySelector(".Subtitle span")).innerText = document.getElementById("caption-window-0").innerText;
        } else {
            (<HTMLElement>document.querySelector(".Subtitle span")).innerText = "";
        }
    }

    public Scaling() {
        var VideoScale = parseInt(this.YoutubePlayer.style.width) / parseInt(this.YoutubePlayer.style.height);
        this.Canvas.width = this.Canvas.height * VideoScale;
    }

    public get MiniPlayer(): HTMLElement {
        return document.getElementById(this.Id);
    }

    public get YoutubePlayer(): HTMLVideoElement {
        return <HTMLVideoElement>document.getElementsByClassName('html5-main-video')[0];
    }

    public get HasElement(): boolean {
        return this.MiniPlayer != null;
    }

    public get Canvas(): HTMLCanvasElement {
        return <HTMLCanvasElement>document.querySelector("#" + this.Id + " > .PlayerCanvas");;
    }

    public get Controller(): HTMLDivElement {
        return <HTMLDivElement>document.querySelector("#" + this.Id + " > .Controller");;
    }

    public get Visable(): boolean {
        return this._Visable;
    }

    public set Visable(value: boolean) {
        if (value) {
            this.MiniPlayer.style.display = null;
        } else {
            this.MiniPlayer.style.display = "none";
        }
        this._Visable = value;
    }

    private AddMoveEvent() {//加入事件
        var THIS = this;
        this.MiniPlayer.addEventListener("mousedown", (e) => {
            THIS._Moveable = true;
            document.body.onselectstart = function () { return false; };//防止移動時選取到文字區域
        });
        this.MiniPlayer.addEventListener("mouseup", (e) => {
            THIS._Moveable = false;
            document.body.onselectstart = null;//重新允許選取文字
        });
    }

    private AddControllerEvent() {
        var THIS = this;
        this.Controller.onclick = (e) => {
            if (THIS.YoutubePlayer.paused) {
                THIS.YoutubePlayer.play();
            } else {
                THIS.YoutubePlayer.pause();
            }
        }
    }

    private GetMiniPlayerNode(Path: string) : Node {
        var Request = new XMLHttpRequest();
        Request.open("Get", chrome.extension.getURL("templets/MiniPlayer.html"), false);
        Request.send();

        return Extension.ConvertStringToNode(Request.responseText);
    }
}
var MiniPlayerEntity = new MiniPlayer("MiniPlayerEntity");