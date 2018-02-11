import 'babel-polyfill';

export default class DiceController {

  constructor(myFirstDiceButton, mySecoundDiceButton, opponentFirstDiceButton, opponentSecoundDiceButton, diceBorderElements, notificationFirstShakeDice, notificationShakeDice, notificationChangeTurn) {
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
  }

  initialize() {
    this._loadImages(); // 画像をロードしておく

    this._myFirstDiceButton.style.display = "none" // 非表示;
    this._mySecoundDiceButton.style.display = "none" // 非表示;
    this._opponentFirstDiceButton.style.display = "none" // 非表示;
    this._opponentSecoundDiceButton.style.display = "none" // 非表示;

    this._myFirstDiceButton.addEventListener('click', this._onClickDiceButton.bind(this));
    this._mySecoundDiceButton.addEventListener('click', this._onClickDiceButton.bind(this));
    this._opponentFirstDiceButton.addEventListener('click', this._onClickDiceButton.bind(this));
    this._opponentSecoundDiceButton.addEventListener('click', this._onClickDiceButton.bind(this));

    // サイコロの枠を非表示にする
    this.clearDiceBorder();
  }

  // ゲーム開始時にサイコロを振る
  // 対戦相手と通信するため、出る目はGame controllerで設定する
  firstShakeDice(myPip, opponentPip) {
    this._myFirstDiceButton.style.display = "block" // 表示;
    this._mySecoundDiceButton.style.display = "none" // 非表示;
    this._opponentFirstDiceButton.style.display = "block" // 表示;
    this._opponentSecoundDiceButton.style.display = "none" // 非表示;

    this._myFirstDiceButton.firstChild.style.opacity = "1.0";
    this._mySecoundDiceButton.firstChild.style.opacity = "0.0";
    this._opponentFirstDiceButton.firstChild.style.opacity = "1.0";
    this._opponentSecoundDiceButton.firstChild.style.opacity = "0.0";

    this._dicePips.push(myPip);
    this._dicePips.push(opponentPip);
    // 降っている風に見せる
    this._firstShakeAnimation(myPip, opponentPip);
  }

  shakeMyDice(pip1, pip2) {
    this._myFirstDiceButton.style.display = "block" // 非表示;
    this._mySecoundDiceButton.style.display = "block" // 非表示;
    this._opponentFirstDiceButton.style.display = "none" // 表示;
    this._opponentSecoundDiceButton.style.display = "none" // 表示;

    this._myFirstDiceButton.firstChild.style.opacity = "1.0";
    this._mySecoundDiceButton.firstChild.style.opacity = "1.0";
    this._opponentFirstDiceButton.firstChild.style.opacity = "0.0";
    this._opponentSecoundDiceButton.firstChild.style.opacity = "0.0";

    this._dicePips.push(pip1);
    this._dicePips.push(pip2);
    // 振っている風に見せる
    this._shakeMyDiceAnimation(pip1, pip2);
  }

  shakeOpponentDice(pip1, pip2) {
    this._myFirstDiceButton.style.display = "none" // 非表示;
    this._mySecoundDiceButton.style.display = "none" // 非表示;
    this._opponentFirstDiceButton.style.display = "block" // 表示;
    this._opponentSecoundDiceButton.style.display = "block" // 表示;

    this._myFirstDiceButton.firstChild.style.opacity = "0.0";
    this._mySecoundDiceButton.firstChild.style.opacity = "0.0";
    this._opponentFirstDiceButton.firstChild.style.opacity = "1.0";
    this._opponentSecoundDiceButton.firstChild.style.opacity = "1.0";

    this._dicePips.push(pip1);
    this._dicePips.push(pip2);
    // 振っている風に見せる
    this._shakeOpponentDiceAnimation(pip1, pip2);
  }

  clear() {
    this._dicePips = [];

    this._myFirstDiceButton.style.display = "none" // 非表示;
    this._mySecoundDiceButton.style.display = "none" // 非表示;
    this._opponentFirstDiceButton.style.display = "none" // 非表示;
    this._opponentSecoundDiceButton.style.display = "none" // 非表示;

    // 位置を移動しているので、その情報をクリア
    this._opponentFirstDiceButton.style.left = ""
    this._myFirstDiceButton.style.left = ""

    this.isAllowTurnChange = false;

    // サイコロの枠を非表示にする
    this.clearDiceBorder();
  }

  movedPiece(point) {
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
    var dicePips =[];
    for (let i = 0; i < displayDiceButtons.length; i++) {
      dicePips.push(this._getDicePipFromButton(displayDiceButtons[i]));
    }
    var index = dicePips.indexOf(point);

    for (let i = 0; i < displayDiceButtons.length; i++) {
      var opacity = parseFloat(displayDiceButtons[i].firstChild.style.opacity);
      if (((this._getDicePipFromButton(displayDiceButtons[i]) === point) && (opacity !== limit)) ||
        ((index === -1) && (opacity !== limit))) {
        opacity += addOpacity;
        displayDiceButtons[i].firstChild.style.opacity = opacity + ''; // toString()より速いよう
        break;
      }
    }
  }

  // ボタンからサイコロの目を取得
  _getDicePipFromButton(button) {
    for (var i = 1; i <= 6; i++) {
      if (button.firstChild.src === this._imageMyDiceResource[i].src ||
        button.firstChild.src === this._imageOpponentDiceResource[i].src) {
        return i;
      }
    }
    return 0;
  }

  // 表示中のサイコロのボタンを返す
  _getDisplayDiceButtons() {
    let buttons = [];
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

  async _firstShakeAnimation(myPip, opponentPip) {
    for (let i = 0; i < 20; i++) {
      var num1 = Math.ceil(Math.random() * 6);
      var num2 = Math.ceil(Math.random() * 6);

      this._myFirstDiceButton.firstChild.src = this._imageMyDiceResource[num1].src;
      this._opponentFirstDiceButton.firstChild.src = this._imageOpponentDiceResource[num2].src;

      // 少し待つ
      await this._sleep(50);
    }
    this._myFirstDiceButton.firstChild.src = this._imageMyDiceResource[myPip].src;
    this._opponentFirstDiceButton.firstChild.src = this._imageOpponentDiceResource[opponentPip].src;

    if (myPip > opponentPip) {
      this._opponentFirstDiceButton.style.left = "430px"
    } else {
      this._myFirstDiceButton.style.left = "153px"
    }
    // game controller に通知
    this._notificationFirstShakeDice(myPip, opponentPip);
  }

  async _shakeMyDiceAnimation(pip1, pip2) {
    for (let i = 0; i < 20; i++) {
      var num1 = Math.ceil(Math.random() * 6);
      var num2 = Math.ceil(Math.random() * 6);

      this._myFirstDiceButton.firstChild.src = this._imageMyDiceResource[num1].src;
      this._mySecoundDiceButton.firstChild.src = this._imageMyDiceResource[num2].src;

      // 少し待つ
      await this._sleep(50);
    }
    this._myFirstDiceButton.firstChild.src = this._imageMyDiceResource[pip1].src;
    this._mySecoundDiceButton.firstChild.src = this._imageMyDiceResource[pip2].src;
  }

  async _shakeOpponentDiceAnimation(pip1, pip2) {
    for (let i = 0; i < 20; i++) {
      var num1 = Math.ceil(Math.random() * 6);
      var num2 = Math.ceil(Math.random() * 6);

      this._opponentFirstDiceButton.firstChild.src = this._imageOpponentDiceResource[num1].src;
      this._opponentSecoundDiceButton.firstChild.src = this._imageOpponentDiceResource[num2].src;

      // 少し待つ
      await this._sleep(50);
    }
    this._opponentFirstDiceButton.firstChild.src = this._imageOpponentDiceResource[pip1].src;
    this._opponentSecoundDiceButton.firstChild.src = this._imageOpponentDiceResource[pip2].src;
  }

  _loadImages() {
    // サイコロの画像
    for (var i = 1; i <= 6; i++) {
      // ArrayのIndex=サイコロの目(0は使用しない)
      this._imageMyDiceResource[i] = new Image();
      this._imageMyDiceResource[i].src = "../image/myDice/dice" + i + ".png";
      this._imageOpponentDiceResource[i] = new Image();
      this._imageOpponentDiceResource[i].src = "../image/opponentDice/dice" + i + ".png";
    }
  }

  allowTurnChange() {
    this.isAllowTurnChange = true;
  }

  _onClickDiceButton() {
    // 表示中のサイコロの透過度が全て"0.0"の場合、ターン交代
    // 自分のターン or 対戦相手のターンかの判断はGameViewControllerに任せる
    var displayDiceButtons = this._getDisplayDiceButtons();
    var flag = true;
    displayDiceButtons.forEach(function(value) {
      if (value.firstChild.style.opacity !== "0.4") {
        flag = false
      }
    });

    if (flag || this.isAllowTurnChange) {
      this._notificationChangeTurn();
    }
  }

  displayDiceBorder() {
    // サイコロの枠を表示する
    for (let index = 0; index < this._diceBorderElements.length; index++) {
      this._diceBorderElements[index].style.display = "block";
    }
  }

  clearDiceBorder() {
    // サイコロの枠を非表示にする
    for (let index = 0; index < this._diceBorderElements.length; index++) {
      this._diceBorderElements[index].style.display = "none";
    }
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
