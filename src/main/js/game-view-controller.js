//import Piece from '../script/Piece';
import PieceController from '../script/piece-controller';

import PeerController from '../script/peer-controller';

import SearchOpponentViewController from '../script/search-opponent-view-controller';
import InformationViewController from '../script/information-view-controller';
import DiceController from '../script/dice-controller';
import WinLoseViewController from '../script/win-lose-view-controller';

const BAR_POINT = 25;

export default class GameViewController {

  constructor(view) {
    this._view = view;
    this._isHost = false;
    this._isMyTurn = false;

    this._gameSound = this._view.getElementById('gameSound');
    this._gameSound.volume = 0.2;

    // 対戦相手検索完了後に呼ばれるメソッド
    // this.notificationSearchCompleted = this.notificationSearchCompleted.bind(this);
    this._searchOpponentViewController = new SearchOpponentViewController(this._view);

    this._notificationTimeup = this._notificationTimeup.bind(this);
    this._notificationGoal = this._notificationGoal.bind(this);
    this._informationViewController = new InformationViewController(this._view, this._notificationTimeup, this._notificationGoal);

    var myFirstDiceButton = this._view.getElementById('myFirstDiceButton');
    var mySecoundDiceButton = this._view.getElementById('mySecoundDiceButton');
    var opponentFirstDiceButton = this._view.getElementById('opponentFirstDiceButton');
    var opponentSecoundDiceButton = this._view.getElementById('opponentSecoundDiceButton');
    this._notificationFirstShakeDice = this._notificationFirstShakeDice.bind(this);
    this._notificationShakeDice = this._notificationShakeDice.bind(this);
    this._notificationChangeTurn = this._notificationChangeTurn.bind(this);
    var diceBorderElements = this._view.getElementsByClassName("dice-border-base");

    var diceSound = this._view.getElementById('diceSound');
    this._diceController = new DiceController(myFirstDiceButton,
      mySecoundDiceButton,
      opponentFirstDiceButton,
      opponentSecoundDiceButton,
      diceBorderElements,
      this._notificationFirstShakeDice,
      this._notificationShakeDice,
      this._notificationChangeTurn,
      diceSound);

    this._notificationMovedPiece = this._notificationMovedPiece.bind(this);
    this._notificationMovedPieceToBar = this._notificationMovedPieceToBar.bind(this);

    // piceController
    this._pieceController = new PieceController(this._view, this._notificationMovedPiece, this._notificationMovedPieceToBar);

    // Peerからのメッセージを受信した場合の通知
    this.notificationOfReceiveMessage = this.notificationOfReceiveMessage.bind(this);
    this._peerController = new PeerController(this.notificationOfReceiveMessage);

    this._undoButton = this._view.getElementById('undoButton');
    this._doubleButton = this._view.getElementById('doubleButton');
    this._rollButton = this._view.getElementById('rollButton');

    this._takeButton = this._view.getElementById('takeButton');
    this._passButton = this._view.getElementById('passButton');

    this._giveupButton = this._view.getElementById('giveupButton');

    this._winloseViewController = new WinLoseViewController(this._view);

  }

  initialize() {
    this._undoButton.addEventListener('click', this._onClickUndoButton.bind(this));

    this._doubleButton.addEventListener('click', this._onClickDoubleButton.bind(this));
    this._rollButton.addEventListener('click', this._onClickRollButton.bind(this));

    this._takeButton.addEventListener('click', this._onClickTakeButton.bind(this));
    this._passButton.addEventListener('click', this._onClickPassButton.bind(this));

    this._giveupButton.addEventListener('click', this._onClickGiveupButton.bind(this));

    this._diceController.initialize();

    this._searchOpponentViewController.initialize();

    setTimeout(this._peerController.initialize(), 1000);
  }

  // Peerからのメッセージを受信した場合の通知
  notificationOfReceiveMessage(data) {
    var message = data.message;
    if (message === "userNameAndIcon" ||
      message === "answerUserNameAndIcon") {
      this._searchOpponentViewController.setVersusView(data.userName, data.iconBase64);
      this._searchOpponentViewController.displayVersusView();

      // informationエリアのアイコンなどを設定する
      this._informationViewController.initialize(data.userName, data.iconBase64);

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
      var point = data.destPoint - data.sourcePoint;
      if (data.sourcePoint == BAR_POINT) {
        // バーエリアのときは特別
        point = data.destPoint;
      }
      if (data.destPoint === 0) {
        // ベアオフのときも特別
        point = BAR_POINT - data.sourcePoint;
      }
      this._diceController.movedPiece(point);

      // Pip Countを更新
      this._informationViewController.updateOpponentPipCount(point);
    }

    if (message === "movedPieceToBar") {
      this._pieceController.movedMyPieceToBar(data.destPoint, data.sourcePoint);
    }

    if (message === "undo") {
      this._pieceController.undoOpponent(data.undoOjb);
      // 移動数
      let point = data.undoOjb.opponentPiece.sourcePoint - data.undoOjb.opponentPiece.destPoint;
      if (data.undoOjb.opponentPiece.destPoint === 0) {
        // ベアオフのときは特別
        point = data.undoOjb.opponentPiece.sourcePoint - BAR_POINT;
      }
      this._diceController.movedPiece(point);

      // Pip Countを更新
      this._informationViewController.updateOpponentPipCount(point);
    }

    if (message === "changeTurn") {
      // flagを変更
      this._isMyTurn = true;
      // サイコロの情報をクリア
      this._diceController.clear();
      // PieceControllerの情報をクリア
      this._pieceController.clear();
      this._pieceController.setIsMovable(this._isMyTurn);
      this._informationViewController.setIsTuru(this._isMyTurn);

      // double, roll ボタンを表示
      this._doubleButton.style.display = "block"; // doubleボタン表示
      this._rollButton.style.display = "block"; // rollボタン表示

      // タイマースタート
      this._informationViewController.startTime();
    }

    if (message === "double") {
      this._takeButton.style.display = "block"; // takeボタン表示
      this._passButton.style.display = "block"; // passボタン表示
    }

    if (message === "take") {
      // this._doubleButton.style.display = "none"; // doubleボタン表示
      // this._rollButton.style.display = "none"; // rollBボタン表示

      // Takeされたことを表示
      var takeImage = this._view.getElementById('takeImage');
      takeImage.style.display = "block";
      setTimeout(function() {
        this._view.getElementById('takeImage').style.display = "none";
      }.bind(this), 2000);
      this._changedMyTurn();
    }


    if (message === "dices") {
      this._diceController.shakeOpponentDice(data.pips[0], data.pips[1]);
      this._pieceController.setMovableDicePips(data.pips[0], data.pips[1]);
    }

    if (message === "matchResult") {
      this._informationViewController.setIsTimerForcedTermination(true);
      // Giveup画面を表示
      let myData = this._informationViewController.getMyData();
      let opponentData = this._informationViewController.getOpponentData();
      let result = data.result;
      this._winloseViewController.display(result.isVictory, myData, opponentData, result.reasonString);
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
      this._peerController.sendFirstDices(myPip, opponentPip);
      this._diceController.firstShakeDice(myPip, opponentPip);

      this._pieceController.setMovableDicePips(myPip, opponentPip);
    }
  }

  _updateToStartUI(userName, iconBase64) {
    // informationエリアを表示する（wrapperビューを非表示にする）
    this._informationViewController.hideWrapper();

    // 対戦相手表示画面を非表示にする
    this._searchOpponentViewController.hideVersusView();

    // コマを配りたい
    var myPieceButtons = this._pieceController.appendMyPiece();
    myPieceButtons.forEach(function(value) {
      this._view.getElementById("boardArea").appendChild(value);
    }.bind(this));
    var opponentPieceButtons = this._pieceController.appendOpponentPiece();
    opponentPieceButtons.forEach(function(value) {
      this._view.getElementById("boardArea").appendChild(value);
    }.bind(this));
  }

  _onClickUndoButton() {
    // undo実行
    let undoObje = this._pieceController.undo();

    let undoMyPiece = undoObje.myPiece;

    // undoObjeを対戦相手もに通知する
    // 通知するときに相手側のPointに変換して通知する
    // ベアオフ用
    var destPoint = BAR_POINT - undoMyPiece.destPoint;
    if (undoMyPiece.destPoint === 0) {
      destPoint = 0;
    }
    let sendUndoOjb = {
      "opponentPiece": {
        "destPoint": destPoint,
        "sourcePoint": BAR_POINT - undoMyPiece.sourcePoint
      }
    };
    if (undoObje.opponentPiece) {
      let undoOpponentPiece = undoObje.opponentPiece;
      sendUndoOjb["myPiece"] = {
        "destPoint": BAR_POINT,
        "sourcePoint": BAR_POINT - undoOpponentPiece.sourcePoint
      }
    }
    this._peerController.sendUndoPiece(sendUndoOjb);

    if (this._pieceController.getUndoListCount() <= 0) {
      this._undoButton.style.display = "none";
    }

    // undoの場合はマイナス値を引数にする（マイナス値の場合、不透明にする）
    this._diceController.movedPiece(undoMyPiece.destPoint - undoMyPiece.sourcePoint);

    // Pip Countを更新
    this._informationViewController.updateMyPipCount(undoMyPiece.destPoint - undoMyPiece.sourcePoint);

    this._diceController.clearDiceBorder();
  }

  _onClickDoubleButton() {
    this._doubleButton.style.display = "none"; // doubleボタン非表示
    this._rollButton.style.display = "none"; // rollボタン非表示

    // DOUBLEの場合は相手のアクション(Take or Pass)を受信してから、サイコロを振る
    this._peerController.sendDouble();
  }

  _onClickRollButton() {
    this._doubleButton.style.display = "none"; // doubleボタン非表示
    this._rollButton.style.display = "none"; // rollボタン非表示

    // ROLLの場合は相手のアクションを待つ必要がないので、ここでサイコロを振る
    this._changedMyTurn();
  }

  _onClickTakeButton() {
    this._takeButton.style.display = "none"; // takeボタン非表示
    this._passButton.style.display = "none"; // passボタン非表示
    this._peerController.sendTake();
  }

  _onClickPassButton() {
    this._takeButton.style.display = "none"; // takeボタン非表示
    this._passButton.style.display = "none"; // passボタン非表示

    // Giveup(PASS)画面を表示
    let myData = this._informationViewController.getMyData();
    let opponentData = this._informationViewController.getOpponentData();
    this._winloseViewController.display(false, myData, opponentData, "PASS");
    // 対戦相手に通知
    let matchResult = {
      "isVictory": true,
      "reasonString": "PASS"
    };
    this._peerController.sendMatchResult(matchResult);
  }


  // 自分のターンなった場合の処理
  _changedMyTurn() {
    // サイコロの目を決める
    var pip1 = Math.ceil(Math.random() * 6); // 1から6までの適当な数字
    var pip2 = Math.ceil(Math.random() * 6);

    // 対戦相手にサイコロの目を送る
    this._peerController.sendDices(pip1, pip2);
    this._diceController.shakeMyDice(pip1, pip2);

    this._pieceController.setMovableDicePips(pip1, pip2);

    // 移動できるかを確認
    var isMovable = this._pieceController.isMovableMyPiece();
    if (isMovable === false) {
      // 移動できない場合、_diceControllerに伝えて、ターン交代できるようにする
      // サイコロの枠を表示する
      this._diceController.displayDiceBorder();
      this._diceController.allowTurnChange();
    }
  }

  _onClickGiveupButton() {
    // タイマーストップ
    this._informationViewController.setIsTimerForcedTermination(true);

    // Giveup画面を表示
    let myData = this._informationViewController.getMyData();
    let opponentData = this._informationViewController.getOpponentData();
    this._winloseViewController.display(false, myData, opponentData, "Give UP");
    // 対戦相手に通知
    let matchResult = {
      "isVictory": true,
      "reasonString": "Give UP"
    };
    this._peerController.sendMatchResult(matchResult);
  }

  _notificationTimeup() {
    // Time UP"画面を表示
    let myData = this._informationViewController.getMyData();
    let opponentData = this._informationViewController.getOpponentData();
    this._winloseViewController.display(false, myData, opponentData, "Time UP");
    // 対戦相手に通知
    let matchResult = {
      "isVictory": true,
      "reasonString": "Time UP"
    };
    // Time UP"を対戦相手に通知
    this._peerController.sendMatchResult(matchResult);
  }

  _notificationGoal() {
    // Goal画面を表示
    let myData = this._informationViewController.getMyData();
    let opponentData = this._informationViewController.getOpponentData();
    this._winloseViewController.display(true, myData, opponentData, "Goal");
    // 対戦相手に通知
    let matchResult = {
      "isVictory": false,
      "reasonString": "Goal"
    };
    // Goalしたことを対戦相手に通知
    this._peerController.sendMatchResult(matchResult);
  }
  _notificationFirstShakeDice(myPip, opponentPip) {
    // 順番を表示(first or second)
    if (myPip > opponentPip) {
      this._view.getElementById('firstSmoky').style.display = "block" // 表示
      // コマを動かせる
      this._isMyTurn = true;
    } else {
      this._view.getElementById('secondSmoky').style.display = "block" // 表示
      // コマを動かせない
      this._isMyTurn = false;
    }
    // 自分のターンか対戦相手のターンかを設定する
    this._pieceController.setIsMovable(this._isMyTurn);
    this._informationViewController.setIsTuru(this._isMyTurn);
    // タイマースタート
    this._informationViewController.startTime();
  }

  _notificationShakeDice() {

  }

  _notificationChangeTurn() {
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

    this._pieceController.setIsMovable(this._isMyTurn);
    this._informationViewController.setIsTuru(this._isMyTurn);
    // タイマースタート
    this._informationViewController.startTime();

    this._diceController.clearDiceBorder();
  }

  _notificationMovedPiece(destPoint, sourcePoint) {
    // 対戦相手に通知
    // 通知するときに相手側のPointに変換して通知する
    var convertDestPoint = BAR_POINT - destPoint;
    var convertSourcePoint = BAR_POINT - sourcePoint;

    // barのときは特別(微妙。。。)
    if (sourcePoint === BAR_POINT) {
      convertSourcePoint = BAR_POINT;
    }

    // ベアオフのときも特別
    if (destPoint === 0) {
      convertDestPoint = 0;
    }
    this._peerController.sendMovedPiece(convertDestPoint, convertSourcePoint);

    // サイコロの透過度を変更して、ユーザーに残り進めることの数が分かるようにする
    this._diceController.movedPiece(sourcePoint - destPoint);

    // Pip Countを更新
    this._informationViewController.updateMyPipCount(sourcePoint - destPoint);
    this._undoButton.style.display = "block"; // undoボタン表示

    // まだ移動できるかを確認
    var isMovable = this._pieceController.isMovableMyPiece();
    if (isMovable === false) {
      // サイコロの枠を表示する
      this._diceController.displayDiceBorder();
      // 移動できない場合、_diceControllerに伝えて、ターン交代できるようにする
      this._diceController.allowTurnChange();
    }
  }

  _notificationMovedPieceToBar(sourcePoint) {
    // 対戦相手に通知
    // 通知するときに相手側のPointに変換して通知する
    var convertDestPoint = BAR_POINT;
    var convertSourcePoint = BAR_POINT - sourcePoint;
    this._peerController.sendMovedPieceToBar(convertDestPoint, convertSourcePoint);
  }
}
