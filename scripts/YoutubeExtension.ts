/// <reference path="miniplayerlib.ts" />
var MiniPlayerEntity: MiniPlayer = null;
var click = setInterval(function () {
    var YoutubeVideo: HTMLVideoElement = <HTMLVideoElement>document.querySelector(".html5-main-video:first-child");

    if (!YoutubeVideo) {
        MiniPlayerEntity = null;//頁面中沒播放器Video Element，
        return;
    }
    if (MiniPlayerEntity) return;  //已經有實體

    MiniPlayerEntity = new MiniPlayer(YoutubeVideo, "#watch7-main");

    MiniPlayerEntity.OnSroll = function (e) {
        if (!Extension.IsWatchPage() || !this.HasElement) return;
        if (window.scrollY < (parseInt(this.YoutubePlayer.style.height) + 10) / 2) {
            this.Visable = false;
            return;
        }
        this.Visable = true;
    }
    MiniPlayerEntity.Visable = false;
}, 100);

