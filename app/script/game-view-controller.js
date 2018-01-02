//import Piece from '../script/Piece';
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _scriptPieceController = require('../script/piece-controller');

var _scriptPieceController2 = _interopRequireDefault(_scriptPieceController);

var _scriptPeerController = require('../script/peer-controller');

var _scriptPeerController2 = _interopRequireDefault(_scriptPeerController);

var _scriptSearchOpponentViewController = require('../script/search-opponent-view-controller');

var _scriptSearchOpponentViewController2 = _interopRequireDefault(_scriptSearchOpponentViewController);

var _scriptInformationViewController = require('../script/information-view-controller');

var _scriptInformationViewController2 = _interopRequireDefault(_scriptInformationViewController);

var _scriptDiceController = require('../script/dice-controller');

var _scriptDiceController2 = _interopRequireDefault(_scriptDiceController);

var GameViewController = (function () {
  function GameViewController(view) {
    _classCallCheck(this, GameViewController);

    this._view = view;
    this._count = 0;
    this._isHost = false;

    // 対戦相手検索完了後に呼ばれるメソッド
    // this.notificationSearchCompleted = this.notificationSearchCompleted.bind(this);
    this._searchOpponentViewController = new _scriptSearchOpponentViewController2['default'](this._view);

    this._informationViewController = new _scriptInformationViewController2['default'](this._view);

    var myFirstDiceImage = this._view.getElementById('my-firstDice-image');
    var mySecoundDiceImage = this._view.getElementById('my-secoundDice-image');
    var opponentFirstDiceImage = this._view.getElementById('opponent-firstDice-image');
    var opponentSecoundDiceImage = this._view.getElementById('opponent-secoundDice-image');
    this._notificationFirstShakeDice = this._notificationFirstShakeDice.bind(this);
    this._notificationShakeDice = this._notificationShakeDice.bind(this);
    this._diceController = new _scriptDiceController2['default'](myFirstDiceImage, mySecoundDiceImage, opponentFirstDiceImage, opponentSecoundDiceImage, this._notificationFirstShakeDice, this._notificationShakeDice);

    this._notificationMovedPiece = this._notificationMovedPiece.bind(this);
    // piceController
    this._pieceController = new _scriptPieceController2['default'](this._view, this._notificationMovedPiece);

    // Peerからのメッセージを受信した場合の通知
    this.notificationOfReceiveMessage = this.notificationOfReceiveMessage.bind(this);
    this._peerController = new _scriptPeerController2['default'](this.notificationOfReceiveMessage);

    this._undoButton = this._view.getElementById('undo-button');
  }

  _createClass(GameViewController, [{
    key: 'initialize',
    value: function initialize() {

      this._undoButton.addEventListener('click', this._onClickUndoButton.bind(this));

      // ボード画面は非表示にする
      var mainArea = this._view.getElementById('main-area');
      mainArea.style.display = "none";

      this._diceController.initialize();
      // 検索中の画面を表示
      this._searchOpponentViewController.initialize();

      this._peerController.initialize();
    }

    // Peerからのメッセージを受信した場合の通知
  }, {
    key: 'notificationOfReceiveMessage',
    value: function notificationOfReceiveMessage(data) {
      var message = data.message;
      if (message === "userNameAndIcon" || message === "answerUserNameAndIcon") {
        this._searchOpponentViewController.setVersusView(data.userName, data.iconBase64);
        this._searchOpponentViewController.displayVersusView();
        // ゲーム開始
        setTimeout(this.gameStart.bind(this, data.userName, data.iconBase64), 6000);
      }
      if (message === "userNameAndIcon") {
        this._isHost = true; // ホスト 初回のサイコロの目を決める
      }
      if (message === "firstDice") {
        this._diceController.firstShakeDice(data.receiverPip, data.senderPip);
        this._pieceController.setMovableDicePips(data.receiverPip, data.senderPip);
      }
      if (message === "movedPiece") {
        this._pieceController.movedOpponentPiece(data.destPoint, data.sourcePoint);
      }

      if (message === "undo") {
        this._pieceController.undoOpponent(data.undoOjb);
      }
    }

    // とりあえずの実装。設計は後から考える
  }, {
    key: 'gameStart',
    value: function gameStart(userName, iconBase64) {
      // ゲーム開始画面のUIに更新する(コマを配る, サイコロの表示/非表示の設定とか)
      this._updateToStartUI(userName, iconBase64);

      if (this._isHost) {
        // ホストなら初回のサイコロの目を決める
        var myPip = Math.ceil(Math.random() * 6); // 1から6までの適当な数字
        var opponentPip = Math.ceil(Math.random() * 6);
        while (myPip === opponentPip) {
          // 初回は同じ目は許さない(何度かすれば違う目になる)
          opponentPip = Math.ceil(Math.random() * 6);
        }

        // 対戦相手にサイコロの目を送る
        this._peerController.sendFirstDice(myPip, opponentPip);
        this._diceController.firstShakeDice(myPip, opponentPip);

        this._pieceController.setMovableDicePips(myPip, opponentPip);
      }
    }
  }, {
    key: '_updateToStartUI',
    value: function _updateToStartUI(userName, iconBase64) {
      // informationエリアのアイコンなどを設定する
      this._informationViewController.initialize(userName, iconBase64);
      // 対戦相手検索画面を非表示にする
      var snowfallArea = this._view.getElementById('snowfall');
      snowfallArea.style.display = "none";

      // gameのメイン画面を表示する
      var mainArea = this._view.getElementById('main-area');
      mainArea.style.display = "flex";

      this._undoButton.style.display = "none";

      // 試行錯誤中
      this._view.getElementById('my-double-button').style.animationIterationCount = "infinite";
      // コマを配りたい
      var myPieceButtons = this._pieceController.appendMyPiece();
      myPieceButtons.forEach((function (value) {
        this._view.getElementById("board-area").appendChild(value);
      }).bind(this));
      var opponentPieceButtons = this._pieceController.appendOpponentPiece();
      opponentPieceButtons.forEach((function (value) {
        this._view.getElementById("board-area").appendChild(value);
      }).bind(this));
    }
  }, {
    key: '_onClickUndoButton',
    value: function _onClickUndoButton() {
      // undo実行
      var undoObje = this._pieceController.undo();

      var undoMyPiece = undoObje.myPiece;

      // undoObjeを対戦相手もに通知する
      // 通知するときに相手側のPointに変換して通知する
      var sendUndoOjb = {
        "opponentPiece": {
          "destPoint": 25 - undoMyPiece.destPoint,
          "sourcePoint": 25 - undoMyPiece.sourcePoint
        }
      };
      if (undoObje.opponentPiece) {
        sendUndoOjb["myPiece"] = {
          "destPoint": -1,
          "sourcePoint": 25 - destPoint
        };
      }
      this._peerController.sendUndoPiece(sendUndoOjb);

      if (this._pieceController.getUndoListCount() <= 0) {
        this._undoButton.style.display = "none";
      }
    }
  }, {
    key: '_notificationFirstShakeDice',
    value: function _notificationFirstShakeDice(myPip, opponentPip) {
      // 順番を表示(first or second)
      if (myPip > opponentPip) {
        this._view.getElementById('first-smoky').style.display = "block"; // 表示

        // コマを動かせる
        this._pieceController.setIsMovable(true);
      } else {
        this._view.getElementById('second-smoky').style.display = "block"; // 表示
        // コマを動かせない
        this._pieceController.setIsMovable(false);
      }
    }
  }, {
    key: '_notificationShakeDice',
    value: function _notificationShakeDice() {}
  }, {
    key: '_notificationMovedPiece',
    value: function _notificationMovedPiece(destPoint, sourcePoint) {
      // 対戦相手に通知
      // 通知するときに相手側のPointに変換して通知する
      var convertDestPoint = 25 - destPoint;
      var convertSourcePoint = 25 - sourcePoint;
      this._peerController.sendMovedPiece(convertDestPoint, convertSourcePoint);

      this._undoButton.style.display = "block"; // undoボタン表示
    }
  }]);

  return GameViewController;
})();

exports['default'] = GameViewController;
module.exports = exports['default'];