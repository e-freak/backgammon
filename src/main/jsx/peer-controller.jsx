//  http://nttcom.github.io/skyway/docs/
//  https://qiita.com/daisaru11/items/52c10514ba2fa2dd1b87

const Peer = require('skyway-js');
const SkyWay_ApiKey = '46fe641a-df1c-42da-b45b-4061347deb7b';

export default class PeerController {
  constructor() {
      this.onOpen = this.onOpen.bind(this);
      this.onConnection = this.onConnection.bind(this);
      this.onConnectionOpen = this.onConnectionOpen.bind(this);
      this.onReceivedData = this.onReceivedData.bind(this);
  }

  initialize() {
    const peer = new Peer({key: SkyWay_ApiKey,
              debug: 3});
    peer.on('open', this.onOpen);
    peer.on('connection', this.onConnection);
    this._peer = peer;
  }

  onOpen() {
    // 1対1の接続を想定
    // アクティブなPeerIDが2つなら、自分以外のPeerIDに接続
    this._peer.listAllPeers(function(list){
      if (list.length === 2){
        // 接続（自分より前に接続しているIDのindexは、きっと0だろう。。）
        const conn = this._peer.connect(list[0]);
        conn.on('open', this.onConnectionOpen);
        this._conn = conn;
      }
    }.bind(this));
  }

  // 接続イベントの受信
  onConnection(conn) {
    alert("接続イベント受信");
    conn.on('data', this.onReceivedData);
    this._conn = conn;
  }

   // コネクションが利用可能になった
   onConnectionOpen() {
      // とりあえず送信してみる
      alert("コネクションが接続利用可能になったので、メッセージを送信してみる");
      this._conn.send('Hello!');
   }

   // メッセージを受信
   onReceivedData(data) {
      alert("メッセージ受信:" + data);
   }
}
