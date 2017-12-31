export default class Piece {

  constructor(top, left, point, isMyPiece) {
    this._top = top;
    this._left = left;
    this._isMyPiece = isMyPiece; // 自分のコマ(True) or 相手のコマ(False)
    this._point = point // ゴールから数えてx番目のポイント（右下が1ポイント）
    this._isMove = false; // Mode可能
    this._btn;

    this._image;
  }

  initialize() {
    // コマの画像を設定
    this._image = new Image();
    if (this._isMyPiece === true) {
      this._image.src = "../image/my_piece.png";
    } else {
      this._image.src = "../image/opponent_piece.png";
    }
  }

  // コマのElementを生成して返す
  createPieceElement() {
    this._btn = document.createElement("button");
    this._btn.type = 'button';
    this._btn.className = "piece-field";
    this._btn.style.top = this._top;
    this._btn.style.left = this._left;

    var img = document.createElement("img");
    img.src = this._image.src;
    img.className = "piece-field";
    this._btn.appendChild(img);

    return this._btn;
  }
  
}
