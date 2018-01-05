import UserSettingController from '../script/user-setting-controller';

export default class InformationViewController {

  constructor(view) {
    this._view = view;
    this._myPipCount = 167;
    this._myTimeLimit = 600; // 制限時間
    this._opponentPipCount = 167;
    this._opponentTimeLimit = 600; // 制限時間

    this._myData={};
    this._opponentData={};


    this._isTurn = true; // 自分のターンか？

    this._isTimerForcedTermination = false; // タイマーの強制終了

    this._myPipElement;
    this._myTimeElement;
    this._opponentPipElement;
    this._opponentTimeElement;

    this._userSettingController = new UserSettingController();

    this._informationAreaWrapper = this._view.getElementById('information-area-wrapper');
  }

  initialize(opponentName, opponentIconBase64) {
    this.setMyName();
    this.setMyIcon();
    this.setOpponentName(opponentName);
    this.setOpponentIcon(opponentIconBase64);
    this._myPipElement = this._view.getElementById('my-pipCount');
    this._myTimeElement = this._view.getElementById('my-timeLimit');

    this._opponentPipElement = this._view.getElementById('opponent-pipCount');
    this._opponentTimeElement = this._view.getElementById('opponent-timeLimit');

    this._informationAreaWrapper.style.display = "block";
  }
  hideWrapper() {
    this._informationAreaWrapper.style.display = "none";
  }
  setIsTuru(flag) {
    this._isTurn = flag;
  }

  setIsTimerForcedTermination(flag) {
    this._isTimerForcedTermination = flag;
  }

  startTime() {
    if (this._isTurn){
      this._startMyTimeLimit();
    }else{
      this._startOpponentTimeLimit();
    }
  }

  _startMyTimeLimit() {
    this._myTimeLimit--;
    var id = setTimeout(this._startMyTimeLimit.bind(this), 1000);
    if (this._isTurn === false || this._isTimerForcedTermination === true) {　
      clearTimeout(id);　 //idをclearTimeoutで指定している
    }
    var min = ("00" + String(Math.floor(this._myTimeLimit / 60))).slice(-2);
    var second = ("00" + String(this._myTimeLimit % 60)).slice(-2);
    this._myTimeElement.innerText = min + ":" + second;
    if (this._myTimeLimit < 0){
      this._isTimerForcedTermination = true;
      alert("時間切れ〜");
    }
  }

  _startOpponentTimeLimit() {
    this._opponentTimeLimit--;
    var id = setTimeout(this._startOpponentTimeLimit.bind(this), 1000);
    if (this._isTurn === true || this._isTimerForcedTermination === true) {　
      clearTimeout(id);　 //idをclearTimeoutで指定している
    }
    var min = ("00" + String(Math.floor(this._opponentTimeLimit / 60))).slice(-2);
    var second =  ("00" + String(this._opponentTimeLimit % 60)).slice(-2);
    this._opponentTimeElement.innerText = min + ":" + second;
    if (this._opponentTimeLimit < 0){
      this._isTimerForcedTermination = true;
      alert("対戦相手の時間切れ〜");
    }
  }

  updateMyPipCount(count) {
    this._myPipCount -= count;
    this._myPipElement.innerText = String(this._myPipCount);
  }
  updateOpponentPipCount(count) {
    this._opponentPieces -= count;
    this._opponentPipElement.innerText = String(this._opponentPipCount);
  }

  setMyName() {
    var name = this._userSettingController.loadUserNameFromJSON();
    var myNameElement = this._view.getElementById('my-information-name');
    myNameElement.innerHTML = name;

    this._myData["name"] = name;
  }


  setMyIcon(iconSrc) {
    var base64 = this._userSettingController.loadImageBase64FromJSON();
    var iconImageSrc = this._getImagesrcWithBase64(base64);
    var myIcon = this._view.getElementById('my-information-icon');
    myIcon.src = iconImageSrc;

    this._myData["imageSrc"] = myIcon.src;
  }

  setOpponentName(name) {
    var opponentName = this._view.getElementById('opponent-information-name');
    opponentName.innerHTML = name;

    this._opponentData["name"] = name;
  }

  setOpponentIcon(icon) {
    var opponentIcon = this._view.getElementById('opponent-information-icon');
    var opponentIconImageSrc = this._getImagesrcWithBase64(icon);
    opponentIcon.src = opponentIconImageSrc;

    this._opponentData["imageSrc"] = opponentIcon.src;
  }

  getMyData(){
    return this._myData;
  }

  getOpponentData(){
    return this._opponentData;
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
