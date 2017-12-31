import UserSettingController from '../script/user-setting-controller';

export default class InformationViewController {

  constructor(view) {
    this._view = view;
    this._playerName = "name";
    this._iconImag;
    this._pipCount = 167;
    this._timeLimit = 600; // 制限時間
    this._isTurn = true; // 自分のターンか？

    this._pipElement;
    this._timeElement;

    this._userSettingController = new UserSettingController();
  }

  initialize(opponentName, opponentIconBase64) {
    this.setMyName();
    this.setMyIcon();
    this.setOpponentName(opponentName);
    this.setOpponentIcon(opponentIconBase64);
    this._pipElement = this._view.getElementById('my-pipCount');
    this._timeElement = this._view.getElementById('my-timeLimit');
  }

  startTime() {
    this._timeLimit--;
    var id = setTimeout(this.startTime.bind(this), 1000);
    if (this._isTurn === false) {　
      this._isTurn = true; // ここでtrueにするの微妙。。。
      clearTimeout(id);　 //idをclearTimeoutで指定している
    }
    var min = String(Math.floor(this._timeLimit / 60));
    var second = String(this._timeLimit % 60);
    this._timeElement.innerText = min + ":" + second;
  }

  stopTime() {
    this._isTurn = false;
  }

  updatePipNumber(num) {
    this._pipCount += num;
    this._pipElement.innerText = String(this._pipCount);
  }

  setMyName() {
    var name = this._userSettingController.loadUserNameFromJSON();
    var myName = this._view.getElementById('my-information-name');
    myName.innerHTML = name;
  }

  setMyIcon(iconSrc) {
    var base64 = this._userSettingController.loadImageBase64FromJSON();
    var iconImageSrc = this._getImagesrcWithBase64(base64);
    var myIcon = this._view.getElementById('my-information-icon');
    myIcon.src = iconImageSrc;
  }

  setOpponentName(name) {
    var opponentName = this._view.getElementById('opponent-information-name');
    opponentName.innerHTML = name;

  }

  setOpponentIcon(icon) {
    var opponentIcon = this._view.getElementById('opponent-information-icon');
    var opponentIconImageSrc = this._getImagesrcWithBase64(icon);
    opponentIcon.src = opponentIconImageSrc;
  }

  _getImagesrcWithBase64(base64) {
    // ファイル形式は先頭3文字で判断する
    var first3Char = base64.substring(0, 3);
    var src = "";
    if (first3Char === "/9j") {
      // JPEG
      src = "data:image/jpg;base64," + base64;
    } else if (first3Char === "iVB") {
      // PNG
      src = "data:image/png;base64," + base64;
    } else if (first3Char === "R0l") {
      // GIF
      src = "data:image/gif;base64," + base64;
    } else {
      // 対応フォーマット以外
      alert("アイコンの読み取り失敗");
    }
    return src;
  }

}
