console.clear();
var Extension = (function () {
    function Extension() {
    }
    Extension.ConvertStringToNode = function (HTML) {
        return Extension.ConvertStringToNodes(HTML)[0];
    };
    Extension.ConvertStringToNodes = function (HTML) {
        var temp = document.createElement('div');
        temp.innerHTML = HTML;
        var result = new Array();
        for (var i = 0; i < temp.childNodes.length; i++) {
            result.push(temp.childNodes.item(i));
        }
        return result;
    };
    Extension.IsWatchPage = function () {
        return location.pathname.toLowerCase() == "/watch";
    };
    Extension.CreateGUID = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
    return Extension;
})();
var MiniPlayer = (function () {
    function MiniPlayer(YoutubePlayerElement, ParentQuerySelector) {
        this.Id = "MiniPlayer_" + Extension.CreateGUID();
        this.YoutubePlayerElement = YoutubePlayerElement;
        this.ParentQuerySelector = ParentQuerySelector;
        var THIS = this;
        this.Timer = setInterval(function () {
            //if (!Extension.IsWatchPage()) return;//不是播放頁則不建立迷你播放器
            if (!THIS.HasElement) {
                THIS.CreateElement();
            }
            THIS.Update();
        }, 70);
        document.addEventListener("mousemove", function (e) {
            if (!THIS._Moveable)
                return;
            THIS.MiniPlayer.style.right = parseInt(window.getComputedStyle(THIS.MiniPlayer).right) - e.movementX + "px";
            THIS.MiniPlayer.style.bottom = parseInt(window.getComputedStyle(THIS.MiniPlayer).bottom) - e.movementY + "px";
        });
        document.addEventListener("mouseup", function (e) {
            THIS._Moveable = false;
            document.body.onselectstart = null; //重新允許選取文字
        });
        window.addEventListener("scroll", function (e) {
            if (THIS.OnSroll)
                THIS.OnSroll.call(THIS, e);
        });
        this.CreateElement();
    }
    MiniPlayer.prototype.CreateElement = function () {
        var THIS = this;
        this.YoutubePlayer.addEventListener("playing", function (e) {
            THIS.Scaling();
            if (THIS.OnPlay)
                THIS.OnPlay.call(THIS, e);
        });
        this.YoutubePlayer.addEventListener("pause", function (e) {
            if (THIS.OnPause)
                THIS.OnPause.call(THIS, e);
        });
        this.YoutubePlayer.addEventListener("ended", function (e) {
            if (THIS.OnEnded)
                THIS.OnEnded.call(THIS, e);
        });
        var MiniPlayer = this.GetMiniPlayerNode("templets/MiniPlayer.html");
        MiniPlayer.setAttribute("id", this.Id);
        //#region 初始化位置
        var YoutubeContent = document.getElementById('content');
        if (YoutubeContent == null)
            YoutubeContent = { offsetWidth: window.innerWidth - 80 };
        MiniPlayer.style.right = (window.innerWidth - YoutubeContent.offsetWidth) / 2 + "px";
        //#endregion
        try {
            if (this.ParentQuerySelector)
                document.querySelector(this.ParentQuerySelector).appendChild(MiniPlayer);
        }
        catch (e) { }
        if (this.HasElement) {
            this.Scaling(); //顯示比例調整
            this.AddMoveEvent();
            this.AddControllerEvent();
            if (this.OnSroll)
                this.OnSroll(null);
            this.MiniPlayer.addEventListener("click", function (e) {
                if (THIS.OnClick)
                    THIS.OnClick.call(THIS, e);
            });
            this.Visable = this._Visable; //reset;
        }
    };
    MiniPlayer.prototype.Update = function () {
        try {
            if (!this.HasElement)
                return;
            var Context = this.Canvas.getContext('2d');
            Context.drawImage(this.YoutubePlayer, 0, 0, this.Canvas.width, this.Canvas.height);
            this.Controller.style.background = "url('" + chrome.extension.getURL('images/controller/' + (!this.YoutubePlayer.paused ? "pause" : "play") + '.png') + "')";
            if (document.getElementById("caption-window-0") != null) {
                document.querySelector("#" + this.Id + " .Subtitle span").innerText = document.getElementById("caption-window-0").innerText;
            }
            else {
                document.querySelector("#" + this.Id + " .Subtitle span").innerText = "";
            }
        }
        catch (e) {
        }
    };
    MiniPlayer.prototype.Scaling = function () {
        var VideoScale = parseInt(this.YoutubePlayer.style.width) / parseInt(this.YoutubePlayer.style.height);
        this.Canvas.width = this.Canvas.height * VideoScale;
    };
    Object.defineProperty(MiniPlayer.prototype, "MiniPlayer", {
        get: function () {
            return document.getElementById(this.Id);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MiniPlayer.prototype, "YoutubePlayer", {
        get: function () {
            return this.YoutubePlayerElement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MiniPlayer.prototype, "IsPlaying", {
        get: function () {
            return !this.YoutubePlayer.paused;
        },
        set: function (value) {
            if (value) {
                this.YoutubePlayer.play();
            }
            else {
                this.YoutubePlayer.pause();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MiniPlayer.prototype, "HasElement", {
        get: function () {
            return this.MiniPlayer != null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MiniPlayer.prototype, "Canvas", {
        get: function () {
            return document.querySelector("#" + this.Id + " > .PlayerCanvas");
            ;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MiniPlayer.prototype, "Controller", {
        get: function () {
            return document.querySelector("#" + this.Id + " > .Controller");
            ;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MiniPlayer.prototype, "Visable", {
        get: function () {
            return this._Visable;
        },
        set: function (value) {
            if (value) {
                this.MiniPlayer.style.display = null;
            }
            else {
                this.MiniPlayer.style.display = "none";
            }
            this._Visable = value;
        },
        enumerable: true,
        configurable: true
    });
    MiniPlayer.prototype.AddMoveEvent = function () {
        var THIS = this;
        this.MiniPlayer.addEventListener("mousedown", function (e) {
            THIS._Moveable = true;
            document.body.onselectstart = function () { return false; }; //防止移動時選取到文字區域
        });
        this.MiniPlayer.addEventListener("mouseup", function (e) {
            THIS._Moveable = false;
            document.body.onselectstart = null; //重新允許選取文字
        });
    };
    MiniPlayer.prototype.AddControllerEvent = function () {
        var THIS = this;
        this.Controller.onclick = function (e) {
            THIS.IsPlaying = !THIS.IsPlaying;
        };
    };
    MiniPlayer.prototype.GetMiniPlayerNode = function (Path) {
        var Request = new XMLHttpRequest();
        Request.open("Get", chrome.extension.getURL("templets/MiniPlayer.html"), false);
        Request.send();
        return Extension.ConvertStringToNode(Request.responseText);
    };
    return MiniPlayer;
})();
//# sourceMappingURL=miniplayerlib.js.map