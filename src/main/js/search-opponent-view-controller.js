import PeerController from '../script/peer-controller';
import UserSettingController from '../script/user-setting-controller';

const BANKERS_FREE = 100;
const BET = 500;
export default class SearchOpponentViewController {

  constructor(view) {
    this._view = view;
    this._userSettingController = new UserSettingController();

    this._searchResultsMyChips = this._view.getElementById('searchResultsMyChips');
    this._searchResultsOpponentChips = this._view.getElementById('searchResultsOpponentChips');

    this._myChips = 0;
    this._opponentChips = 0;
    this._chargeChipsValue = BANKERS_FREE;
  }

  initialize() {
    this._view.getElementById('searchOpponentGoToTopButton').addEventListener('click', this.onClickGotoTopButton.bind(this));
  }

  setVersusView(opponent_userName, opponent_icon, opponent_chips) {
    // 自分の名前をJSONから取得
    var userName = this._userSettingController.loadUserNameFromJSON();
    // 自分の名前を設定
    var myNameLabel = this._view.getElementById('searchResultsMyName');
    myNameLabel.innerHTML = userName;

    // 自分のアイコンをJSONから取得
    var base64 = this._userSettingController.loadImageBase64FromJSON();
    // 自分のアイコンを設定
    var iconImage = this._view.getElementById('searchResultsMyIcon');
    var iconImageSrc = this._getImagesrcWithBase64(base64);
    iconImage.src = iconImageSrc;

    // 自分のチップをJSONから取得
    this._myChips = this._userSettingController.loadChipsFromJSON();

    // 相手の名前を設定
    var opponentNameLabel = this._view.getElementById('searchResultsOpponentName');
    opponentNameLabel.innerHTML = opponent_userName;

    // 相手のアイコンを設定
    var opponentIconImage = this._view.getElementById('searchResultsOpponentIcon');
    var opponentIconImageSrc = this._getImagesrcWithBase64(opponent_icon);
    opponentIconImage.src = opponentIconImageSrc;

    // 相手のチップを設定
    this._opponentChips = opponent_chips;
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
    let target = this._view.getElementById('searchResults');
    target.style.display = "block";

    // 0.03秒間隔でチップを減算
    this._chargeChips();
  }

  _chargeChips() {

    var id = setTimeout(this._chargeChips.bind(this), 30);

    if (this._chargeChipsValue <= 0) {
      this._chargeChipsValue = BANKERS_FREE;
      clearTimeout(id);　 //idをclearTimeoutで指定している

      // 自分のチップをJSONに保存
      this._userSettingController.writeChipsToJSON(this._myChips);
      return;
    }
    this._myChips--;
    this._opponentChips--;
    this._chargeChipsValue--;

    this._searchResultsMyChips.innerHTML = "$" + this._myChips;
    this._searchResultsOpponentChips.innerHTML = "$" + this._opponentChips;
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
