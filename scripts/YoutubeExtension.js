/// <reference path="miniplayerlib.ts" />
var MiniPlayerEntity = new MiniPlayer(".html5-main-video:first-child", "#watch7-main");
MiniPlayerEntity.OnSroll = function (e) {
    if (!Extension.IsWatchPage() || !this.HasElement)
        return;
    if (window.scrollY < (parseInt(this.YoutubePlayer.style.height) + 10) / 2) {
        this.Visable = false;
        return;
    }
    this.Visable = true;
};
MiniPlayerEntity.Visable = false;
//# sourceMappingURL=youtubeextension.js.map