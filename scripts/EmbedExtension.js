/// <reference path="youtubeextension.ts" />
function IsYoutubePage() {
    try {
        if (MiniPlayerEntity)
            return true;
        else
            return false;
    }
    catch (e) {
        return false;
    }
}
function getElementPosition(target) {
    var ele = target;
    var backup = ele;
    var top = 0;
    var left = 0;
    try {
        while (ele.offsetParent || ele.frameElement || ele.parentNode.ownerDocument.defaultView.frameElement) {
            top += ele.offsetTop;
            left += ele.offsetLeft;
            ele = (ele.offsetParent || ele.frameElement || ele.parentNode.ownerDocument.defaultView.frameElement);
            if (!ele.tagName)
                ele.tagName = "WINDOW";
        }
    }
    catch (e) { }
    return {
        top: top - window.scrollY,
        left: left - window.scrollX,
        bottom: window.innerHeight - (top + backup.clientHeight) + window.scrollY,
        right: window.innerWidth - (left + backup.clientWidth) + window.scrollX
    };
}
function ScrollEvent() {
    for (var item in iframe) {
        var position = getElementPosition(iframe[item]);
        var ITEM = iframe[item];
        if (player[item].IsPlaying && (position.top < 0 - ITEM.clientHeight / 2 ||
            position.top > window.innerHeight - ITEM.clientHeight / 2)) {
            player[item].Visable = true;
        }
        else {
            player[item].Visable = false;
        }
        console.log(position);
    }
}
var p = 0;
var a = 0;
var player = new Array();
var iframe = new Array();
if (!IsYoutubePage()) {
    a = setInterval(function () {
        function RGetYoutubePlayer(iframe) {
            if (iframe.getAttribute("ymp") != null)
                return null; //已經實作MiniPlayer
            if (element.contentWindow.document.querySelector(".html5-main-video")) {
                element.setAttribute("ymp", p.toString()); //Lock
            }
        }
        var embeds = document.getElementsByTagName("iframe");
        for (var i = 0; i < embeds.length; i++) {
            var element = embeds[i];
            if (element.src.indexOf("www.youtube.com") == -1 ||
                element.getAttribute("ymp") != null ||
                !element.contentWindow.document.querySelector(".html5-main-video")) {
                continue;
            }
            element.setAttribute("ymp", p.toString());
            var temp = new MiniPlayer('[ymp="' + p.toString() + '"]', "body");
            temp.Visable = false;
            temp.OnPlay = function () {
                ScrollEvent();
                //this.Visable = true;
            };
            temp.OnPause = temp.OnEnded = function () {
                this.Visable = false;
            };
            player.push(temp);
            iframe.push(element);
            //new MiniPlayer('[youtubeMiniPlayerId="' + i.toString() + '"]', "body");
            p++;
        }
    }, 1000);
    window.addEventListener("scroll", ScrollEvent);
}
//# sourceMappingURL=EmbedExtension.js.map