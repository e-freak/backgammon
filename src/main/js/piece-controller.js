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

  constructor(view, notificationMovedPiece, notificationMovedPieceToBar) {
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

  initialize() {}

  clear() {
    this._isMovable = false; // コマを動かせるターンか？
    this._undoList = []; // undo用に移動履歴を保持
    this._movableDicePips = [];
  }

  setMovableDicePips(dicePip1, dicePip2) {
    if (dicePip1 === dicePip2) {
      // ゾロ目の場合
      this._movableDicePips = [dicePip1, dicePip1, dicePip1, dicePip1];
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
    // テスト用
    // var point = [7, 7, 7, 6, 6, 6, 6, 6, 5, 5, 5, 5, 2, 1, 1];

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
    // テスト用
    // var point = [25 - 7, 25 - 7, 25 - 7, 25 - 6, 25 - 6, 25 - 6, 25 - 6, 25 - 6, 25 - 5, 25 - 5, 25 - 5, 25 - 5, 25 - 2, 25 - 1, 25 - 1];

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
    // 0番目の要素は、ベアオフ用
    var base_x = [512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512,
      20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20
    ];
    var base_y = [636, 573, 525, 478, 433, 386, 340, 242, 195, 148, 101, 55, 9,
      9, 55, 101, 148, 195, 242, 340, 386, 433, 478, 525, 573
    ];

    // ベアオフの場合は被るようにする
    var base = (point === 0) ? 10 : 40;
    //var base = 40;
    if (point <= 12) {
      base = -1 * base;
    }

    var num = 0;
    pieces.forEach(function(value) {
      if (value.getPoint() === point) {
        num++;
      }
    });
    var position_x = base_x[point] + (base * num);
    var position_y = base_y[point];
    return [position_x, position_y];
  }

  _getBarPiecePosition(isMoveOpponent) {
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
    pieces.forEach(function(value) {
      if (value.getPoint() === 25) {
        num++;
      }
    });

    let position_x = base_x + (addPositon * num);
    return [position_x, base_y];
  }

  // バーにコマが存在するか？ → _isExistInPoint()を使うように
  _isExistInBar() {
    var returnValue = false;
    for (let i = 0; i < this._myPieces.length; i++) {
      if ((this._myPieces[i]).getPoint() === 25) {
        returnValue = true;
        break;
      }
    }
    return returnValue;
  }

  _preMovePiece(piece) {
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
    let target = this._getTopPiece(piece.getPoint(), false);
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
      movablePoints.forEach(function(value) {
        // valueが0以下ならベアオフ, destPointを0にする
        let destPoint = (value <= 0) ? 0 : value;
        this._showMovablePoint(destPoint, piece);
      }.bind(this));
    }

    // 移動可能場所が1つなら強制的に移動させてしまう。
    var elements = this._view.getElementsByClassName("movable-field-button");
    if (elements.length === 1){
      elements[0].click();
    }

  }

  _isMovablePeiceWithPip(currentPoint, pip, preMovablePoints) {
    var returnValue = false;
    var point = currentPoint - pip;
    var lastPiecePoint = this._getLastPiecePoint(); // 一番後ろにあるPoint
    if (point > 0) { // ベアリングオフ以外
      var num = this._numberOfOpponentPeiceOnPoint(point);
      if (num <= 1) {
        returnValue = true; // 移動可能
      }
    } else if (lastPiecePoint <= 6) { // 自分の駒がすべて自分のインナーにある時
      if (point === 0) {
        returnValue = true; // 移動可能
      } else {
        // 出た目の位置に駒が無くて、さらにそのうしろにも駒が無い場合
        let isExistInPoint = this._isExistInPoint(pip);
        if (this._movableDicePips.indexOf(pip) !== -1){ // 1回分の移動の場合
          if (isExistInPoint === false &&
            lastPiecePoint === currentPoint) {
            returnValue = true; // 移動可能
          }
        }else{ // 複数回の移動の場合
          returnValue = true;
          var min = Math.min.apply(null, preMovablePoints);
          var numOfPieceInCurrentPoint = 0;
          this._myPieces.forEach(function(value) {
            if (value.getPoint() === currentPoint) {
              numOfPieceInCurrentPoint++;
            }
          });
          if (numOfPieceInCurrentPoint === 1){ //自分自身しかない
            this._myPieces.forEach(function(value) {
              if ((value.getPoint() !== currentPoint) && (value.getPoint() >= min)) { // preMovablePointsですら一番最後
                returnValue = false;
              }
            });
          }else {
            returnValue = false;
          }
        }
      }
    }

    // currentPointに1つしか駒がなく、それ以外の駒がすべて自分のインナーにある時

    return returnValue;
  }

  // 一番後ろにあるコマのPoint
  _getLastPiecePoint() {
    var lastPoint = 0;
    this._myPieces.forEach(function(value) {
      if (value.getPoint() >= lastPoint) {
        lastPoint = value.getPoint();
      }
    });
    return lastPoint;
  }

  // 引数のPointに自分のコマがあるか？
  _isExistInPoint(point) {
    var returnValue = false;
    for (let i = 0; i < this._myPieces.length; i++) {
      if (this._myPieces[i].getPoint() === point) {
        returnValue = true;
        break;
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

  // サイコロの目に対して、移動できるかを返す
  isMovableMyPiece() {
    // 検査対象のサイコロの目（重複は除く）
    var targetPips = this._movableDicePips.filter(function(x, i, self) {
      return self.indexOf(x) === i;
    });
    // コマがどのPointあるか(重複は除く)
    var targetPiecePoints = [];
    this._myPieces.forEach(function(value) {
      var point = value.getPoint();
      if (targetPiecePoints.indexOf(point) < 0) { // 配列に含まれていなかったら追加
        targetPiecePoints.push(point);
      }
    });
    // バーにコマがある場合は検査対象はバーのコマのみにする
    if (this._isExistInBar()) {
      targetPiecePoints = [25];
    }

    var isBearOff = true;
    // 移動先 = 自分のコマのPoint - サイコロの目
    var movablePoints = [];
    targetPips.forEach(function(pip) {
      targetPiecePoints.forEach(function(point) {
        movablePoints.push(point - pip);
        if (point - pip > 0){
          isBearOff = false;
        }
      });
    });

    // ベアオフできる = 移動可能
    if (movablePoints.length !==0 && isBearOff) {
      return true;
    }

    var returnValue = false;
    // 対戦相手のコマが 0個 or 1個のPoint かつ
    // movablePoints(移動可能先)に含まれる
    var movableOpponentPoints = [];
    for (let i = 1; i <= 24; i++) {
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
  _getMovablePoints(currentPoint, movableDicePips) {
    var returnMovablePoints = [];
    var numberOfMoving = this._getMoveableNumberOfMovements(movableDicePips);
    var length = numberOfMoving.length;
    switch (length) {
      case 1:
      case 2:
      case 4:
        for (var i = 0; i < length; i++) {
          var isMovable = this._isMovablePeiceWithPip(currentPoint, numberOfMoving[i], returnMovablePoints);
          if (isMovable == true) {
            returnMovablePoints.push(currentPoint - numberOfMoving[i])
          } else {
            break;
          }
        }
        break;
      case 3:
        // // [x, y, x+y]と[x, x*2, x*3]の2パターン考えられる
        // // [x, y, x+y]の場合、 x+yは x or y のどちらかが移動可能であることが前提
        // var isMatchingDice = numberOfMoving[0] === numberOfMoving[1];

        var isMovableList = [];
        for (var i = 0; i < numberOfMoving.length; i++) {
          isMovableList[i] = this._isMovablePeiceWithPip(currentPoint, numberOfMoving[i], returnMovablePoints);
          if (isMovableList[i]) {
            returnMovablePoints.push(currentPoint - numberOfMoving[i]);
          } else {
//            if (isMatchingDice) {
              break;
//            }
          }
          if (i === 1) {
            if (!(isMovableList[0] || isMovableList[1])) {
              break;
            }
          }
        }
        break;
    }

    // 重複分を削除(0が重複している可能性がある)
    var returnMovablePointsFilter = returnMovablePoints.filter(function(x, i, self) {
      return self.indexOf(x) === i;
    });
    return returnMovablePointsFilter;
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
    this._view.getElementById("boardArea").appendChild(btn);
  }

  // 引数のpointに対戦相手のPieceが1個の場合、バーに移動させる
  _moveOpponentPieceToBar(point) {
    // ベアオフの場合はバーに移動させない
    // 自分と対戦相手のベアオフエリアのPointは両方0なので
    if (point === 0) {
      return false;
    }
    var returnValue = false;
    if (this._numberOfOpponentPeiceOnPoint(point) === 1) {
      this._opponentPieces.forEach(function(value) {
        if (value.getPoint() === point) {
          var position = this._getBarPiecePosition(true);
          value.move(position[0], position[1], 25);
          // GameViewControllerに通知する
          this._notificationMovedPieceToBar(point);
          // undo用の処理も考えること

          returnValue = true; // 移動させた
        }
      }.bind(this));
    }
    return returnValue;
  }

  getUndoListCount() {
    return this._undoList.length;
  }

  undo() {
    let undoOjb = this._undoList.pop();
    let undoMyPiece = undoOjb.myPiece;
    let target = this._getTopPiece(undoMyPiece.destPoint, false);
    var position = this._getPiecePosition(undoMyPiece.sourcePoint, this._myPieces);
    target.move(position[0], position[1], undoMyPiece.sourcePoint);

    this._movableDicePips.push(undoMyPiece.sourcePoint - undoMyPiece.destPoint);

    // 対戦相手のコマを移動
    if (undoOjb.opponentPiece) {
      let undoOpponentPiece = undoOjb.opponentPiece;
      let target = this._getTopPiece(undoOpponentPiece.destPoint, true);
      var position = this._getPiecePosition(undoOpponentPiece.sourcePoint, this._myPieces);
      target.move(position[0], position[1], undoOpponentPiece.sourcePoint);
    }

    // 移動可能な箇所の表示もクリア
    this._clearMovableField();
    return undoOjb;
  }

  undoOpponent(undoObj) {
    let undoOpponentPiece = undoObj.opponentPiece;
    // if (undoOpponentPiece.destPoint === 0)
    let target = this._getTopPiece(undoOpponentPiece.destPoint, true);
    var position = this._getPiecePosition(undoOpponentPiece.sourcePoint, this._opponentPieces);
    target.move(position[0], position[1], undoOpponentPiece.sourcePoint);

    // 対戦相手(myPiece)の分
    if (undoObj.myPiece) {
      let undoMyPiece = undoObj.myPiece;
      let target = this._getTopPiece(undoMyPiece.destPoint, false);
      var position = this._getPiecePosition(undoMyPiece.sourcePoint, this._opponentPieces);
      target.move(position[0], position[1], undoMyPiece.sourcePoint);
    }
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
        "destPoint": 25,
        "sourcePoint": destPoint
      }
    }
    this._undoList.push(undoOjb);
  }

  _clearMovableField() {
    var elements = this._view.getElementsByClassName("movable-field-button");
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  }

  // ベアエリアのコマを後方に移動しておく
  _bringBackwardBearPiece() {
    var parentElement = this._view.getElementById("boardArea")

    var elements = this._view.getElementsByClassName("piece-field-button");
    var elementsList = Array.prototype.slice.call(elements);

    var tmp1 = [];
    var tmp2 = [];
    for (var i = 0; i < elementsList.length; i++) {
      if (elementsList[i].style.left === "636px") {
        tmp1.push(elementsList[i]);
      } else {
        tmp2.push(elementsList[i]);
      }
    }
    tmp1 = tmp1.concat(tmp2);
    for (var i = 0; i < tmp1.length; i++) {
      parentElement.appendChild(parentElement.removeChild(tmp1[i]))
    }
  }
  // piece を movablePiece の位置に移動
  async _movePiece(movablePiece, piece) {
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

    var point = piece.getPoint();
    var destPoint = movablePiece.getPoint();

    // ベアオフの場合、コマの画像が被るので DOM ツリーを更新して
    // ベアエリアのコマを後方に移動しておく
    if (destPoint === 0) {
      this._bringBackwardBearPiece();
      await this._sleep(50);
    }
    if (destPoint < 0) {
      alert("destPoint が マイナスになるのはおかしい");
    }


    // 1. もし_movableDicePipsの足し算の移動分なら移動は2〜4回分の移動に分ける
    var numberOfMoving = point - destPoint; // 移動数
    // _movableDicePipsは、ゾロ目なら[x, x, x, x]、それ以外は[x, y]の配列
    var index = this._movableDicePips.indexOf(numberOfMoving);

    // 以下のルール用の処理
    // もし出た目の位置に駒が無くて、さらにそのうしろにも駒が無い場合には、一番後ろにある駒を上げることが出来る
    var isContainAddition = false;
    var sum = 0;
    switch (this._movableDicePips.length) {
      case 2:
        sum = this._movableDicePips[0] + this._movableDicePips[1];
        isContainAddition = (sum === numberOfMoving)
        break;
      case 3:
        isContainAddition = (numberOfMoving%this._movableDicePips[0] === 0)
        break;
      case 4:
        isContainAddition = (numberOfMoving%this._movableDicePips[0] === 0)
        break;
    }

    if (isContainAddition === false && index === -1) {
      let destTop = movablePiece.getTop();
      let destLeft = movablePiece.getLeft();
      piece.move(destTop, destLeft, destPoint);
      // 移動分を削除
      this._movableDicePips.splice(0, 1); // どれを削除しても同じだろう
      // undo配列に追加
      this._addUndoList(destPoint, point, false);
      // 移動をGameViewControllerに伝える
      this._notificationMovedPiece(destPoint, point);
    } else if (index == 0 || index == 1) { // 1回分の移動
      // 移動先に対戦相手のPieceが1個だけある場合、バーに移動させる
      let isMoveOpponentPieceToBar = this._moveOpponentPieceToBar(destPoint);
      // 移動する
      let destTop = movablePiece.getTop();
      let destLeft = movablePiece.getLeft();
      piece.move(destTop, destLeft, destPoint);
      // 移動分を削除
      this._movableDicePips.splice(index, 1);
      // undo配列に追加
      this._addUndoList(destPoint, point, isMoveOpponentPieceToBar);
      // 移動をGameViewControllerに伝える
      this._notificationMovedPiece(destPoint, point);
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

      // for文での中でthis._movableDicePipsの要素を削除するとインデックスがずれるので
      var copyMovableDicePips = this._movableDicePips.concat();
      for (var i = 0; i < copyMovableDicePips.length; i++) {
        sumNumberOfMoving += copyMovableDicePips[i];
        let tmpDestPoint = point - sumNumberOfMoving;
        let tmpSourcePoint = tmpDestPoint + copyMovableDicePips[i];
        // 移動先に対戦相手のPieceが1個だけある場合、バーに移動させる
        let isMoveOpponentPieceToBar = this._moveOpponentPieceToBar(tmpDestPoint);
        let position = this._getPiecePosition(tmpDestPoint, this._myPieces);
        // 移動する
        piece.move(position[0], position[1], tmpDestPoint);

        // undo配列に追加
        this._addUndoList(tmpDestPoint, tmpSourcePoint, isMoveOpponentPieceToBar);
        // 移動分を削除
        this._movableDicePips.splice(0, 1);
        // 移動をGameViewControllerに伝える
        this._notificationMovedPiece(tmpDestPoint, tmpSourcePoint);

        if (sumNumberOfMoving === numberOfMoving) {
          break;
        }
        // アニメーションの時間分待つ
        await this._sleep(500);
      }
    }
  }

  async movedOpponentPiece(destPoint, sourcePoint) {
    let target = this._getTopPiece(sourcePoint, true);
    var position = this._getPiecePosition(destPoint, this._opponentPieces);
    var top = position[0];
    if (destPoint == 0) {
      top = 532 - top;
    }

    // ベアオフの場合、コマの画像が被るので DOM ツリーを更新して
    // ベアエリアのコマを後方に移動しておく
    if (destPoint === 0) {
      this._bringBackwardBearPiece();
      await this._sleep(50);
    }

    target.move(top, position[1], destPoint);
  }

  movedMyPieceToBar(destPoint, sourcePoint) {
    let target = this._getTopPiece(sourcePoint, false);
    var position = this._getBarPiecePosition(false);
    target.move(position[0], position[1], destPoint);
  }

  _getTopPiece(point, isOpponent) {
    var pieces = [];
    if (isOpponent) {
      pieces = this._opponentPieces;
    } else {
      pieces = this._myPieces;
    }
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

    // ベアオフエリアの場合は特別
    if (point === 0) {
      if (isOpponent) {
        return maxPiece;
      } else {
        return miniPiece;
      }
    }
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

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
