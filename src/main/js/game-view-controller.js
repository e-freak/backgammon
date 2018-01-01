//import Piece from '../script/Piece';
import PieceController from '../script/piece-controller';

import PeerController from '../script/peer-controller';

import SearchOpponentViewController from '../script/search-opponent-view-controller';
import InformationViewController from '../script/information-view-controller';
import DiceController from '../script/dice-controller';


export default class GameViewController {

  constructor(view) {
    this._view = view;
    this._count = 0;
    this._isHost = false;

    // 対戦相手検索完了後に呼ばれるメソッド
    // this.notificationSearchCompleted = this.notificationSearchCompleted.bind(this);
    this._searchOpponentViewController = new SearchOpponentViewController(this._view);

    this._informationViewController = new InformationViewController(this._view);

    var myFirstDiceImage = this._view.getElementById('my-firstDice-image');
    var mySecoundDiceImage = this._view.getElementById('my-secoundDice-image');
    var opponentFirstDiceImage = this._view.getElementById('opponent-firstDice-image');
    var opponentSecoundDiceImage = this._view.getElementById('opponent-secoundDice-image');
    this._notificationFirstShakeDice = this._notificationFirstShakeDice.bind(this);
    this._notificationShakeDice = this._notificationShakeDice.bind(this);
    this._diceController = new DiceController(myFirstDiceImage,
      mySecoundDiceImage,
      opponentFirstDiceImage,
      opponentSecoundDiceImage,
      this._notificationFirstShakeDice,
      this._notificationShakeDice);

    this._notificationMovedPiece = this._notificationMovedPiece.bind(this);
    // piceController
    this._pieceController = new PieceController(this._view, this._notificationMovedPiece);

    // Peerからのメッセージを受信した場合の通知
    this.notificationOfReceiveMessage = this.notificationOfReceiveMessage.bind(this);
    this._peerController = new PeerController(this.notificationOfReceiveMessage);
  }

  initialize() {
    // ボード画面は非表示にする
    var mainArea = this._view.getElementById('main-area');
    mainArea.style.display = "none";

    this._diceController.initialize();
    // 検索中の画面を表示
    this._searchOpponentViewController.initialize();

    this._peerController.initialize();

  }

  // Peerからのメッセージを受信した場合の通知
  notificationOfReceiveMessage(data) {
    var message = data.message;
    if (message === "userNameAndIcon" ||
      message === "answerUserNameAndIcon") {
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
    if (message == "movedPiece") {
      this._pieceController.movedOpponentPiece(data.destPoint, data.sourcePoint);
    }
  }


  // とりあえずの実装。設計は後から考える
  gameStart(userName, iconBase64) {
    // ゲーム開始画面のUIに更新する(コマを配る, サイコロの表示/非表示の設定とか)
    this._updateToStartUI(userName, iconBase64);

    if (this._isHost) { // ホストなら初回のサイコロの目を決める
      var myPip = Math.ceil(Math.random() * 6); // 1から6までの適当な数字
      var opponentPip = Math.ceil(Math.random() * 6);
      while (myPip === opponentPip) { // 初回は同じ目は許さない(何度かすれば違う目になる)
        opponentPip = Math.ceil(Math.random() * 6);
      }

      // 対戦相手にサイコロの目を送る
      this._peerController.sendFirstDice(myPip, opponentPip);
      this._diceController.firstShakeDice(myPip, opponentPip);
      
      this._pieceController.setMovableDicePips(myPip, opponentPip);
    }
  }

  _updateToStartUI(userName, iconBase64) {
    // informationエリアのアイコンなどを設定する
    this._informationViewController.initialize(userName, iconBase64);
    // 対戦相手検索画面を非表示にする
    var snowfallArea = this._view.getElementById('snowfall');
    snowfallArea.style.display = "none";

    // gameのメイン画面を表示する
    var mainArea = this._view.getElementById('main-area');
    mainArea.style.display = "flex";

    // 試行錯誤中
    this._view.getElementById('my-double-button').style.animationIterationCount = "infinite";
    // コマを配りたい
    var myPieceButtons = this._pieceController.appendMyPiece();
    myPieceButtons.forEach(function(value) {
      this._view.getElementById("board-area").appendChild(value);
    }.bind(this));
    var opponentPieceButtons = this._pieceController.appendOpponentPiece();
    opponentPieceButtons.forEach(function(value) {
      this._view.getElementById("board-area").appendChild(value);
    }.bind(this));
  }

  _notificationFirstShakeDice(myPip, opponentPip) {
    // 順番を表示(first or second)
    if (myPip > opponentPip) {
      this._view.getElementById('first-smoky').style.display = "block" // 表示

      // コマを動かせる
      this._pieceController.setIsMovable(true);
    } else {
      this._view.getElementById('second-smoky').style.display = "block" // 表示
      // コマを動かせない
      this._pieceController.setIsMovable(false);
    }
  }

  _notificationShakeDice() {

  }

  _notificationMovedPiece(destPoint, sourcePoint) {
    // 対戦相手に通知
    // 通知するときに相手側のPointに変換して通知する
    var convertDestPoint = 25 - destPoint;
    var convertSourcePoint = 25 - sourcePoint;
    this._peerController.sendMovedPiece(convertDestPoint, convertSourcePoint);
  }
}
