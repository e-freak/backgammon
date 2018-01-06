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
  function InformationViewController(view, notificationTimeup) {
    _classCallCheck(this, InformationViewController);

    this._view = view;
    this._notificationTimeup = notificationTimeup;
    this._myPipCount = 167;
    this._myTimeLimit = 600; // 制限時間
    this._opponentPipCount = 167;
    this._opponentTimeLimit = 600; // 制限時間

    this._myData = {};
    this._opponentData = {};

    this._isTurn = true; // 自分のターンか？

    this._isTimerForcedTermination = false; // タイマーの強制終了

    this._myPipElement;
    this._myTimeElement;
    this._opponentPipElement;
    this._opponentTimeElement;

    this._userSettingController = new _scriptUserSettingController2['default']();

    this._informationAreaWrapper = this._view.getElementById('information-area-wrapper');
  }

  _createClass(InformationViewController, [{
    key: 'initialize',
    value: function initialize(opponentName, opponentIconBase64) {
      this.setMyName();
      this.setMyIcon();
      this.setOpponentName(opponentName);
      this.setOpponentIcon(opponentIconBase64);
      this._myPipElement = this._view.getElementById('my-pipCount');
      this._myTimeElement = this._view.getElementById('my-timeLimit');

      this._opponentPipElement = this._view.getElementById('opponent-pipCount');
      this._opponentTimeElement = this._view.getElementById('opponent-timeLimit');

      this._informationAreaWrapper.style.display = "block";
    }
  }, {
    key: 'hideWrapper',
    value: function hideWrapper() {
      this._informationAreaWrapper.style.display = "none";
    }
  }, {
    key: 'setIsTuru',
    value: function setIsTuru(flag) {
      this._isTurn = flag;
    }
  }, {
    key: 'setIsTimerForcedTermination',
    value: function setIsTimerForcedTermination(flag) {
      this._isTimerForcedTermination = flag;
    }
  }, {
    key: 'startTime',
    value: function startTime() {
      if (this._isTurn) {
        this._startMyTimeLimit();
      } else {
        this._startOpponentTimeLimit();
      }
    }
  }, {
    key: '_startMyTimeLimit',
    value: function _startMyTimeLimit() {
      this._myTimeLimit--;
      var id = setTimeout(this._startMyTimeLimit.bind(this), 1000);
      if (this._isTurn === false || this._isTimerForcedTermination === true) {
        clearTimeout(id); //idをclearTimeoutで指定している
        return;
      }
      if (this._myTimeLimit < 0) {
        this._isTimerForcedTermination = true;
        // 時間切れをGame View Controllerに通知
        this._notificationTimeup();
      } else {
        var min = ("00" + String(Math.floor(this._myTimeLimit / 60))).slice(-2);
        var second = ("00" + String(this._myTimeLimit % 60)).slice(-2);
        this._myTimeElement.innerText = min + ":" + second;
      }
    }
  }, {
    key: '_startOpponentTimeLimit',
    value: function _startOpponentTimeLimit() {
      this._opponentTimeLimit--;
      var id = setTimeout(this._startOpponentTimeLimit.bind(this), 1000);
      if (this._isTurn === true || this._isTimerForcedTermination === true) {
        clearTimeout(id); //idをclearTimeoutで指定している
        return;
      }
      if (this._opponentTimeLimit < 0) {
        this._isTimerForcedTermination = true;
        // 対戦相手の時間切れはこちらからは通知しない（対戦相手側から通知される）
      } else {
          var min = ("00" + String(Math.floor(this._opponentTimeLimit / 60))).slice(-2);
          var second = ("00" + String(this._opponentTimeLimit % 60)).slice(-2);
          this._opponentTimeElement.innerText = min + ":" + second;
        }
    }
  }, {
    key: 'updateMyPipCount',
    value: function updateMyPipCount(count) {
      this._myPipCount -= count;
      this._myPipElement.innerText = String(this._myPipCount);
    }
  }, {
    key: 'updateOpponentPipCount',
    value: function updateOpponentPipCount(count) {
      this._opponentPipCount -= count;
      this._opponentPipElement.innerText = String(this._opponentPipCount);
    }
  }, {
    key: 'setMyName',
    value: function setMyName() {
      var name = this._userSettingController.loadUserNameFromJSON();
      var myNameElement = this._view.getElementById('my-information-name');
      myNameElement.innerHTML = name;

      this._myData["name"] = name;
    }
  }, {
    key: 'setMyIcon',
    value: function setMyIcon(iconSrc) {
      var base64 = this._userSettingController.loadImageBase64FromJSON();
      var iconImageSrc = this._getImagesrcWithBase64(base64);
      var myIcon = this._view.getElementById('my-information-icon');
      myIcon.src = iconImageSrc;

      this._myData["imageSrc"] = myIcon.src;
    }
  }, {
    key: 'setOpponentName',
    value: function setOpponentName(name) {
      var opponentName = this._view.getElementById('opponent-information-name');
      opponentName.innerHTML = name;

      this._opponentData["name"] = name;
    }
  }, {
    key: 'setOpponentIcon',
    value: function setOpponentIcon(icon) {
      var opponentIcon = this._view.getElementById('opponent-information-icon');
      var opponentIconImageSrc = this._getImagesrcWithBase64(icon);
      opponentIcon.src = opponentIconImageSrc;

      this._opponentData["imageSrc"] = opponentIcon.src;
    }
  }, {
    key: 'getMyData',
    value: function getMyData() {
      return this._myData;
    }
  }, {
    key: 'getOpponentData',
    value: function getOpponentData() {
      return this._opponentData;
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