"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require("babel-polyfill");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DiceController = function () {
  function DiceController(myFirstDiceButton, mySecoundDiceButton, opponentFirstDiceButton, opponentSecoundDiceButton, diceBorderElements, notificationFirstShakeDice, notificationShakeDice, notificationChangeTurn, sound) {
    _classCallCheck(this, DiceController);

    this._imageMyDiceResource = []; // 自分のサイコロの画像(indexはサイコロの目と対応, index=0は使用しない)
    this._imageOpponentDiceResource = []; // 相手のサイコロの画像(indexはサイコロの目と対応, index=0は使用しない)

    this._myFirstDiceButton = myFirstDiceButton;
    this._mySecoundDiceButton = mySecoundDiceButton;
    this._opponentFirstDiceButton = opponentFirstDiceButton;
    this._opponentSecoundDiceButton = opponentSecoundDiceButton;

    this._diceBorderElements = diceBorderElements;

    // サイコロを振り終わった後に呼ばれるメソッド
    this._notificationFirstShakeDice = notificationFirstShakeDice;
    this._notificationShakeDice = notificationShakeDice;

    this._notificationChangeTurn = notificationChangeTurn;

    this._dicePips = []; // ボード上に出ているサイコロの目の配列

    this.isAllowTurnChange = false;

    this._sound = sound;
    this._sound.volume = 1;
  }

  _createClass(DiceController, [{
    key: "initialize",
    value: function initialize() {
      this._loadImages(); // 画像をロードしておく

      this._myFirstDiceButton.style.display = "none"; // 非表示;
      this._mySecoundDiceButton.style.display = "none"; // 非表示;
      this._opponentFirstDiceButton.style.display = "none"; // 非表示;
      this._opponentSecoundDiceButton.style.display = "none"; // 非表示;

      this._myFirstDiceButton.addEventListener('click', this._onClickDiceButton.bind(this));
      this._mySecoundDiceButton.addEventListener('click', this._onClickDiceButton.bind(this));
      this._opponentFirstDiceButton.addEventListener('click', this._onClickDiceButton.bind(this));
      this._opponentSecoundDiceButton.addEventListener('click', this._onClickDiceButton.bind(this));

      // サイコロの枠を非表示にする
      this.clearDiceBorder();
    }

    // ゲーム開始時にサイコロを振る
    // 対戦相手と通信するため、出る目はGame controllerで設定する

  }, {
    key: "firstShakeDice",
    value: function firstShakeDice(myPip, opponentPip) {
      this._myFirstDiceButton.style.display = "block"; // 表示;
      this._mySecoundDiceButton.style.display = "none"; // 非表示;
      this._opponentFirstDiceButton.style.display = "block"; // 表示;
      this._opponentSecoundDiceButton.style.display = "none"; // 非表示;

      this._myFirstDiceButton.firstChild.style.opacity = "1.0";
      this._mySecoundDiceButton.firstChild.style.opacity = "0.0";
      this._opponentFirstDiceButton.firstChild.style.opacity = "1.0";
      this._opponentSecoundDiceButton.firstChild.style.opacity = "0.0";

      this._dicePips.push(myPip);
      this._dicePips.push(opponentPip);
      // 降っている風に見せる
      this._firstShakeAnimation(myPip, opponentPip);
    }
  }, {
    key: "shakeMyDice",
    value: function shakeMyDice(pip1, pip2) {
      this._myFirstDiceButton.style.display = "block"; // 非表示;
      this._mySecoundDiceButton.style.display = "block"; // 非表示;
      this._opponentFirstDiceButton.style.display = "none"; // 表示;
      this._opponentSecoundDiceButton.style.display = "none"; // 表示;

      this._myFirstDiceButton.firstChild.style.opacity = "1.0";
      this._mySecoundDiceButton.firstChild.style.opacity = "1.0";
      this._opponentFirstDiceButton.firstChild.style.opacity = "0.0";
      this._opponentSecoundDiceButton.firstChild.style.opacity = "0.0";

      this._dicePips.push(pip1);
      this._dicePips.push(pip2);
      // 振っている風に見せる
      this._shakeMyDiceAnimation(pip1, pip2);
    }
  }, {
    key: "shakeOpponentDice",
    value: function shakeOpponentDice(pip1, pip2) {

      this._myFirstDiceButton.style.display = "none"; // 非表示;
      this._mySecoundDiceButton.style.display = "none"; // 非表示;
      this._opponentFirstDiceButton.style.display = "block"; // 表示;
      this._opponentSecoundDiceButton.style.display = "block"; // 表示;

      this._myFirstDiceButton.firstChild.style.opacity = "0.0";
      this._mySecoundDiceButton.firstChild.style.opacity = "0.0";
      this._opponentFirstDiceButton.firstChild.style.opacity = "1.0";
      this._opponentSecoundDiceButton.firstChild.style.opacity = "1.0";

      this._dicePips.push(pip1);
      this._dicePips.push(pip2);
      // 振っている風に見せる
      this._shakeOpponentDiceAnimation(pip1, pip2);
    }
  }, {
    key: "clear",
    value: function clear() {
      this._dicePips = [];

      this._myFirstDiceButton.style.display = "none"; // 非表示;
      this._mySecoundDiceButton.style.display = "none"; // 非表示;
      this._opponentFirstDiceButton.style.display = "none"; // 非表示;
      this._opponentSecoundDiceButton.style.display = "none"; // 非表示;

      // 位置を移動しているので、その情報をクリア
      this._opponentFirstDiceButton.style.left = "";
      this._myFirstDiceButton.style.left = "";

      this.isAllowTurnChange = false;

      // サイコロの枠を非表示にする
      this.clearDiceBorder();
    }
  }, {
    key: "movedPiece",
    value: function movedPiece(point) {
      // サイコロかボード状に必ず2つ出ている
      // つまりthis._dicePipsの要素数は必ず2つ
      var addOpacity = -0.6;
      if (this._dicePips[0] === this._dicePips[1]) {
        // ゾロ目の場合、透過度の変更は0.5単位
        addOpacity = -0.3;
      }

      var limit = 0.4; // 透過度を変化させる下限(undoの場合は上限)を表す

      // pointがマイナスの場合はundoしたときなので、透過度をプラスする
      if (point <= 0) {
        addOpacity *= -1;
        limit = 1.0;
        point *= -1; // pointはサイコロの目と比較するため自然数にしておく
      }

      var displayDiceButtons = this._getDisplayDiceButtons();

      // もし出た目の位置に駒が無くて、さらにそのうしろにも駒が無い場合には、一番後ろにある駒を上げることが出来る
      // 上記の場合、pointはサイコロの目以外の数値以外になる
      var dicePips = [];
      for (var i = 0; i < displayDiceButtons.length; i++) {
        dicePips.push(this._getDicePipFromButton(displayDiceButtons[i]));
      }
      var index = dicePips.indexOf(point);

      for (var _i = 0; _i < displayDiceButtons.length; _i++) {
        var opacity = parseFloat(displayDiceButtons[_i].firstChild.style.opacity);
        if (this._getDicePipFromButton(displayDiceButtons[_i]) === point && opacity !== limit || index === -1 && opacity !== limit) {
          opacity += addOpacity;
          displayDiceButtons[_i].firstChild.style.opacity = opacity + ''; // toString()より速いよう
          break;
        }
      }
    }

    // ボタンからサイコロの目を取得

  }, {
    key: "_getDicePipFromButton",
    value: function _getDicePipFromButton(button) {
      for (var i = 1; i <= 6; i++) {
        if (button.firstChild.src === this._imageMyDiceResource[i].src || button.firstChild.src === this._imageOpponentDiceResource[i].src) {
          return i;
        }
      }
      return 0;
    }

    // 表示中のサイコロのボタンを返す

  }, {
    key: "_getDisplayDiceButtons",
    value: function _getDisplayDiceButtons() {
      var buttons = [];
      if (this._myFirstDiceButton.style.display !== "none") {
        buttons.push(this._myFirstDiceButton);
      }
      if (this._mySecoundDiceButton.style.display !== "none") {
        buttons.push(this._mySecoundDiceButton);
      }
      if (this._opponentFirstDiceButton.style.display !== "none") {
        buttons.push(this._opponentFirstDiceButton);
      }
      if (this._opponentSecoundDiceButton.style.display !== "none") {
        buttons.push(this._opponentSecoundDiceButton);
      }
      return buttons;
    }
  }, {
    key: "_firstShakeAnimation",
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(myPip, opponentPip) {
        var i, num1, num2;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // 効果音再生
                this._sound.play();
                i = 0;

              case 2:
                if (!(i < 20)) {
                  _context.next = 12;
                  break;
                }

                num1 = Math.ceil(Math.random() * 6);
                num2 = Math.ceil(Math.random() * 6);


                this._myFirstDiceButton.firstChild.src = this._imageMyDiceResource[num1].src;
                this._opponentFirstDiceButton.firstChild.src = this._imageOpponentDiceResource[num2].src;

                // 少し待つ
                _context.next = 9;
                return this._sleep(50);

              case 9:
                i++;
                _context.next = 2;
                break;

              case 12:
                // 効果音ストップ
                this._sound.pause();
                this._sound.currentTime = 0;

                this._myFirstDiceButton.firstChild.src = this._imageMyDiceResource[myPip].src;
                this._opponentFirstDiceButton.firstChild.src = this._imageOpponentDiceResource[opponentPip].src;

                if (myPip > opponentPip) {
                  this._opponentFirstDiceButton.style.left = "430px";
                } else {
                  this._myFirstDiceButton.style.left = "153px";
                }
                // game controller に通知
                this._notificationFirstShakeDice(myPip, opponentPip);

              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _firstShakeAnimation(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return _firstShakeAnimation;
    }()
  }, {
    key: "_shakeMyDiceAnimation",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(pip1, pip2) {
        var i, num1, num2;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                // 効果音再生
                this._sound.play();
                i = 0;

              case 2:
                if (!(i < 20)) {
                  _context2.next = 12;
                  break;
                }

                num1 = Math.ceil(Math.random() * 6);
                num2 = Math.ceil(Math.random() * 6);


                this._myFirstDiceButton.firstChild.src = this._imageMyDiceResource[num1].src;
                this._mySecoundDiceButton.firstChild.src = this._imageMyDiceResource[num2].src;

                // 少し待つ
                _context2.next = 9;
                return this._sleep(50);

              case 9:
                i++;
                _context2.next = 2;
                break;

              case 12:
                // 効果音ストップ
                this._sound.pause();
                this._sound.currentTime = 0;

                this._myFirstDiceButton.firstChild.src = this._imageMyDiceResource[pip1].src;
                this._mySecoundDiceButton.firstChild.src = this._imageMyDiceResource[pip2].src;

              case 16:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _shakeMyDiceAnimation(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return _shakeMyDiceAnimation;
    }()
  }, {
    key: "_shakeOpponentDiceAnimation",
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(pip1, pip2) {
        var i, num1, num2;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                // 効果音再生
                this._sound.play();

                i = 0;

              case 2:
                if (!(i < 20)) {
                  _context3.next = 12;
                  break;
                }

                num1 = Math.ceil(Math.random() * 6);
                num2 = Math.ceil(Math.random() * 6);


                this._opponentFirstDiceButton.firstChild.src = this._imageOpponentDiceResource[num1].src;
                this._opponentSecoundDiceButton.firstChild.src = this._imageOpponentDiceResource[num2].src;

                // 少し待つ
                _context3.next = 9;
                return this._sleep(50);

              case 9:
                i++;
                _context3.next = 2;
                break;

              case 12:

                // 効果音ストップ
                this._sound.pause();
                this._sound.currentTime = 0;

                this._opponentFirstDiceButton.firstChild.src = this._imageOpponentDiceResource[pip1].src;
                this._opponentSecoundDiceButton.firstChild.src = this._imageOpponentDiceResource[pip2].src;

              case 16:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function _shakeOpponentDiceAnimation(_x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return _shakeOpponentDiceAnimation;
    }()
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
  }, {
    key: "allowTurnChange",
    value: function allowTurnChange() {
      this.isAllowTurnChange = true;
    }
  }, {
    key: "_onClickDiceButton",
    value: function _onClickDiceButton() {
      // 表示中のサイコロの透過度が全て"0.0"の場合、ターン交代
      // 自分のターン or 対戦相手のターンかの判断はGameViewControllerに任せる
      var displayDiceButtons = this._getDisplayDiceButtons();
      var flag = true;
      displayDiceButtons.forEach(function (value) {
        if (value.firstChild.style.opacity !== "0.4") {
          flag = false;
        }
      });

      if (flag || this.isAllowTurnChange) {
        this._notificationChangeTurn();
      }
    }
  }, {
    key: "displayDiceBorder",
    value: function displayDiceBorder() {
      // サイコロの枠を表示する
      for (var index = 0; index < this._diceBorderElements.length; index++) {
        this._diceBorderElements[index].style.display = "block";
      }
    }
  }, {
    key: "clearDiceBorder",
    value: function clearDiceBorder() {
      // サイコロの枠を非表示にする
      for (var index = 0; index < this._diceBorderElements.length; index++) {
        this._diceBorderElements[index].style.display = "none";
      }
    }
  }, {
    key: "_sleep",
    value: function _sleep(ms) {
      return new Promise(function (resolve) {
        return setTimeout(resolve, ms);
      });
    }
  }]);

  return DiceController;
}();

exports.default = DiceController;