//  http://nttcom.github.io/skyway/docs/
//  https://qiita.com/daisaru11/items/52c10514ba2fa2dd1b87

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Peer = require('skyway-js');
var SkyWay_ApiKey = '46fe641a-df1c-42da-b45b-4061347deb7b';

var PeerController = (function () {
  function PeerController() {
    _classCallCheck(this, PeerController);

    this.onOpen = this.onOpen.bind(this);
    this.onConnection = this.onConnection.bind(this);
    this.onConnectionOpen = this.onConnectionOpen.bind(this);
    this.onReceivedData = this.onReceivedData.bind(this);
  }

  _createClass(PeerController, [{
    key: 'initialize',
    value: function initialize() {
      var peer = new Peer({ key: SkyWay_ApiKey,
        debug: 3 });
      peer.on('open', this.onOpen);
      peer.on('connection', this.onConnection);
      this._peer = peer;
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
      alert("call onConnection");
      conn.on('data', this.onReceivedData);
      this._conn = conn;
    }

    // コネクションが利用可能になった
  }, {
    key: 'onConnectionOpen',
    value: function onConnectionOpen() {
      // とりあえず送信してみる
      this._conn.send('Hello!');
    }

    // メッセージを受信
  }, {
    key: 'onReceivedData',
    value: function onReceivedData(data) {
      alert(data);
    }
  }]);

  return PeerController;
})();

exports['default'] = PeerController;
module.exports = exports['default'];