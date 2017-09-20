'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _scriptPiece = require('../script/Piece');

var _scriptPiece2 = _interopRequireDefault(_scriptPiece);

var _scriptInformationViewController = require('../script/information-view-controller');

var _scriptInformationViewController2 = _interopRequireDefault(_scriptInformationViewController);

var GameViewController = (function () {
  function GameViewController(view) {
    _classCallCheck(this, GameViewController);

    this._view = view;
    this._imageMyDiceResource = [];
    this._imageOpponentDiceResource = [];
    this._myPieces = [];
    this._opponentPieces = [];
    this._count = 0;
    this._myDicePip = 1;
    this._opponentDicePip = 1;
    this._dicePip = [];
    this._informationViewController;
  }

  // とりあえずの実装。設計は後から考える

  _createClass(GameViewController, [{
    key: 'initialize',
    value: function initialize() {
      this._loadImages(); // 画像をロードしておく
      this._updateToStartUI(); // ゲーム開始画面のUIに更新する(コマを配る, サイコロの表示/非表示の設定とか)
      this._shakeDice(true); // サイコロ画像を切り替えて振ってる風に見せる

      this._informationViewController = new _scriptInformationViewController2['default'](this._view);
      this._informationViewController.initialize();
    }
  }, {
    key: '_loadImages',
    value: function _loadImages() {
      // サイコロの画像
      for (var i = 1; i <= 6; i++) {
        // ArrayのIndex=サイコロの目(0は使用しない)
        this._imageMyDiceResource[i] = new Image();
        this._imageMyDiceResource[i].src = "../image/dice/dice" + i + ".png";
        this._imageOpponentDiceResource[i] = new Image();
        this._imageOpponentDiceResource[i].src = "../image/dice/dice" + i + ".png";
      }
    }
  }, {
    key: '_updateToStartUI',
    value: function _updateToStartUI() {
      // コマを配りたい
      this._appendPiece();

      // ゲーム開始時は、サイコロは2つだけ表示する
      // (自分のサイコロ/対戦相手のサイコロを1つずつ表示)
      this._view.getElementById('my-firstDice-image').style.display = "block"; // 表示
      this._view.getElementById('my-secoundDice-image').style.display = "none"; // 非表示
      this._view.getElementById('opponent-firstDice-image').style.display = "block"; // 表示
      this._view.getElementById('opponent-secoundDice-image').style.display = "none"; // 非表示
    }
  }, {
    key: '_appendPiece',
    value: function _appendPiece() {
      // 自分のコマの位置
      var point = [24, 24, 13, 13, 13, 13, 13, 8, 8, 8, 6, 6, 6, 6, 6];
      for (var i = 0; i <= 14; i++) {
        var position = this._getPiecePosition(point[i], this._myPieces);
        var piece = new _scriptPiece2['default'](position[0], position[1], point[i], true);
        piece.initialize();
        var btn = piece.createPieceElement();

        btn.onclick = this._preMovePiece.bind(this, piece);
        var tmp = this._view.getElementById("board-area");
        this._view.getElementById("board-area").appendChild(btn);

        this._myPieces.push(piece);
      }

      // 対戦相手のコマの位置
      var point = [19, 19, 19, 19, 19, 17, 17, 17, 12, 12, 12, 12, 12, 1, 1];

      for (var i = 0; i <= 14; i++) {
        var position = this._getPiecePosition(point[i], this._opponentPieces);
        var piece = new _scriptPiece2['default'](position[0], position[1], point[i], false);
        piece.initialize();
        var btn = piece.createPieceElement();

        var tmp = this._view.getElementById("board-area");
        this._view.getElementById("board-area").appendChild(btn);

        this._opponentPieces.push(piece);
      }
    }
  }, {
    key: '_getPiecePosition',
    value: function _getPiecePosition(point, pieces) {
      // 0番目の要素はダミー
      var base_x = [-1, 520, 520, 520, 520, 520, 520, 520, 520, 520, 520, 520, 520, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
      var base_y = [-1, 580, 531, 482, 433, 384, 335, 255, 206, 157, 108, 59, 10, 10, 59, 108, 157, 206, 255, 335, 384, 433, 482, 531, 580];

      var base = 40;
      if (point <= 12) {
        base = -1 * base;
      }

      var num = 0;
      pieces.forEach(function (value) {
        if (value._point === point) {
          num++;
        }
      });
      var position_x = base_x[point] + base * num;
      var position_y = base_y[point];
      return [position_x + "px", position_y + "px"];
    }
  }, {
    key: '_preMovePiece',
    value: function _preMovePiece(piece) {
      // とりあえず、このタイミングで消す
      var img = this._view.getElementById('firstOrSecond-image');
      img.style.display = "none"; // 非表示

      // まずは、すでに表示されている移動可能な場所の表示をクリア
      var elements = document.getElementsByClassName("movable-field");
      while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
      }

      // 移動可能な場所を表示
      var count = 0; //　移動可能な場所の個数
      this._dicePip.forEach((function (value) {
        var point = piece._point - value;
        if (point > 0) {
          // とりあえず、ベアリングオフできないように
          var isMovable = this._canMove(point);
          if (isMovable === true) {
            this._showMovablePoint(point, piece, value);
            count++;
          }
        }
      }).bind(this));

      if (count == 0) {
        this._dicePip = [];
        this._shakeDice(false); // 再度サイコロを振る
      }
    }
  }, {
    key: '_canMove',
    value: function _canMove(point) {
      var numOfOpponentPiece = 0;
      this._opponentPieces.forEach(function (value) {
        if (point === value._point) {
          numOfOpponentPiece++;
        }
      });
      var returnValue = false;
      if (numOfOpponentPiece <= 1) {
        returnValue = true;
      }
      return returnValue;
    }
  }, {
    key: '_showMovablePoint',
    value: function _showMovablePoint(point, piece, diceNum) {
      var position = this._getPiecePosition(point, this._myPieces);
      // 移動可能な位置を表示
      var btn = document.createElement("button");
      btn.type = 'button';
      btn.className = "movable-field";
      btn.style.top = position[0];
      btn.style.left = position[1];

      var img = document.createElement("img");
      img.src = "../image/my_piece2.png";
      img.className = "piece-field";
      btn.appendChild(img);

      btn.onclick = this._movePiece.bind(this, btn, piece, point, diceNum);

      var tmp = this._view.getElementById("board-area");
      this._view.getElementById("board-area").appendChild(btn);
    }
  }, {
    key: '_movePiece',
    value: function _movePiece(btn, piece, point, diceNum) {
      var elements = document.getElementsByClassName("movable-field");
      while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
      }
      piece._btn.style.top = btn.style.top;
      piece._btn.style.left = btn.style.left;
      piece._point = point;

      if (this._myDicePip === this._opponentDicePip) {
        switch (this._dicePip.length) {
          case 1:
            this._view.getElementById('opponent-firstDice-image').style.opacity = "0.5";break;
          case 2:
            this._view.getElementById('opponent-firstDice-image').style.opacity = "0.75";break;
          case 3:
            this._view.getElementById('my-firstDice-image').style.opacity = "0.5";break;
          case 4:
            this._view.getElementById('my-firstDice-image').style.opacity = "0.75";break;
        }
      } else if (this._myDicePip === diceNum) {
        this._view.getElementById('my-firstDice-image').style.opacity = "0.5";
      } else {
        this._view.getElementById('opponent-firstDice-image').style.opacity = "0.5";
      }

      // 移動したサイコロの目は、配列this._dicePipから削除
      var idx = this._dicePip.indexOf(diceNum);
      if (idx >= 0) {
        this._dicePip.splice(idx, 1);
      }

      // pipnumを変更
      this._informationViewController.updatePipNumber(diceNum * -1);

      if (this._dicePip.length === 0) {
        // ターン終了、再度サイコロを振る

        // ターン終了時にカウントをストップしてみる
        this._informationViewController.stopTime();

        this._shakeDice(false);
      }
    }

    // isInit:初回はゾロ目ダメ, 先攻or後攻表示
  }, {
    key: '_shakeDice',
    value: function _shakeDice(isInit) {

      this._view.getElementById('my-firstDice-image').style.opacity = "1.0";
      this._view.getElementById('opponent-firstDice-image').style.opacity = "1.0";

      if (this._count > 20) {
        // 抜け方は後で考える。とりえず手っ取り早い方法で実現
        this._count = 0;

        this._dicePip.push(this._myDicePip);
        this._dicePip.push(this._opponentDicePip);
        // ゾロ目なら4回移動できる
        if (this._myDicePip === this._opponentDicePip) {
          this._dicePip.push(this._myDicePip);
          this._dicePip.push(this._opponentDicePip);
        }
        if (isInit === true) {
          // 順番を表示(first or second)
          var img = this._view.getElementById('firstOrSecond-image');
          if (this._myDicePip > this._opponentDicePip) {
            img.src = "../image/first.png";
            this._view.getElementById('opponent-firstDice-image').style.left = "430px";
          } else {
            img.src = "../image/second.png";
            this._view.getElementById('my-firstDice-image').style.left = "153px";
          }
          img.style.display = "block"; // 表示
        }

        // とりあえず、ここでカウントスタートしてみる
        this._informationViewController.startTime();

        return 0;
      }
      this._myDicePip = Math.ceil(Math.random() * 6); // 1から6までの適当な数字
      this._view.getElementById('my-firstDice-image').src = this._imageMyDiceResource[this._myDicePip].src;

      this._opponentDicePip = Math.ceil(Math.random() * 6);
      if (isInit === true && this._myDicePip === this._opponentDicePip) {
        // 同じ目はダメ
        this._opponentDicePip = (this._opponentDicePip + Math.ceil(Math.random() * 5)) % 6 + 1;
      }
      this._view.getElementById('opponent-firstDice-image').src = this._imageOpponentDiceResource[this._opponentDicePip].src;

      this._count++;
      setTimeout(this._shakeDice.bind(this, isInit), 50); // 50ミリ秒間隔で表示切り替え
    }
  }]);

  return GameViewController;
})();

exports['default'] = GameViewController;
module.exports = exports['default'];