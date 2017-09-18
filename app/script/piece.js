"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Piece = (function () {
  function Piece(top, left, point, isMyPiece) {
    _classCallCheck(this, Piece);

    this._top = top;
    this._left = left;
    this._isMyPiece = isMyPiece; // 自分のコマ(True) or 相手のコマ(False)
    this._point = point; // ゴールから数えてx番目のポイント（右下が1ポイント）
    this._isMove = false; // Mode可能
    this._btn;

    this._image;
  }

  _createClass(Piece, [{
    key: "initialize",
    value: function initialize() {
      // コマの画像を設定
      this._image = new Image();
      if (this._isMyPiece === true) {
        this._image.src = "../image/my_piece.png";
      } else {
        this._image.src = "../image/opponent_piece.png";
      }
    }

    // コマのElementを生成して返す
  }, {
    key: "createPieceElement",
    value: function createPieceElement() {
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
  }]);

  return Piece;
})();

exports["default"] = Piece;
module.exports = exports["default"];