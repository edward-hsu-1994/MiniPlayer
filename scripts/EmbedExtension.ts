/// <reference path="youtubeextension.ts" />
/// <reference path="miniplayerlib.ts" />

function IsYoutubePage() {
    try {
        if (MiniPlayerEntity) return true;
        else return false;
    }catch (e) {
        return false;
    }
}

function CreateYoutubePlayer(iframe: HTMLIFrameElement) {
    try {
        if (iframe.getAttribute("ymp") != null) return null;//已經實作MiniPlayer

        var playerElement = iframe.contentWindow.document.querySelector(".html5-main-video");
        if (playerElement) {//有Youtube Player
            iframe.setAttribute("ymp", p.toString());//Lock

            var mp: MiniPlayer = new MiniPlayer(<HTMLVideoElement>playerElement, "body");
            mp.Visable = false;
            mp.OnPlay = function () {
                this.Visable = true;
                ScrollEvent();
            }
            mp.OnPause = mp.OnEnded = function () {
                this.Visable = false;
            };
            player.push(mp);

            p++;
            return mp;
        }

        var subiframes = iframe.contentWindow.document.getElementsByTagName("iframe");

        if (subiframes.length > 0) {//向底層搜尋
            for (var index in subiframes) {
                var DeepResult = CreateYoutubePlayer(subiframes[index]);
                if (DeepResult) return DeepResult;
            }
        }
        return null;
    } catch (e) {
        return null;
    }
}

function getElementPosition(target) {
    var ele: HTMLElement = <HTMLElement>target;
    var backup = ele;
    var top = 0;
    var left = 0;

    try {
        while (ele.offsetParent || (<any>ele).frameElement || ele.parentNode.ownerDocument.defaultView.frameElement) {
            top += ele.offsetTop;
            left += ele.offsetLeft;
            ele = <HTMLElement>(ele.offsetParent || (<any>ele).frameElement || ele.parentNode.ownerDocument.defaultView.frameElement);
            if (!ele.tagName) ele.tagName = "WINDOW";
        }
    } catch (e) { }

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
        if (item == 0) console.log(item);
        var ITEM = iframe[item];
        if (
            player[item].IsPlaying && (
                position.top < 0 - ITEM.clientHeight / 2 ||
                position.top > window.innerHeight - ITEM.clientHeight / 2)
            ) {
            player[item].Visable = true;
        } else {
            player[item].Visable = false;
        }

        console.log(position);
    }
}



var p = 0;
var a = 0;
var player = new Array<MiniPlayer>();
var iframe = new Array<HTMLIFrameElement>();
if (!IsYoutubePage() ) {
    a = setInterval(function () {
        if (IsYoutubePage()) {
            clearInterval(a);
            return;
        }
        var embeds = document.getElementsByTagName("iframe");
        for (var i = 0; i < embeds.length; i++) {
            if (CreateYoutubePlayer(embeds[i])) {
                iframe.push(embeds[i]);
            };
        }
    }, 1000);

    
    window.addEventListener("scroll", ScrollEvent);
}
