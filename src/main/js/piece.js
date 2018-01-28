export default class Piece {

  constructor(top, left, point, isMyPiece, identityNumber) {
    this._top = top;
    this._left = left;
    this._isMyPiece = isMyPiece; // 自分のコマ(True) or 相手のコマ(False)
    this._point = point // ゴールから数えてx番目のポイント（右下が1ポイント）
    this._isMove = false; // Move可能

    this._identityNumber = identityNumber; // コマを1意に判定できる番号
    this._btn;

    this._image;
  }

  getIsMyPiece() {
    return this._isMyPiece;
  }

  getTop() {
    return this._top;
  }

  getLeft() {
    return this._left;
  }

  getPoint() {
    return this._point;
  }

  move(top, left, point) {
    this._top = top;
    this._left = left;
    this._point = point

    this._btn.style.top = top + "px";
    this._btn.style.left = left + "px";
    this._point = point;
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
    this._btn.className = "piece-field-button";
    this._btn.style.top = this._top + "px";
    this._btn.style.left = this._left + "px";

    var img = document.createElement("img");
    img.src = this._image.src;
    img.className = "piece-field";
    this._btn.appendChild(img);

    return this._btn;
  }

  // 移動可能コマのElementを生成して返す
  createMovablePieceElement() {
    this._btn = document.createElement("button");
    this._btn.type = 'button';
    this._btn.className = "movable-field-button";
    this._btn.style.top = this._top + "px";
    this._btn.style.left = this._left + "px";

    var img = document.createElement("img");
    img.src = this._image.src;
    img.className = "move-piece-field";
    this._btn.appendChild(img);

    return this._btn;
  }
}
