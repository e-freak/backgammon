//  http://nttcom.github.io/skyway/docs/
//  https://qiita.com/daisaru11/items/52c10514ba2fa2dd1b87


// http://shared-blog.kddi-web.com/test/skyway/
import UserSettingController from '../script/user-setting-controller';

const Peer = require('skyway-js');
const SkyWay_ApiKey = '46fe641a-df1c-42da-b45b-4061347deb7b';

export default class PeerController {
  constructor(receivedMessage) {
    this.onOpen = this.onOpen.bind(this);
    this.onConnection = this.onConnection.bind(this);
    this.onConnectionOpen = this.onConnectionOpen.bind(this);
    this.onReceivedData = this.onReceivedData.bind(this);

    this._userSettingController = new UserSettingController();

    // メッセージを受信通知を送るメソッド
    this.receivedMessage = receivedMessage;
  }

  initialize() {
    const peer = new Peer({
      key: SkyWay_ApiKey,
      debug: 3
    });
    peer.on('open', this.onOpen);
    peer.on('connection', this.onConnection);
    this._peer = peer;

    this._userSettingController.initialize();
  }

  onOpen() {
    // 1対1の接続を想定
    // アクティブなPeerIDが2つなら、自分以外のPeerIDに接続
    this._peer.listAllPeers(function(list) {
      if (list.length === 2) {
        // 接続（自分より前に接続しているIDのindexは、きっと0だろう。。）
        const conn = this._peer.connect(list[0]);
        conn.on('open', this.onConnectionOpen);
        this._conn = conn;
      }
    }.bind(this));
  }

  // 接続イベントの受信
  onConnection(conn) {
    this._conn = conn;
    conn.on('data', this.onReceivedData);

  }

  // コネクションが利用可能になった
  onConnectionOpen(conn) {
    this._conn.on('data', this.onReceivedData);
    // とりあえず送信してみる
    this._sendUserNameAndIcon();
  }

  // メッセージを受信
  onReceivedData(data) {
    var message = data.message;
    if (message === "userNameAndIcon") {
      this._receivedUserNameAndIcon();
    } else if (message === "answerUserNameAndIcon") {} else {}
    this.receivedMessage(data);
  }

  // receivedMessage(data) {
  //   this.receivedMessage(data);
  // }

  _sendUserNameAndIcon() {
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

  _sendAnswerUserNameAndIcon() {
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

  _receivedUserNameAndIcon() {
    this._sendAnswerUserNameAndIcon();
  }
}
