import PeerController from '../script/peer-controller';
import UserSettingController from '../script/user-setting-controller';

export default class SearchOpponentViewController {

  constructor(view) {
    this._view = view;
    this._userSettingController = new UserSettingController();
  }

  initialize() {
    this._view.getElementById('searchOpponent-go-top-button').addEventListener('click', this.onClickGotoTopButton.bind(this));

  }

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
    let searchingLabel = this._view.getElementById('searchingLabel');
    searchingLabel.style.display = "none";

    // 対戦相手を表示
    let target = this._view.getElementById('search-results');
    target.style.display = "block";
  }

  hideVersusView() {
    // 対戦相手を表示
    let target = this._view.getElementById('searchOpponent');
    target.style.display = "none";
  }

  onClickGotoTopButton() {
    history.back();
  }
}
