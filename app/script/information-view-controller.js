'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _scriptUserSettingController = require('../script/user-setting-controller');

var _scriptUserSettingController2 = _interopRequireDefault(_scriptUserSettingController);

var InformationViewController = (function () {
  function InformationViewController(view) {
    _classCallCheck(this, InformationViewController);

    this._view = view;
    this._playerName = "name";
    this._iconImag;
    this._pipCount = 167;
    this._timeLimit = 600; // 制限時間
    this._isTurn = true; // 自分のターンか？

    this._pipElement;
    this._timeElement;

    this._userSettingController = new _scriptUserSettingController2['default']();
  }

  _createClass(InformationViewController, [{
    key: 'initialize',
    value: function initialize(opponentName, opponentIconBase64) {
      this.setMyName();
      this.setMyIcon();
      this.setOpponentName(opponentName);
      this.setOpponentIcon(opponentIconBase64);
      this._pipElement = this._view.getElementById('my-pipCount');
      this._timeElement = this._view.getElementById('my-timeLimit');
    }
  }, {
    key: 'startTime',
    value: function startTime() {
      this._timeLimit--;
      var id = setTimeout(this.startTime.bind(this), 1000);
      if (this._isTurn === false) {
        this._isTurn = true; // ここでtrueにするの微妙。。。
        clearTimeout(id); //idをclearTimeoutで指定している
      }
      var min = String(Math.floor(this._timeLimit / 60));
      var second = String(this._timeLimit % 60);
      this._timeElement.innerText = min + ":" + second;
    }
  }, {
    key: 'stopTime',
    value: function stopTime() {
      this._isTurn = false;
    }
  }, {
    key: 'updatePipNumber',
    value: function updatePipNumber(num) {
      this._pipCount += num;
      this._pipElement.innerText = String(this._pipCount);
    }
  }, {
    key: 'setMyName',
    value: function setMyName() {
      var name = this._userSettingController.loadUserNameFromJSON();
      var myName = this._view.getElementById('my-information-name');
      myName.innerHTML = name;
    }
  }, {
    key: 'setMyIcon',
    value: function setMyIcon(iconSrc) {
      var base64 = this._userSettingController.loadImageBase64FromJSON();
      var iconImageSrc = this._getImagesrcWithBase64(base64);
      var myIcon = this._view.getElementById('my-information-icon');
      myIcon.src = iconImageSrc;
    }
  }, {
    key: 'setOpponentName',
    value: function setOpponentName(name) {
      var opponentName = this._view.getElementById('opponent-information-name');
      opponentName.innerHTML = name;
    }
  }, {
    key: 'setOpponentIcon',
    value: function setOpponentIcon(icon) {
      var opponentIcon = this._view.getElementById('opponent-information-icon');
      var opponentIconImageSrc = this._getImagesrcWithBase64(icon);
      opponentIcon.src = opponentIconImageSrc;
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
  }]);

  return InformationViewController;
})();

exports['default'] = InformationViewController;
module.exports = exports['default'];