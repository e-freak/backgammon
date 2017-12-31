"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DiceController = (function () {
  function DiceController(myFirstDiceImage, mySecoundDiceImage, opponentFirstDiceImage, opponentSecoundDiceImage, notificationFirstShakeDice, notificationShakeDice) {
    _classCallCheck(this, DiceController);

    this._imageMyDiceResource = []; // 自分のサイコロの画像(indexはサイコロの目と対応, index=0は使用しない)
    this._imageOpponentDiceResource = []; // 相手のサイコロの画像(indexはサイコロの目と対応, index=0は使用しない)

    this._myFirstDiceImage = myFirstDiceImage;
    this._mySecoundDiceImage = mySecoundDiceImage;
    this._opponentFirstDiceImage = opponentFirstDiceImage;
    this._opponentSecoundDiceImage = opponentSecoundDiceImage;

    // サイコロを振り終わった後に呼ばれるメソッド
    this._notificationFirstShakeDice = notificationFirstShakeDice;
    this._notificationShakeDice = notificationShakeDice;

    this._timeCount = 0;
  }

  _createClass(DiceController, [{
    key: "initialize",
    value: function initialize() {
      this._loadImages(); // 画像をロードしておく

      this._myFirstDiceImage.style.display = "none"; // 非表示;
      this._mySecoundDiceImage.style.display = "none"; // 非表示;
      this._opponentFirstDiceImage.style.display = "none"; // 非表示;
      this._opponentSecoundDiceImage.style.display = "none"; // 非表示;
    }

    // ゲーム開始時にサイコロを振る
    // 対戦相手と通信するため、出る目はGame controllerで設定する
  }, {
    key: "firstShakeDice",
    value: function firstShakeDice(myPip, opponentPip) {
      this._myFirstDiceImage.style.display = "block"; // 表示;
      this._mySecoundDiceImage.style.display = "none"; // 非表示;
      this._opponentFirstDiceImage.style.display = "block"; // 表示;
      this._opponentSecoundDiceImage.style.display = "none"; // 非表示;

      this._myFirstDiceImage.style.opacity = "1.0";
      this._mySecoundDiceImage.style.opacity = "0.0";
      this._opponentFirstDiceImage.style.opacity = "1.0";
      this._opponentSecoundDiceImage.style.opacity = "0.0";

      // 降っている風に見せる
      this._firstShakeAnimation(myPip, opponentPip);
    }
  }, {
    key: "_firstShakeAnimation",
    value: function _firstShakeAnimation(myPip, opponentPip) {
      if (this._timeCount > 20) {
        this._timeCount = 0;

        this._myFirstDiceImage.src = this._imageMyDiceResource[myPip].src;
        this._opponentFirstDiceImage.src = this._imageOpponentDiceResource[opponentPip].src;

        if (myPip > opponentPip) {
          this._opponentFirstDiceImage.style.left = "430px";
        } else {
          this._myFirstDiceImage.style.left = "153px";
        }
        // game controller に通知
        this._notificationFirstShakeDice(myPip, opponentPip);
        return 0;
      }
      var num1 = Math.ceil(Math.random() * 6);
      var num2 = Math.ceil(Math.random() * 6);
      this._myFirstDiceImage.src = this._imageMyDiceResource[num1].src;
      this._opponentFirstDiceImage.src = this._imageOpponentDiceResource[num2].src;

      this._timeCount++;
      setTimeout(this._firstShakeAnimation.bind(this, myPip, opponentPip), 50); // 50ミリ秒間隔で表示切り替え
    }
  }, {
    key: "_loadImages",
    value: function _loadImages() {
      // サイコロの画像
      for (var i = 1; i <= 6; i++) {
        // ArrayのIndex=サイコロの目(0は使用しない)
        this._imageMyDiceResource[i] = new Image();
        this._imageMyDiceResource[i].src = "../image/myDice/dice" + i + ".png";
        this._imageOpponentDiceResource[i] = new Image();
        this._imageOpponentDiceResource[i].src = "../image/opponentDice/dice" + i + ".png";
      }
    }
  }]);

  return DiceController;
})();

exports["default"] = DiceController;
module.exports = exports["default"];