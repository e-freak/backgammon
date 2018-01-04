//  http://nttcom.github.io/skyway/docs/
//  https://qiita.com/daisaru11/items/52c10514ba2fa2dd1b87

// http://shared-blog.kddi-web.com/test/skyway/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _scriptUserSettingController = require('../script/user-setting-controller');

var _scriptUserSettingController2 = _interopRequireDefault(_scriptUserSettingController);

var Peer = require('skyway-js');
var SkyWay_ApiKey = '46fe641a-df1c-42da-b45b-4061347deb7b';

var PeerController = (function () {
  function PeerController(receivedMessageToGameViewController) {
    _classCallCheck(this, PeerController);

    this.onOpen = this.onOpen.bind(this);
    this.onConnection = this.onConnection.bind(this);
    this.onConnectionOpen = this.onConnectionOpen.bind(this);
    this.onReceivedData = this.onReceivedData.bind(this);

    this._userSettingController = new _scriptUserSettingController2['default']();

    // メッセージを受信通知を送るメソッド
    this.receivedMessage = receivedMessageToGameViewController;
  }

  _createClass(PeerController, [{
    key: 'initialize',
    value: function initialize() {
      var peer = new Peer({
        key: SkyWay_ApiKey,
        debug: 3
      });
      peer.on('open', this.onOpen);
      peer.on('connection', this.onConnection);
      this._peer = peer;

      this._userSettingController.initialize();
    }
  }, {
    key: 'onOpen',
    value: function onOpen() {
      // 1対1の接続を想定
      // アクティブなPeerIDが2つなら、自分以外のPeerIDに接続
      this._peer.listAllPeers((function (list) {
        if (list.length === 2) {
          // 接続（自分より前に接続しているIDのindexは、きっと0だろう。。）
          var conn = this._peer.connect(list[0]);
          conn.on('open', this.onConnectionOpen);
          this._conn = conn;
        }
      }).bind(this));
    }

    // 接続イベントの受信
  }, {
    key: 'onConnection',
    value: function onConnection(conn) {
      this._conn = conn;
      conn.on('data', this.onReceivedData);
    }

    // コネクションが利用可能になった
  }, {
    key: 'onConnectionOpen',
    value: function onConnectionOpen(conn) {
      this._conn.on('data', this.onReceivedData);
      // とりあえず送信してみる
      this._sendUserNameAndIcon();
    }

    // メッセージを受信
  }, {
    key: 'onReceivedData',
    value: function onReceivedData(data) {
      var message = data.message;
      if (message === "userNameAndIcon") {
        this._receivedUserNameAndIcon();
      } else if (message === "answerUserNameAndIcon") {} else {}
      this.receivedMessage(data);
    }
  }, {
    key: 'sendFirstDices',
    value: function sendFirstDices(senderPip, receiverPip) {
      var obj = {
        "message": "firstDices",
        "senderPip": senderPip,
        "receiverPip": receiverPip
      };
      this._conn.send(obj);
    }
  }, {
    key: 'sendDices',
    value: function sendDices(pip1, pip2) {
      var obj = {
        "message": "dices",
        "pips": [pip1, pip2]
      };
      this._conn.send(obj);
    }
  }, {
    key: 'sendMovedPiece',
    value: function sendMovedPiece(destPoint, sourcePoint) {
      var obj = {
        "message": "movedPiece",
        "destPoint": destPoint,
        "sourcePoint": sourcePoint
      };
      this._conn.send(obj);
    }
  }, {
    key: 'sendMovedPieceToBar',
    value: function sendMovedPieceToBar(destPoint, sourcePoint) {
      var obj = {
        "message": "movedPieceToBar",
        "destPoint": destPoint,
        "sourcePoint": sourcePoint
      };
      this._conn.send(obj);
    }
  }, {
    key: 'sendUndoPiece',
    value: function sendUndoPiece(sentUndoOjb) {
      var obj = {
        "message": "undo",
        "undoOjb": sentUndoOjb
      };
      this._conn.send(obj);
    }
  }, {
    key: 'sendChangeTurn',
    value: function sendChangeTurn() {
      var obj = {
        "message": "changeTurn"
      };
      this._conn.send(obj);
    }
  }, {
    key: '_sendUserNameAndIcon',
    value: function _sendUserNameAndIcon() {
      // ユーザー名をJSONから取得(JSONにはあるはず)
      var userName = this._userSettingController.loadUserNameFromJSON();
      // ユーザーのアイコンをJSONから取得(JSONにはあるはず)
      var iconBase64 = this._userSettingController.loadImageBase64FromJSON();
      var obj = {
        "message": "userNameAndIcon",
        "userName": userName,
        "iconBase64": iconBase64
      };
      this._conn.send(obj);
    }
  }, {
    key: '_sendAnswerUserNameAndIcon',
    value: function _sendAnswerUserNameAndIcon() {
      // ユーザー名をJSONから取得(JSONにはあるはず)
      var userName = this._userSettingController.loadUserNameFromJSON();
      // ユーザーのアイコンをJSONから取得(JSONにはあるはず)
      var iconBase64 = this._userSettingController.loadImageBase64FromJSON();
      var obj = {
        "message": "answerUserNameAndIcon",
        "userName": userName,
        "iconBase64": iconBase64
      };
      this._conn.send(obj);
    }
  }, {
    key: '_receivedUserNameAndIcon',
    value: function _receivedUserNameAndIcon() {
      this._sendAnswerUserNameAndIcon();
    }
  }]);

  return PeerController;
})();

exports['default'] = PeerController;
module.exports = exports['default'];