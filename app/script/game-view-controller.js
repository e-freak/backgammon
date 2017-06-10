"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameViewController = (function () {
    function GameViewController(view) {
        _classCallCheck(this, GameViewController);

        this._view = view;
        this._count = 0;
    }

    _createClass(GameViewController, [{
        key: "initialize",
        value: function initialize() {
            this._shakeDice();
        }
    }, {
        key: "_shakeDice",
        value: function _shakeDice() {
            if (this._count > 20) {
                this.count = 0;
                return 0;
            }
            var dicePip = Math.floor(Math.random() * 6) + 1; // 1から6までの適当な数字
            var diceImage = dicePip + ".png"; // 画像ファイル名生成
            this._view.getElementById('dice').innerHTML = "<img src='../image/dice" + diceImage + "' width='64' height='64'>";
            this._count++;
            setTimeout(this._shakeDice.bind(this), 50); // 50ミリ秒間隔で表示切り替え
        }
    }]);

    return GameViewController;
})();

exports["default"] = GameViewController;
module.exports = exports["default"];