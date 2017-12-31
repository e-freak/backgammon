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
  }

  initialize() {
    this._pipElement = this._view.getElementById('my-pipCount');
    this._timeElement = this._view.getElementById('my-timeLimit');
  }

  startTime() {
      this._timeLimit--;
      var id = setTimeout(this.startTime.bind(this), 1000);
      if(this._isTurn === false){　
        this._isTurn = true; // ここでtrueにするの微妙。。。
        clearTimeout(id);　//idをclearTimeoutで指定している
      }
      var min = String(Math.floor(this._timeLimit/60));
      var second = String(this._timeLimit%60);
      this._timeElement.innerText  = min + ":" + second;
  }

  stopTime() {
    this._isTurn = false;
  }

  updatePipNumber(num) {
    this._pipCount += num;
    this._pipElement.innerText  = String(this._pipCount);
  }

}
