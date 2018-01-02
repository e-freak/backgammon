import 'babel-polyfill';
/**
<メモ>
node.jsのバージョンを8.9.3にあげる

[Error]Uncaught ReferenceError: regeneratorRuntime is not defined
→ 1. import 'babel-polyfill'; 追加
  2. $npm install babel-polyfill

  npm install -s skyway-js
**/

import Piece from '../script/piece';

export default class PieceController {

  constructor(view, notificationMovedPiece) {
    this._view = view;
    this._myPieces = []; // Pieceオブジェクトを格納する
    this._opponentPieces = []; // Pieceオブジェクトを格納する

    this._isMovable = false; // コマを動かせるターンか？

    this._undoList = []; // undoするように移動履歴を保持
    // 移動可能サイコロの目
    // サイコロの目がゾロ目{x, x}の場合、movableDicePipsは{x, x, x, x}とする
    this._movableDicePips = [];

    // コマが移動したことを伝えるメソッド
    this._notificationMovedPiece = notificationMovedPiece;
  }

  initialize() {}

  setMovableDicePips(dicePip1, dicePip2) {
    if (dicePip1 === dicePip2) {
      // ゾロ目の場合
      this._movableDicePips = [dicePip1, dicePip1 * 2,
        dicePip1 * 3, dicePip1 * 4
      ];
    } else {
      this._movableDicePips = [dicePip1, dicePip2];
    }
  }
  setIsMovable(isMovable) {
    this._isMovable = isMovable;
  }

  appendMyPiece() {
    var returnValue = [];
    // 自分のコマの位置
    var point = [24, 24, 13, 13, 13, 13, 13, 8, 8, 8, 6, 6, 6, 6, 6];
    for (var i = 0; i <= 14; i++) {
      var position = this._getPiecePosition(point[i], this._myPieces);
      var piece = new Piece(position[0], position[1], point[i], true, i);
      piece.initialize();
      var btn = piece.createPieceElement();

      btn.onclick = this._preMovePiece.bind(this, piece);
      returnValue.push(btn);

      this._myPieces.push(piece);
    }
    return returnValue;
  }

  appendOpponentPiece() {
    var returnValue = [];
    // 対戦相手のコマの位置
    var point = [19, 19, 19, 19, 19, 17, 17, 17, 12, 12, 12, 12, 12, 1, 1];

    for (var i = 0; i <= 14; i++) {
      var position = this._getPiecePosition(point[i], this._opponentPieces);
      var piece = new Piece(position[0], position[1], point[i], false, i);
      piece.initialize();
      var btn = piece.createPieceElement();

      returnValue.push(btn);

      this._opponentPieces.push(piece);
    }
    return returnValue;
  }

  _getPiecePosition(point, pieces) {
    // 0番目の要素はダミー
    var base_x = [-1, 520, 520, 520, 520, 520, 520, 520, 520, 520, 520, 520, 520,
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10
    ];
    var base_y = [-1, 580, 531, 482, 433, 384, 335, 255, 206, 157, 108, 59, 10,
      10, 59, 108, 157, 206, 255, 335, 384, 433, 482, 531, 580
    ];

    var base = 40;
    if (point <= 12) {
      base = -1 * base;
    }

    var num = 0;
    pieces.forEach(function(value) {
      if (value._point === point) {
        num++;
      }
    });
    var position_x = base_x[point] + (base * num);
    var position_y = base_y[point];
    return [position_x, position_y];
  }

  _preMovePiece(piece) {
    // コマを動かせるターンでない場合は何もしない
    if (this._isMovable === false) {
      return;
    }

    // 一番上以外のコマを選択した場合も何もしない
    let target = this._getTopPiece(piece.getPoint(), this._myPieces);
    if (target.getTop() !== piece.getTop()) {
      return;
    }

    // まずは、すでに表示されている移動可能な場所の表示をクリア
    var elements = this._view.getElementsByClassName("movable-field");
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }

    // 移動可能な場所を表示
    var currentPoint = piece.getPoint();
    var movablePoints = this._getMovablePoints(currentPoint, this._movableDicePips);
    if (movablePoints.length === 0) {
      // 他のコマに関しても移動可能な箇所がないかをチェック

    } else {
      movablePoints.forEach(function(value) {
        this._showMovablePoint(value, piece);
      }.bind(this));
    }
  }

  _isMovablePeiceWithPip(currentPoint, pip) {
    var returnValue = false;
    var point = currentPoint - pip;
    if (point > 0) { // とりあえず、ベアリングオフできないように
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
  _getMoveableNumberOfMovements(movableDicePips) {
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

  // 移動可能なpointを返す
  // currentPoint: 対象のコマのPoint
  // movableDicePips: 移動可能サイコロの目(ゾロ目の場合{x,x,x,x}の場合がある)
  _getMovablePoints(currentPoint, movableDicePips) {
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
            returnMovablePoints.push(currentPoint - numberOfMoving[i])
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
          returnMovablePoints.push(currentPoint - numberOfMoving[0])
        }
        var isMovable2 = this._isMovablePeiceWithPip(currentPoint, numberOfMoving[1]);
        if (isMovable2 == true) {
          returnMovablePoints.push(currentPoint - numberOfMoving[1])
        }
        if (isMovable1 || isMovable2) {
          var isMovable3 = this._isMovablePeiceWithPip(currentPoint, numberOfMoving[2]);
          if (isMovable3 == true) {
            returnMovablePoints.push(currentPoint - numberOfMoving[2])
          }
        }
        break;
    }
    return returnMovablePoints;
  }

  // 引数で与えたPointにある対戦相手のコマ数を返す
  _numberOfOpponentPeiceOnPoint(point) {
    var numOfOpponentPiece = 0;
    this._opponentPieces.forEach(function(value) {
      if (point === value._point) {
        numOfOpponentPiece++;
      }
    });
    return numOfOpponentPiece;
  }

  // 移動可能な位置を表示
  _showMovablePoint(destinationPoint, piece) {
    // 移動数
    var numberOfMoving = piece.getPoint() - destinationPoint;
    var position = this._getPiecePosition(destinationPoint, this._myPieces);

    // 移動可能位置を表示するボタンを作成(identityNumberは不要なのでダミー)
    var movablePiece = new Piece(position[0], position[1], destinationPoint, true, -1);
    movablePiece.initialize();
    var btn = movablePiece.createMovablePieceElement();
    btn.onclick = this._movePiece.bind(this, movablePiece, piece);

    // 表示
    this._view.getElementById("board-area").appendChild(btn);
  }

  // 引数のpointに対戦相手のPieceが1個の場合、バーに移動させる
  _moveOpponentPieceToBar(point) {
    var returnValue = false;
    if (this._numberOfOpponentPeiceOnPoint(point) === 1) {
      this._opponentPieces.forEach(function(value) {
        if (value.getPoint === point) {
          value.moveBar();
          // GameViewControllerに通知する
          // undo用の処理も考えること

          returnValue = true; // 移動させた
        }
      });
    }
    return returnValue;
  }

  getUndoListCount() {
    return this._undoList.length;
  }

  undo() {
    let undoOjb = this._undoList.pop();
    let undoMyPiece = undoOjb.myPiece;
    let target = this._getTopPiece(undoMyPiece.destPoint, this._myPieces);
    var position = this._getPiecePosition(undoMyPiece.sourcePoint, this._myPieces);
    target.move(position[0], position[1], undoMyPiece.sourcePoint);

    //
    this._movableDicePips.push(undoMyPiece.sourcePoint - undoMyPiece.destPoint);
    // 対戦相手(opponentPiece)の分はヒット実装後に

    return undoOjb;
  }

  undoOpponent(undoObje) {
    let undoOpponentPiece = undoObje.opponentPiece;
    let target = this._getTopPiece(undoOpponentPiece.destPoint, this._opponentPieces);
    var position = this._getPiecePosition(undoOpponentPiece.sourcePoint, this._opponentPieces);
    target.move(position[0], position[1], undoOpponentPiece.sourcePoint);

    // 対戦相手(myPiece)の分はヒット実装後に

  }
  _addUndoList(destPoint, sourcePoint, isMoveOpponentPieceToBar) {
    var undoOjb = {
      "myPiece": {
        "destPoint": destPoint,
        "sourcePoint": sourcePoint
      }
    };
    if (isMoveOpponentPieceToBar) {
      undoOjb["opponentPiece"] = {
        "destPoint": -1,
        "sourcePoint": destPoint
      }
    }
    this._undoList.push(undoOjb);
  }


  // piece を movablePiece の位置に移動
  async _movePiece(movablePiece, piece) {
    // まずは、すでに表示されている移動可能な場所の表示をクリア
    var elements = this._view.getElementsByClassName("movable-field");
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
    // やること
    // 1. もし_movableDicePipsの足し算の移動分なら移動は2〜4回分の移動に分ける
    // 1.1 this._movableDicePipsから移動分を削除
    // 2. GameViewControllerに移動を通知
    // 2.1. サイコロの透過度を変更
    // 2.2. 対戦相手にコマの移動を通知
    // 3. undo できるように
    // 3.1 undo用の配列を準備し、操作を戻せるようにする
    // 3.2 undoボタンの表示も行う

    var point = piece.getPoint();
    var destPoint = movablePiece.getPoint();


    // 1. もし_movableDicePipsの足し算の移動分なら移動は2〜4回分の移動に分ける
    var numberOfMoving = point - destPoint; // 移動数
    var index = this._movableDicePips.indexOf(numberOfMoving);

    if (index >= 0) { // 1回分の移動
      // 移動先に対戦相手のPieceが1個だけある場合、バーに移動させる
      let isMoveOpponentPieceToBar = this._moveOpponentPieceToBar(destPoint);
      // 移動する
      let destTop = movablePiece.getTop();
      let destLeft = movablePiece.getLeft();
      piece.move(destTop, destLeft, destPoint);
      // 移動をGameViewControllerに伝える
      this._notificationMovedPiece(destPoint, point);

      // 移動分を削除
      this._movableDicePips.splice(index, 1);
      // undo配列に追加
      this._addUndoList(destPoint, point, isMoveOpponentPieceToBar);
    } else {
      // 2〜4分の移動
      var sumNumberOfMoving = 0;
      // 移動先に相手のコマが2個以上あるのはダメ
      // ヒットするならヒットさせたい
      if (this._numberOfOpponentPeiceOnPoint(point - this._movableDicePips[0]) > 1 ||
        this._numberOfOpponentPeiceOnPoint(point - this._movableDicePips[1]) === 1) {
        // ヒットしなければindexを事前に入れ替えておく
        let tmp = this._movableDicePips[0];
        this._movableDicePips[0] = this._movableDicePips[1];
        this._movableDicePips[1] = tmp;
      }

      var delNum = 0; // _movableDicePipsの先頭から何個の要素を削除するか
      for (var i = 0; i < this._movableDicePips.length; i++) {
        delNum++;
        sumNumberOfMoving += this._movableDicePips[i];
        let tmpDestPoint = point - sumNumberOfMoving;
        let tmpSourcePoint = tmpDestPoint + this._movableDicePips[i];
        // 移動先に対戦相手のPieceが1個だけある場合、バーに移動させる
        let isMoveOpponentPieceToBar = this._moveOpponentPieceToBar(tmpDestPoint);
        let position = this._getPiecePosition(tmpDestPoint, this._myPieces);
        // 移動する
        piece.move(position[0], position[1], tmpDestPoint);

        // 移動をGameViewControllerに伝える
        this._notificationMovedPiece(tmpDestPoint, tmpSourcePoint);
        // // 移動分を削除
        // this._movableDicePips.splice(i, 1);
        // undo配列に追加
        this._addUndoList(tmpDestPoint, tmpSourcePoint, isMoveOpponentPieceToBar);

        // アニメーションの時間分待つ
        await this._sleep(500);

        if (sumNumberOfMoving === numberOfMoving) {
          this._movableDicePips.splice(0, delNum);
          break;
        }
      }
    }
  }

  movedOpponentPiece(destPoint, sourcePoint) {
    let target = this._getTopPiece(sourcePoint, this._opponentPieces);
    var position = this._getPiecePosition(destPoint, this._opponentPieces);
    target.move(position[0], position[1], destPoint);
  }

  _getTopPiece(point, pieces) {
    let samePointPieces = [];
    pieces.forEach(function(value) {
      if (value.getPoint() === point) {
        samePointPieces.push(value);
      }
    });
    if (samePointPieces.length === 0) {
      alert("[Error]_getTopPiece()");
    }

    var miniPiece = samePointPieces[0];
    var maxPiece = samePointPieces[0];
    samePointPieces.forEach(function(value) {
      if (value.getPoint() === point) {
        let top = value.getTop();
        if (miniPiece.getTop() > top) {
          miniPiece = value;
        }
        if (maxPiece.getTop() < top) {
          maxPiece = value;
        }
      }
    });

    if (point <= 12) {
      return miniPiece;
    } else {
      return maxPiece;
    }
  }


  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
