'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('babel-polyfill');

/**
<メモ>
node.jsのバージョンを8.9.3にあげる

[Error]Uncaught ReferenceError: regeneratorRuntime is not defined
→ 1. import 'babel-polyfill'; 追加
  2. $npm install babel-polyfill

  npm install -s skyway-js
**/

var _scriptPiece = require('../script/piece');

var _scriptPiece2 = _interopRequireDefault(_scriptPiece);

var PieceController = (function () {
  function PieceController(view, notificationMovedPiece, notificationMovedPieceToBar) {
    _classCallCheck(this, PieceController);

    this._view = view;
    this._myPieces = []; // Pieceオブジェクトを格納する
    this._opponentPieces = []; // Pieceオブジェクトを格納する

    this._isMovable = false; // コマを動かせるターンか？

    this._undoList = []; // undo用に移動履歴を保持
    // 移動可能サイコロの目
    // サイコロの目がゾロ目{x, x}の場合、movableDicePipsは{x, x, x, x}とする
    this._movableDicePips = [];

    // コマが移動したことを伝えるメソッド
    this._notificationMovedPiece = notificationMovedPiece;

    this._notificationMovedPieceToBar = notificationMovedPieceToBar;
  }

  _createClass(PieceController, [{
    key: 'initialize',
    value: function initialize() {}
  }, {
    key: 'clear',
    value: function clear() {
      this._isMovable = false; // コマを動かせるターンか？
      this._undoList = []; // undo用に移動履歴を保持
      this._movableDicePips = [];
    }
  }, {
    key: 'setMovableDicePips',
    value: function setMovableDicePips(dicePip1, dicePip2) {
      if (dicePip1 === dicePip2) {
        // ゾロ目の場合
        this._movableDicePips = [dicePip1, dicePip1, dicePip1, dicePip1];
      } else {
        this._movableDicePips = [dicePip1, dicePip2];
      }
    }
  }, {
    key: 'setIsMovable',
    value: function setIsMovable(isMovable) {
      this._isMovable = isMovable;
    }
  }, {
    key: 'appendMyPiece',
    value: function appendMyPiece() {
      var returnValue = [];
      // 自分のコマの位置
      var point = [24, 24, 13, 13, 13, 13, 13, 8, 8, 8, 6, 6, 6, 6, 6];
      for (var i = 0; i <= 14; i++) {
        var position = this._getPiecePosition(point[i], this._myPieces);
        var piece = new _scriptPiece2['default'](position[0], position[1], point[i], true, i);
        piece.initialize();
        var btn = piece.createPieceElement();

        btn.onclick = this._preMovePiece.bind(this, piece);
        returnValue.push(btn);

        this._myPieces.push(piece);
      }
      return returnValue;
    }
  }, {
    key: 'appendOpponentPiece',
    value: function appendOpponentPiece() {
      var returnValue = [];
      // 対戦相手のコマの位置
      var point = [19, 19, 19, 19, 19, 17, 17, 17, 12, 12, 12, 12, 12, 1, 1];

      for (var i = 0; i <= 14; i++) {
        var position = this._getPiecePosition(point[i], this._opponentPieces);
        var piece = new _scriptPiece2['default'](position[0], position[1], point[i], false, i);
        piece.initialize();
        var btn = piece.createPieceElement();

        returnValue.push(btn);

        this._opponentPieces.push(piece);
      }
      return returnValue;
    }
  }, {
    key: '_getPiecePosition',
    value: function _getPiecePosition(point, pieces) {
      // 0番目の要素はダミー
      var base_x = [-1, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
      var base_y = [-1, 573, 525, 478, 433, 386, 340, 242, 195, 148, 101, 55, 9, 9, 55, 101, 148, 195, 242, 340, 386, 433, 478, 525, 573];

      var base = 40;
      if (point <= 12) {
        base = -1 * base;
      }

      var num = 0;
      pieces.forEach(function (value) {
        if (value.getPoint() === point) {
          num++;
        }
      });
      var position_x = base_x[point] + base * num;
      var position_y = base_y[point];
      return [position_x, position_y];
    }
  }, {
    key: '_getBarPiecePosition',
    value: function _getBarPiecePosition(isMoveOpponent) {
      var base_y = 290;
      var base_x;
      var addPositon = 40;
      var pieces;
      if (isMoveOpponent) {
        base_x = 240;
        addPositon *= -1;
        pieces = this._opponentPieces;
      } else {
        base_x = 290;
        pieces = this._myPieces;
      }

      var num = 0;
      pieces.forEach(function (value) {
        if (value.getPoint() === 25) {
          num++;
        }
      });

      var position_x = base_x + addPositon * num;
      return [position_x, base_y];
    }

    // バーにコマが存在するか？
  }, {
    key: '_isExistInBar',
    value: function _isExistInBar() {
      var returnValue = false;
      for (var i = 0; i < this._myPieces.length; i++) {
        if (this._myPieces[i].getPoint() === 25) {
          returnValue = true;
          break;
        }
      }
      return returnValue;
    }
  }, {
    key: '_preMovePiece',
    value: function _preMovePiece(piece) {
      // コマを動かせるターンでない場合は何もしない
      if (this._isMovable === false) {
        return;
      }

      // バーにコマがある場合は、バーのコマした動かせない
      if (piece.getPoint() !== 25 && this._isExistInBar()) {
        // 自身がバー以外のあるコマ かつ バーにコマがある場合は何もしない
        return;
      }

      // 一番上以外のコマを選択した場合も何もしない
      var target = this._getTopPiece(piece.getPoint(), false);
      if (target.getTop() !== piece.getTop()) {
        return;
      }

      // まずは、すでに表示されている移動可能な場所の表示をクリア
      this._clearMovableField();

      // 移動可能な場所を表示
      var currentPoint = piece.getPoint();
      var movablePoints = this._getMovablePoints(currentPoint, this._movableDicePips);
      if (movablePoints.length === 0) {
        // 他のコマに関しても移動可能な箇所がないかをチェック

      } else {
          movablePoints.forEach((function (value) {
            this._showMovablePoint(value, piece);
          }).bind(this));
        }
    }
  }, {
    key: '_isMovablePeiceWithPip',
    value: function _isMovablePeiceWithPip(currentPoint, pip) {
      var returnValue = false;
      var point = currentPoint - pip;
      if (point > 0) {
        // とりあえず、ベアリングオフできないように
        var num = this._numberOfOpponentPeiceOnPoint(point);
        if (num <= 1) {
          returnValue = true; // 移動可能
        }
      }
      return returnValue;
    }

    // 移動の可能性がある移動数を返す
    // (例)
    // 移動可能なサイコロの目が[x,y]の場合[x, y, x+y]を返す
    // -> この場合、x+yは x or y のどちらかが移動可能であることが条件であることに注意
    // 移動可能なサイコロの目が[x,x]の場合[x, x*2, x*3, x*4]を返す
  }, {
    key: '_getMoveableNumberOfMovements',
    value: function _getMoveableNumberOfMovements(movableDicePips) {
      var length = movableDicePips.length;
      var tmpPoints = [];
      var returnValue = [];
      switch (length) {
        case 1:
          returnValue = movableDicePips.slice(0, movableDicePips.length);
          break;
        case 2:
          // 移動できる可能性あるのは{x, y, x+y}の3つ
          returnValue = movableDicePips.slice(0, movableDicePips.length);
          returnValue.push(movableDicePips[0] + movableDicePips[1]);
          break;
        case 3:
        case 4:
          // ゾロ目
          for (var i = 1; i <= length; i++) {
            returnValue.push(movableDicePips[0] * i);
          }
          break;
      }
      return returnValue;
    }

    // サイコロの目に対して、移動できるかを返す
  }, {
    key: 'isMovableMyPiece',
    value: function isMovableMyPiece() {
      // 検査対象のサイコロの目（重複は除く）
      var targetPips = this._movableDicePips.filter(function (x, i, self) {
        return self.indexOf(x) === i;
      });
      // コマがどのPointあるか(重複は除く)
      var targetPiecePoints = [];
      this._myPieces.forEach(function (value) {
        var point = value.getPoint();
        if (targetPiecePoints.indexOf(point) < 0) {
          // 配列に含まれていなかったら追加
          targetPiecePoints.push(point);
        }
      });
      // バーにコマがある場合は検査対象はバーのコマのみにする
      if (this._isExistInBar()) {
        targetPiecePoints = [25];
      }

      // 移動先 = 自分のコマのPoint - サイコロの目
      var movablePoints = [];
      targetPips.forEach(function (pip) {
        targetPiecePoints.forEach(function (point) {
          movablePoints.push(point - pip);
        });
      });

      var returnValue = false;
      // 対戦相手のコマが 0個 or 1個のPoint かつ
      // movablePoints(移動可能先)に含まれる
      var movableOpponentPoints = [];
      for (var i = 1; i <= 24; i++) {
        if (this._numberOfOpponentPeiceOnPoint(i) <= 1) {
          if (movablePoints.indexOf(i) >= 0) {
            returnValue = true;
            break;
          }
        }
      }
      return returnValue;
    }

    // 移動可能なpointを返す
    // currentPoint: 対象のコマのPoint
    // movableDicePips: 移動可能サイコロの目(ゾロ目の場合{x,x,x,x}の場合がある)
  }, {
    key: '_getMovablePoints',
    value: function _getMovablePoints(currentPoint, movableDicePips) {
      var returnMovablePoints = [];
      var numberOfMoving = this._getMoveableNumberOfMovements(movableDicePips);
      var length = numberOfMoving.length;
      switch (length) {
        case 1:
        case 2:
        case 4:
          for (var i = 0; i < length; i++) {
            var isMovable = this._isMovablePeiceWithPip(currentPoint, numberOfMoving[i]);
            if (isMovable == true) {
              returnMovablePoints.push(currentPoint - numberOfMoving[i]);
            } else {
              break;
            }
          }
          break;
        case 3:
          // [x, y, x+y]と[x, x*2, x*3]の2パターン考えられる
          // [x, y, x+y]の場合、 x+yは x or y のどちらかが移動可能であることが前提
          var isMovable1 = this._isMovablePeiceWithPip(currentPoint, numberOfMoving[0]);
          if (isMovable1 == true) {
            returnMovablePoints.push(currentPoint - numberOfMoving[0]);
          }
          var isMovable2 = this._isMovablePeiceWithPip(currentPoint, numberOfMoving[1]);
          if (isMovable2 == true) {
            returnMovablePoints.push(currentPoint - numberOfMoving[1]);
          }
          if (isMovable1 || isMovable2) {
            var isMovable3 = this._isMovablePeiceWithPip(currentPoint, numberOfMoving[2]);
            if (isMovable3 == true) {
              returnMovablePoints.push(currentPoint - numberOfMoving[2]);
            }
          }
          break;
      }
      return returnMovablePoints;
    }

    // 引数で与えたPointにある対戦相手のコマ数を返す
  }, {
    key: '_numberOfOpponentPeiceOnPoint',
    value: function _numberOfOpponentPeiceOnPoint(point) {
      var numOfOpponentPiece = 0;
      this._opponentPieces.forEach(function (value) {
        if (point === value._point) {
          numOfOpponentPiece++;
        }
      });
      return numOfOpponentPiece;
    }

    // 移動可能な位置を表示
  }, {
    key: '_showMovablePoint',
    value: function _showMovablePoint(destinationPoint, piece) {
      // 移動数
      var numberOfMoving = piece.getPoint() - destinationPoint;
      var position = this._getPiecePosition(destinationPoint, this._myPieces);

      // 移動可能位置を表示するボタンを作成(identityNumberは不要なのでダミー)
      var movablePiece = new _scriptPiece2['default'](position[0], position[1], destinationPoint, true, -1);
      movablePiece.initialize();
      var btn = movablePiece.createMovablePieceElement();
      btn.onclick = this._movePiece.bind(this, movablePiece, piece);

      // 表示
      this._view.getElementById("boardArea").appendChild(btn);
    }

    // 引数のpointに対戦相手のPieceが1個の場合、バーに移動させる
  }, {
    key: '_moveOpponentPieceToBar',
    value: function _moveOpponentPieceToBar(point) {
      var returnValue = false;
      if (this._numberOfOpponentPeiceOnPoint(point) === 1) {
        this._opponentPieces.forEach((function (value) {
          if (value.getPoint() === point) {
            var position = this._getBarPiecePosition(true);
            value.move(position[0], position[1], 25);
            // GameViewControllerに通知する
            this._notificationMovedPieceToBar(point);
            // undo用の処理も考えること

            returnValue = true; // 移動させた
          }
        }).bind(this));
      }
      return returnValue;
    }
  }, {
    key: 'getUndoListCount',
    value: function getUndoListCount() {
      return this._undoList.length;
    }
  }, {
    key: 'undo',
    value: function undo() {
      var undoOjb = this._undoList.pop();
      var undoMyPiece = undoOjb.myPiece;
      var target = this._getTopPiece(undoMyPiece.destPoint, false);
      var position = this._getPiecePosition(undoMyPiece.sourcePoint, this._myPieces);
      target.move(position[0], position[1], undoMyPiece.sourcePoint);

      this._movableDicePips.push(undoMyPiece.sourcePoint - undoMyPiece.destPoint);

      // 対戦相手のコマを移動
      if (undoOjb.opponentPiece) {
        var undoOpponentPiece = undoOjb.opponentPiece;
        var _target = this._getTopPiece(undoOpponentPiece.destPoint, true);
        var position = this._getPiecePosition(undoOpponentPiece.sourcePoint, this._myPieces);
        _target.move(position[0], position[1], undoOpponentPiece.sourcePoint);
      }

      // 移動可能な箇所の表示もクリア
      this._clearMovableField();
      return undoOjb;
    }
  }, {
    key: 'undoOpponent',
    value: function undoOpponent(undoObj) {
      var undoOpponentPiece = undoObj.opponentPiece;
      var target = this._getTopPiece(undoOpponentPiece.destPoint, true);
      var position = this._getPiecePosition(undoOpponentPiece.sourcePoint, this._opponentPieces);
      target.move(position[0], position[1], undoOpponentPiece.sourcePoint);

      // 対戦相手(myPiece)の分
      if (undoObj.myPiece) {
        var undoMyPiece = undoObj.myPiece;
        var _target2 = this._getTopPiece(undoMyPiece.destPoint, false);
        var position = this._getPiecePosition(undoMyPiece.sourcePoint, this._opponentPieces);
        _target2.move(position[0], position[1], undoMyPiece.sourcePoint);
      }
    }
  }, {
    key: '_addUndoList',
    value: function _addUndoList(destPoint, sourcePoint, isMoveOpponentPieceToBar) {
      var undoOjb = {
        "myPiece": {
          "destPoint": destPoint,
          "sourcePoint": sourcePoint
        }
      };
      if (isMoveOpponentPieceToBar) {
        undoOjb["opponentPiece"] = {
          "destPoint": 25,
          "sourcePoint": destPoint
        };
      }
      this._undoList.push(undoOjb);
    }
  }, {
    key: '_clearMovableField',
    value: function _clearMovableField() {
      var elements = this._view.getElementsByClassName("movable-field");
      while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
      }
    }

    // piece を movablePiece の位置に移動
  }, {
    key: '_movePiece',
    value: function _movePiece(movablePiece, piece) {
      var point, destPoint, numberOfMoving, index, isMoveOpponentPieceToBar, destTop, destLeft, sumNumberOfMoving, tmp, copyMovableDicePips, i, tmpDestPoint, tmpSourcePoint, position;
      return regeneratorRuntime.async(function _movePiece$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            // まずは、すでに表示されている移動可能な場所の表示をクリア
            this._clearMovableField();
            // やること
            // 1. もし_movableDicePipsの足し算の移動分なら移動は2〜4回分の移動に分ける
            // 1.1 this._movableDicePipsから移動分を削除
            // 2. GameViewControllerに移動を通知
            // 2.1. サイコロの透過度を変更
            // 2.2. 対戦相手にコマの移動を通知
            // 3. undo できるように
            // 3.1 undo用の配列を準備し、操作を戻せるようにする
            // 3.2 undoボタンの表示も行う

            point = piece.getPoint();
            destPoint = movablePiece.getPoint();
            numberOfMoving = point - destPoint;
            index = this._movableDicePips.indexOf(numberOfMoving);

            if (!(index == 0 || index == 1)) {
              context$2$0.next = 15;
              break;
            }

            isMoveOpponentPieceToBar = this._moveOpponentPieceToBar(destPoint);
            destTop = movablePiece.getTop();
            destLeft = movablePiece.getLeft();

            piece.move(destTop, destLeft, destPoint);
            // 移動分を削除
            this._movableDicePips.splice(index, 1);
            // undo配列に追加
            this._addUndoList(destPoint, point, isMoveOpponentPieceToBar);
            // 移動をGameViewControllerに伝える
            this._notificationMovedPiece(destPoint, point);
            context$2$0.next = 36;
            break;

          case 15:
            sumNumberOfMoving = 0;

            // 移動先に相手のコマが2個以上あるのはダメ
            // ヒットするならヒットさせたい
            if (this._numberOfOpponentPeiceOnPoint(point - this._movableDicePips[0]) > 1 || this._numberOfOpponentPeiceOnPoint(point - this._movableDicePips[1]) === 1) {
              tmp = this._movableDicePips[0];

              this._movableDicePips[0] = this._movableDicePips[1];
              this._movableDicePips[1] = tmp;
            }

            // for文での中でthis._movableDicePipsの要素を削除するとインデックスがずれるので
            copyMovableDicePips = this._movableDicePips.concat();
            i = 0;

          case 19:
            if (!(i < copyMovableDicePips.length)) {
              context$2$0.next = 36;
              break;
            }

            sumNumberOfMoving += copyMovableDicePips[i];
            tmpDestPoint = point - sumNumberOfMoving;
            tmpSourcePoint = tmpDestPoint + copyMovableDicePips[i];
            isMoveOpponentPieceToBar = this._moveOpponentPieceToBar(tmpDestPoint);
            position = this._getPiecePosition(tmpDestPoint, this._myPieces);

            // 移動する
            piece.move(position[0], position[1], tmpDestPoint);

            // undo配列に追加
            this._addUndoList(tmpDestPoint, tmpSourcePoint, isMoveOpponentPieceToBar);
            // 移動分を削除
            this._movableDicePips.splice(0, 1);
            // 移動をGameViewControllerに伝える
            this._notificationMovedPiece(tmpDestPoint, tmpSourcePoint);

            if (!(sumNumberOfMoving === numberOfMoving)) {
              context$2$0.next = 31;
              break;
            }

            return context$2$0.abrupt('break', 36);

          case 31:
            context$2$0.next = 33;
            return regeneratorRuntime.awrap(this._sleep(500));

          case 33:
            i++;
            context$2$0.next = 19;
            break;

          case 36:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'movedOpponentPiece',
    value: function movedOpponentPiece(destPoint, sourcePoint) {
      var target = this._getTopPiece(sourcePoint, true);
      var position = this._getPiecePosition(destPoint, this._opponentPieces);
      target.move(position[0], position[1], destPoint);
    }
  }, {
    key: 'movedMyPieceToBar',
    value: function movedMyPieceToBar(destPoint, sourcePoint) {
      var target = this._getTopPiece(sourcePoint, false);
      var position = this._getBarPiecePosition(false);
      target.move(position[0], position[1], destPoint);
    }
  }, {
    key: '_getTopPiece',
    value: function _getTopPiece(point, isOpponent) {
      var pieces = [];
      if (isOpponent) {
        pieces = this._opponentPieces;
      } else {
        pieces = this._myPieces;
      }
      var samePointPieces = [];
      pieces.forEach(function (value) {
        if (value.getPoint() === point) {
          samePointPieces.push(value);
        }
      });
      if (samePointPieces.length === 0) {
        alert("[Error]_getTopPiece()");
      }

      var miniPiece = samePointPieces[0];
      var maxPiece = samePointPieces[0];
      samePointPieces.forEach(function (value) {
        if (value.getPoint() === point) {
          var _top = value.getTop();
          if (miniPiece.getTop() > _top) {
            miniPiece = value;
          }
          if (maxPiece.getTop() < _top) {
            maxPiece = value;
          }
        }
      });

      // Barエリアの場合は特別
      if (point === 25) {
        if (isOpponent) {
          return miniPiece;
        } else {
          return maxPiece;
        }
      }
      // Barエリア以外
      if (point <= 12) {
        return miniPiece;
      } else {
        return maxPiece;
      }
    }
  }, {
    key: '_sleep',
    value: function _sleep(ms) {
      return new Promise(function (resolve) {
        return setTimeout(resolve, ms);
      });
    }
  }]);

  return PieceController;
})();

exports['default'] = PieceController;
module.exports = exports['default'];

// 1. もし_movableDicePipsの足し算の移動分なら移動は2〜4回分の移動に分ける
// 移動数
// _movableDicePipsは、ゾロ目なら[x, x, x, x]、それ以外は[x, y]の配列
// 1回分の移動
// 移動先に対戦相手のPieceが1個だけある場合、バーに移動させる

// 移動する

// 2〜4分の移動

// ヒットしなければindexを事前に入れ替えておく

// 移動先に対戦相手のPieceが1個だけある場合、バーに移動させる

// アニメーションの時間分待つ