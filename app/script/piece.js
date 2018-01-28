"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Piece = (function () {
  function Piece(top, left, point, isMyPiece, identityNumber) {
    _classCallCheck(this, Piece);

    this._top = top;
    this._left = left;
    this._isMyPiece = isMyPiece; // 自分のコマ(True) or 相手のコマ(False)
    this._point = point; // ゴールから数えてx番目のポイント（右下が1ポイント）
    this._isMove = false; // Move可能

    this._identityNumber = identityNumber; // コマを1意に判定できる番号
    this._btn;

    this._image;
  }

  _createClass(Piece, [{
    key: "getIsMyPiece",
    value: function getIsMyPiece() {
      return this._isMyPiece;
    }
  }, {
    key: "getTop",
    value: function getTop() {
      return this._top;
    }
  }, {
    key: "getLeft",
    value: function getLeft() {
      return this._left;
    }
  }, {
    key: "getPoint",
    value: function getPoint() {
      return this._point;
    }
  }, {
    key: "move",
    value: function move(top, left, point) {
      this._top = top;
      this._left = left;
      this._point = point;

      this._btn.style.top = top + "px";
      this._btn.style.left = left + "px";
      this._point = point;
    }
  }, {
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
  }, {
    key: "createMovablePieceElement",
    value: function createMovablePieceElement() {
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
  }]);

  return Piece;
})();

exports["default"] = Piece;
module.exports = exports["default"];