import Piece from '../script/Piece';
import PeerController from '../script/peer-controller';

import SearchOpponentViewController from '../script/search-opponent-view-controller';
import InformationViewController from '../script/information-view-controller';
import DiceController from '../script/dice-controller';


export default class GameViewController {

  constructor(view) {
    this._view = view;
    this._myPieces = []; // Pieceオブジェクトを格納する
    this._opponentPieces = []; // Pieceオブジェクトを格納する
    this._count = 0;
    this._myDicePip = 1;
    this._opponentDicePip = 1;
    this._dicePip = [];
    this._informationViewController;

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
    }
  }


  // とりあえずの実装。設計は後から考える
  gameStart(userName, iconBase64) {

    this._updateToStartUI(userName, iconBase64); // ゲーム開始画面のUIに更新する(コマを配る, サイコロの表示/非表示の設定とか)

    if (this._isHost) { // ホストなら初回のサイコロの目を決める
      var myPip = Math.ceil(Math.random() * 6); // 1から6までの適当な数字
      var opponentPip = Math.ceil(Math.random() * 6);
      if (myPip === opponentPip) { // 初回は同じ目は許さない
        opponentPip = (opponentPip + Math.ceil(Math.random() * 5)) % 6 + 1;
      }

      // 対戦相手にサイコロの目を送る
      this._peerController.sendFirstDice(myPip, opponentPip);

      this._diceController.firstShakeDice(myPip, opponentPip);
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
    this._appendPiece();

  }
  _appendPiece() {
    // 自分のコマの位置
    var point = [24, 24, 13, 13, 13, 13, 13, 8, 8, 8, 6, 6, 6, 6, 6];
    for (var i = 0; i <= 14; i++) {
      var position = this._getPiecePosition(point[i], this._myPieces);
      var piece = new Piece(position[0], position[1], point[i], true);
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
      var piece = new Piece(position[0], position[1], point[i], false);
      piece.initialize();
      var btn = piece.createPieceElement();

      var tmp = this._view.getElementById("board-area");
      this._view.getElementById("board-area").appendChild(btn);

      this._opponentPieces.push(piece);
    }
  }

  _getPiecePosition(point, pieces) {
    // 0番目の要素はダミー
    var base_x = [-1, 520, 520, 520, 520, 520, 520, 520, 520, 520, 520, 520, 520,
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10
    ];
    var base_y = [-1, 580, 531, 482, 433, 384, 335, 255, 206, 157, 108, 59, 10,
      10, 59, 108, 157, 206, 255, 335, 384, 433, 482, 531, 580
    ];

    var base = 40;
    if (point <= 12) {
      base = -1 * base;
    }

    var num = 0;
    pieces.forEach(function(value) {
      if (value._point === point) {
        num++;
      }
    });
    var position_x = base_x[point] + (base * num);
    var position_y = base_y[point];
    return [position_x + "px", position_y + "px"];
  }

  _preMovePiece(piece) {
    // まずは、すでに表示されている移動可能な場所の表示をクリア
    var elements = document.getElementsByClassName("movable-field");
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }

    // 移動可能な場所を表示
    var count = 0; //　移動可能な場所の個数
    this._dicePip.forEach(function(value) {
      var point = piece._point - value;
      if (point > 0) { // とりあえず、ベアリングオフできないように
        var isMovable = this._canMove(point);
        if (isMovable === true) {
          this._showMovablePoint(point, piece, value);
          count++;
        }
      }
    }.bind(this));

    if (count == 0) {
      this._dicePip = [];
      //      this._shakeDice(false); // 再度サイコロを振る
    }
  }

  _canMove(point) {
    var numOfOpponentPiece = 0;
    this._opponentPieces.forEach(function(value) {
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


  _showMovablePoint(point, piece, diceNum) {
    var position = this._getPiecePosition(point, this._myPieces);
    // 移動可能な位置を表示
    var btn = document.createElement("button");
    btn.type = 'button';
    btn.className = "movable-field";
    btn.style.top = position[0];
    btn.style.left = position[1];

    var img = document.createElement("img");
    img.src = "../image/my_piece.png";
    img.className = "move-piece-field";
    btn.appendChild(img);

    btn.onclick = this._movePiece.bind(this, btn, piece, point, diceNum);

    var tmp = this._view.getElementById("board-area");
    this._view.getElementById("board-area").appendChild(btn);
  }

  _movePiece(btn, piece, point, diceNum) {
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
          this._view.getElementById('opponent-firstDice-image').style.opacity = "0.5";
          break;
        case 2:
          this._view.getElementById('opponent-firstDice-image').style.opacity = "0.75";
          break;
        case 3:
          this._view.getElementById('my-firstDice-image').style.opacity = "0.5";
          break;
        case 4:
          this._view.getElementById('my-firstDice-image').style.opacity = "0.75";
          break;
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

      //      this._shakeDice(false);
    }
  }
  // isInit:初回はゾロ目ダメ, 先攻or後攻表示
  /*
  _shakeDice(isInit) {

    this._view.getElementById('my-firstDice-image').style.opacity = "1.0";
    this._view.getElementById('opponent-firstDice-image').style.opacity = "1.0";

    if (this._count > 20) { // 抜け方は後で考える。とりえず手っ取り早い方法で実現
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
        if (this._myDicePip > this._opponentDicePip) {
          // img.src = "../image/first.png";
          this._view.getElementById('first-smoky').style.display = "block" // 表示
          this._view.getElementById('opponent-firstDice-image').style.left = "430px"
        } else {
          //img.src = "../image/second.png";
          this._view.getElementById('second-smoky').style.display = "block" // 表示
          this._view.getElementById('my-firstDice-image').style.left = "153px"
        }
      }

      // とりあえず、ここでカウントスタートしてみる
      this._informationViewController.startTime();

      return 0;
    }
    this._myDicePip = Math.ceil(Math.random() * 6); // 1から6までの適当な数字
    this._view.getElementById('my-firstDice-image').src = this._imageMyDiceResource[this._myDicePip].src;

    this._opponentDicePip = Math.ceil(Math.random() * 6);
    if ((isInit === true) && (this._myDicePip === this._opponentDicePip)) {
      // 同じ目はダメ
      this._opponentDicePip = (this._opponentDicePip + Math.ceil(Math.random() * 5)) % 6 + 1;
    }
    this._view.getElementById('opponent-firstDice-image').src = this._imageOpponentDiceResource[this._opponentDicePip].src;

    this._count++;
    setTimeout(this._shakeDice.bind(this, isInit), 50); // 50ミリ秒間隔で表示切り替え
  }
  */

  _notificationFirstShakeDice(myPip, opponentPip) {
    // 順番を表示(first or second)
    if (myPip > opponentPip) {
      this._view.getElementById('first-smoky').style.display = "block" // 表示
    } else {
      this._view.getElementById('second-smoky').style.display = "block" // 表示
    }
  }

  _notificationShakeDice() {

  }

}
