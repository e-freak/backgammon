'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _scriptSpinSpin = require('../script/spin/spin');

var _scriptSpinSpin2 = _interopRequireDefault(_scriptSpinSpin);

var _scriptPeerController = require('../script/peer-controller');

var _scriptPeerController2 = _interopRequireDefault(_scriptPeerController);

var _scriptUserSettingController = require('../script/user-setting-controller');

var _scriptUserSettingController2 = _interopRequireDefault(_scriptUserSettingController);

var SearchOpponentViewController = (function () {
  function SearchOpponentViewController(view, notificationSearchCompleted) {
    _classCallCheck(this, SearchOpponentViewController);

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
    this._spinner = new _scriptSpinSpin2['default'](opts);

    // 対戦相手検索完了を通知するメソッド
    this.notificationSearchCompleted = notificationSearchCompleted;

    // Peerからのメッセージを受信した場合の通知
    this.notificationOfReceiveMessage = this.notificationOfReceiveMessage.bind(this);

    this._userSettingController = new _scriptUserSettingController2['default']();
  }

  _createClass(SearchOpponentViewController, [{
    key: 'initialize',
    value: function initialize() {
      // spinnerを表示
      this._spinner.spin(this._target);

      this._peerController = new _scriptPeerController2['default'](this.notificationOfReceiveMessage);
      this._peerController.initialize();
    }

    // Peerからのメッセージを受信した場合の通知
  }, {
    key: 'notificationOfReceiveMessage',
    value: function notificationOfReceiveMessage(data) {
      var message = data.message;
      if (message === "userNameAndIcon" || message === "answerUserNameAndIcon") {
        // 自分と対戦相手のアイコンと名前を設定
        this._setVersusView(data.userName, data.iconBase64);
        // versus ビューを表示
        this._displayVersusView();
        // 少し待って、対戦相手検索完了の通知を送る
        setTimeout(this._notificationSearchCompleted.bind(this, data), 6000);
      }
    }
  }, {
    key: '_notificationSearchCompleted',
    value: function _notificationSearchCompleted(data) {
      this.notificationSearchCompleted(data);
    }
  }, {
    key: '_setVersusView',
    value: function _setVersusView(opponent_userName, opponent_icon) {
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
  }, {
    key: '_getImagesrcWithBase64',
    value: function _getImagesrcWithBase64(base64) {
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
  }, {
    key: '_displayVersusView',
    value: function _displayVersusView() {
      // 対戦相手待ちのラベルを非表示にする
      var searchOpponent = this._view.getElementById('searchOpponent');
      searchOpponent.style.display = "none";

      // spinを停止
      this._spinner.spin();

      // 対戦相手を表示
      var target = this._view.getElementById('search-results');
      target.style.display = "block";
    }
  }]);

  return SearchOpponentViewController;
})();

exports['default'] = SearchOpponentViewController;
module.exports = exports['default'];