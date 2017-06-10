export default class GameViewController {
    
    constructor(view) {
        this._view = view;
        this._count = 0;
    }
    
    initialize() {
        this._shakeDice();
    }
    
    _shakeDice() {
        if (this._count > 20){
            this.count = 0;
            return 0;
        }
        var dicePip = Math.floor(Math.random() * 6) + 1;        // 1から6までの適当な数字
        var diceImage = dicePip + ".png";                         // 画像ファイル名生成
         this._view.getElementById('dice').innerHTML = "<img src='../image/dice" + diceImage + "' width='64' height='64'>";
        this._count++;
        setTimeout(this._shakeDice.bind(this), 50);  // 50ミリ秒間隔で表示切り替え
    }
}

