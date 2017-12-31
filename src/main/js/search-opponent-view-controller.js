import Spinner from '../script/spin/spin';
import PeerController from '../script/peer-controller';
import UserSettingController from '../script/user-setting-controller';

export default class SearchOpponentViewController {

  constructor(view) {
    this._view = view;

    var opts = {
      lines: 13, // The number of lines to draw
      length: 33, // The length of each line
      width: 11, // The line thickness
      radius: 16, // The radius of the inner circle
      corners: 1, // Corner roundness (0..1)
      rotate: 74, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#000', // #rgb or #rrggbb or array of colors
      speed: 1.5, // Rounds per second
      trail: 71, // Afterglow percentage
      shadow: true, // Whether to render a shadow
      hwaccel: true, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: '50%', // Top position relative to parent
      left: '50%' // Left position relative to parent
    };
    this._target = document.getElementById('spin-area');
    this._spinner = new Spinner(opts);

    // // 対戦相手検索完了を通知するメソッド
    // this.notificationSearchCompleted = notificationSearchCompleted;

    // Peerからのメッセージを受信した場合の通知
    //    this.notificationOfReceiveMessage = this.notificationOfReceiveMessage.bind(this);

    this._userSettingController = new UserSettingController();
  }

  initialize() {
    // spinnerを表示
    this._spinner.spin(this._target);

    // this._peerController = new PeerController(this.notificationOfReceiveMessage);
    // this._peerController.initialize();
  }

  // // Peerからのメッセージを受信した場合の通知
  // notificationOfReceiveMessage(data) {
  //   var message = data.message;
  //   if (message === "userNameAndIcon" ||
  //     message === "answerUserNameAndIcon") {
  //     // 自分と対戦相手のアイコンと名前を設定
  //     this._setVersusView(data.userName, data.iconBase64);
  //     // versus ビューを表示
  //     this._displayVersusView();
  //     // 少し待って、対戦相手検索完了の通知を送る
  //     setTimeout(this._notificationSearchCompleted.bind(this, data), 6000);
  //   }
  // }
  //
  // _notificationSearchCompleted(data){
  //   this.notificationSearchCompleted(data);
  // }
  setVersusView(opponent_userName, opponent_icon) {
    // 自分の名前をJSONから取得
    var userName = this._userSettingController.loadUserNameFromJSON();
    // 自分の名前を設定
    var myNameLabel = this._view.getElementById('my-name');
    myNameLabel.innerHTML = userName;

    // 自分のアイコンをJSONから取得
    var base64 = this._userSettingController.loadImageBase64FromJSON();
    // 自分のアイコンを設定
    var iconImage = this._view.getElementById('my-icon');
    var iconImageSrc = this._getImagesrcWithBase64(base64);
    iconImage.src = iconImageSrc;

    // 相手の名前を設定
    var opponentNameLabel = this._view.getElementById('opponent-name');
    opponentNameLabel.innerHTML = opponent_userName;

    // 相手のアイコンを設定
    var opponentIconImage = this._view.getElementById('opponent-icon');
    var opponentIconImageSrc = this._getImagesrcWithBase64(opponent_icon);
    opponentIconImage.src = opponentIconImageSrc;
  }

  _getImagesrcWithBase64(base64) {
    // ファイル形式は先頭3文字で判断する
    var first3Char = base64.substring(0, 3);
    var src = "";
    if (first3Char === "/9j") {
      // JPEG
      src = "data:image/jpg;base64," + base64;
    } else if (first3Char === "iVB") {
      // PNG
      src = "data:image/png;base64," + base64;
    } else if (first3Char === "R0l") {
      // GIF
      src = "data:image/gif;base64," + base64;
    } else {
      // 対応フォーマット以外
      alert("アイコンの読み取り失敗");
    }
    return src;
  }

  displayVersusView() {
    // 対戦相手待ちのラベルを非表示にする
    var searchOpponent = this._view.getElementById('searchOpponent');
    searchOpponent.style.display = "none";

    // spinを停止
    this._spinner.spin();

    // 対戦相手を表示
    var target = this._view.getElementById('search-results');
    target.style.display = "block";
  }
}
