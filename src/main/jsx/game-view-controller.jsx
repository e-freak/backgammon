export default class GameViewController {
    
    constructor(view) {
        this._view = view;
        this._imageMyDiceResource = [];
        this._imageOpponentDiceResource = [];
        this._imageMyPiece;
        this._imageOpponentPiece;
        this._count = 0;
    }
    
    // とりあえずの実装。設計は後から考える
    initialize() {
        this._loadImages();     // 画像をロードしておく
        this._updateToStartUI();        // ゲーム開始画面のUIに更新する(コマを配る, サイコロの表示/非表示の設定とか)
        this._shakeDice();      // サイコロ画像を切り替えて振ってる風に見せる
    }
    
    _loadImages() {
        // サイコロの画像
        for (var i = 1; i <= 6; i++) {
            // ArrayのIndex=サイコロの目(0は使用しない)
            this._imageMyDiceResource[i] = new Image();
            this._imageMyDiceResource[i].src = "../image/dice/dice" + i + ".png";
            this._imageOpponentDiceResource[i] = new Image();
            this._imageOpponentDiceResource[i].src = "../image/dice/dice" + i + ".png";
        }
        // コマの画像
        this._imageMyPiece = new Image();
        this._imageMyPiece.src =  "../image/my_piece.png";
        this._imageOpponentPiece = new Image();
        this._imageOpponentPiece.src = "../image/opponent_piece.png";
    }
    
    _updateToStartUI() {
        // コマを配りたい
        this._appendPiece();
        
        // ゲーム開始時は、サイコロは2つだけ表示する
        // (自分のサイコロ/対戦相手のサイコロを1つずつ表示)
        this._view.getElementById('my-firstDice-image').style.display="block"     // 表示
        this._view.getElementById('my-secoundDice-image').style.display="none"     // 非表示
        this._view.getElementById('opponent-firstDice-image').style.display="block"     // 表示
        this._view.getElementById('opponent-secoundDice-image').style.display="none"     // 非表示
        
    }
    _appendPiece() {
        // 自分のコマの位置（後から指定方法を考える）
        var topPosition = ["10px",      "50px",     "10px",     "50px",     "90px",     "130px",    "170px",   "520px", "480px",    "440px",    "520px",    "480px",    "440px",    "400px",    "360px"];
        var leftPosition = ["580px",    "580px",    "10px",     "10px",     "10px",     "10px",     "10px",     "208px", "208px",   "208px",    "335px",    "335px",    "335px",    "335px",    "335px"];
        for (var i = 0; i <= 14; i++) {
            var img = document.createElement("img");
            img.src = this._imageMyPiece.src;
            img.className = "piece-field";
            img.style.top = topPosition[i];
            img.style.left = leftPosition[i];
            var tmp = this._view.getElementById("board-area");
            this._view.getElementById("board-area").appendChild(img);
        }

        // 対戦相手のコマの位置（後から指定方法を考える）
        var topPosition = ["10px",      "50px",     "90px",     "130px",     "170px",     "10px",    "50px",     "90px",    "520px",    "480px",    "440px",    "400px",    "360px",    "520px",    "480px"];
        var leftPosition = ["335px",    "335px",    "335px",    "335px",     "335px",     "208px",  "208px",  "208px",  "10px",      "10px",      "10px",      "10px",      "10px",      "580px",    "580px"];

        for (var i = 0; i <= 14; i++) {
            var img = document.createElement("img");
            img.src = this._imageOpponentPiece.src;
            img.className = "piece-field";
            img.style.top = topPosition[i];
            img.style.left = leftPosition[i];
            var tmp = this._view.getElementById("board-area");
            this._view.getElementById("board-area").appendChild(img);
        }
        
    }
    _shakeDice() {
        if (this._count > 20){  // 抜け方は後で考える。とりえず手っ取り早い方法で実現
            this.count = 0;
            return 0;
        }
        var dicePip = Math.ceil(Math.random() * 6);        // 1から6までの適当な数字
        this._view.getElementById('my-firstDice-image').src = this._imageMyDiceResource[dicePip].src;

        dicePip = Math.ceil(Math.random() * 6);
        this._view.getElementById('opponent-firstDice-image').src = this._imageOpponentDiceResource[dicePip].src;
        
        this._count++;
        setTimeout(this._shakeDice.bind(this), 50);  // 50ミリ秒間隔で表示切り替え
    }
}

