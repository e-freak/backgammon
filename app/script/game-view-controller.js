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
    this._isHost = false;
    this._isMyTurn = false;

    // 対戦相手検索完了後に呼ばれるメソッド
    // this.notificationSearchCompleted = this.notificationSearchCompleted.bind(this);
    this._searchOpponentViewController = new _scriptSearchOpponentViewController2['default'](this._view);

    this._informationViewController = new _scriptInformationViewController2['default'](this._view);

    var myFirstDiceButton = this._view.getElementById('my-firstDice-button');
    var mySecoundDiceButton = this._view.getElementById('my-secoundDice-button');
    var opponentFirstDiceButton = this._view.getElementById('opponent-firstDice-button');
    var opponentSecoundDiceButton = this._view.getElementById('opponent-secoundDice-button');
    this._notificationFirstShakeDice = this._notificationFirstShakeDice.bind(this);
    this._notificationShakeDice = this._notificationShakeDice.bind(this);
    this._notificationChangeTurn = this._notificationChangeTurn.bind(this);
    this._diceController = new _scriptDiceController2['default'](myFirstDiceButton, mySecoundDiceButton, opponentFirstDiceButton, opponentSecoundDiceButton, this._notificationFirstShakeDice, this._notificationShakeDice, this._notificationChangeTurn);

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
      if (message === "firstDices") {
        this._diceController.firstShakeDice(data.receiverPip, data.senderPip);
        this._pieceController.setMovableDicePips(data.receiverPip, data.senderPip);
      }
      if (message === "movedPiece") {
        this._pieceController.movedOpponentPiece(data.destPoint, data.sourcePoint);

        this._diceController.movedPiece(data.destPoint - data.sourcePoint);
      }

      if (message === "undo") {
        this._pieceController.undoOpponent(data.undoOjb);
        // 移動数
        var point = data.undoOjb.opponentPiece.sourcePoint - data.undoOjb.opponentPiece.destPoint;
        this._diceController.movedPiece(point);
      }

      if (message === "changeTurn") {
        // double/roll/take/passの実装は後から

        // flagを変更
        this._isMyTurn = true;
        // サイコロの情報をクリア
        this._diceController.clear();
        // PieceControllerの情報をクリア
        this._pieceController.clear();
        this._pieceController.setIsMovable(this._isMyTurn);
        // サイコロの目を決める
        var pip1 = Math.ceil(Math.random() * 6); // 1から6までの適当な数字
        var pip2 = Math.ceil(Math.random() * 6);

        pip1 = 2;
        pip2 = 2;

        // 対戦相手にサイコロの目を送る
        this._peerController.sendDices(pip1, pip2); // 実装中
        this._diceController.shakeMyDice(pip1, pip2); // 実装中

        this._pieceController.setMovableDicePips(pip1, pip2);
      }
      if (message === "dices") {
        this._diceController.shakeOpponentDice(data.pips[0], data.pips[1]);
        this._pieceController.setMovableDicePips(data.pips[0], data.pips[1]);
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
        this._peerController.sendFirstDices(myPip, opponentPip);
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

      // undoの場合はマイナス値を引数にする（マイナス値の場合、不透明にする）
      this._diceController.movedPiece(undoMyPiece.destPoint - undoMyPiece.sourcePoint);
    }
  }, {
    key: '_notificationFirstShakeDice',
    value: function _notificationFirstShakeDice(myPip, opponentPip) {
      // 順番を表示(first or second)
      if (myPip > opponentPip) {
        this._view.getElementById('first-smoky').style.display = "block"; // 表示
        // コマを動かせる
        this._isMyTurn = true;
      } else {
        this._view.getElementById('second-smoky').style.display = "block"; // 表示
        // コマを動かせない
        this._isMyTurn = false;
      }
      // 自分のターンか対戦相手のターンかを設定する
      this._pieceController.setIsMovable(this._isMyTurn);
    }
  }, {
    key: '_notificationShakeDice',
    value: function _notificationShakeDice() {}
  }, {
    key: '_notificationChangeTurn',
    value: function _notificationChangeTurn() {
      // ターン交代

      // 対戦相手のターンなら何もしない
      if (this._isMyTurn === false) {
        return;
      }
      // flagを変更
      this._isMyTurn = false;
      // undoボタンを消す
      this._undoButton.style.display = "none";
      // サイコロの情報をクリア
      this._diceController.clear();
      // PieceControllerの情報をクリア
      this._pieceController.clear();
      // 相手のターンになったことを対戦相手に通知（サイコロを振るのは相手側でやる）
      this._peerController.sendChangeTurn();
    }
  }, {
    key: '_notificationMovedPiece',
    value: function _notificationMovedPiece(destPoint, sourcePoint) {
      // 対戦相手に通知
      // 通知するときに相手側のPointに変換して通知する
      var convertDestPoint = 25 - destPoint;
      var convertSourcePoint = 25 - sourcePoint;
      this._peerController.sendMovedPiece(convertDestPoint, convertSourcePoint);

      // サイコロの透過度を変更して、ユーザーに残り進めることの数が分かるようにする
      this._diceController.movedPiece(sourcePoint - destPoint);

      this._undoButton.style.display = "block"; // undoボタン表示
    }
  }]);

  return GameViewController;
})();

exports['default'] = GameViewController;
module.exports = exports['default'];