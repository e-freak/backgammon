"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserSettingController = (function () {
  function UserSettingController() {
    _classCallCheck(this, UserSettingController);

    // ユーザー情報を保存するパス
    var appPath = __dirname.substring(0, __dirname.lastIndexOf('/'));
    this._userSettingPath = appPath + "/userData";
    this._userSettingFile = this._userSettingPath + "/userSetting.json";
  }

  _createClass(UserSettingController, [{
    key: "initialize",
    value: function initialize() {}
  }, {
    key: "writeUserNameToJSON",
    value: function writeUserNameToJSON(userName) {
      var obj = { "userName": userName };
      this._writeConfigJSON(obj);
    }
  }, {
    key: "writeIconPathToJSON",
    value: function writeIconPathToJSON(iconPath) {
      var obj = { "iconPath": iconPath };
      this._writeConfigJSON(obj);
    }
  }, {
    key: "writeChipsToJSON",
    value: function writeChipsToJSON(chips) {
      var obj = { "chips": chips };
      this._writeConfigJSON(obj);
    }
  }, {
    key: "loadUserNameFromJSON",
    value: function loadUserNameFromJSON() {
      var jsonObj = this._loadConfigJSON();
      try {
        return jsonObj.userName;
      } catch (e) {
        return;
      }
    }
  }, {
    key: "loadIconPathFromJSON",
    value: function loadIconPathFromJSON() {
      var jsonObj = this._loadConfigJSON();
      try {
        return jsonObj.iconPath;
      } catch (e) {
        return;
      }
    }
  }, {
    key: "loadChipsFromJSON",
    value: function loadChipsFromJSON() {
      var jsonObj = this._loadConfigJSON();
      try {
        return jsonObj.chips;
      } catch (e) {
        return;
      }
    }
  }, {
    key: "copyIcon",
    value: function copyIcon() {
      var fs = require('fs');
      var iconPath = this.loadIconPathFromJSON();

      // 拡張子
      var path = require('path');
      var extname = path.extname(iconPath);

      var copyIconPath = this._userSettingPath + "/icon" + extname;
      fs.createReadStream(iconPath).pipe(fs.createWriteStream(copyIconPath));

      // コピーしたら、JSONのパスも更新しておく
      this.writeIconPathToJSON(copyIconPath);
    }
  }, {
    key: "_writeConfigJSON",
    value: function _writeConfigJSON(obj) {
      var loadObj = this._loadConfigJSON();
      var writeObj;
      if (loadObj === undefined) {
        writeObj = obj;
      } else {
        writeObj = Object.assign(loadObj, obj);
      }

      var fs = require('fs');
      fs.writeFileSync(this._userSettingFile, JSON.stringify(writeObj, null, 4));
    }
  }, {
    key: "_loadConfigJSON",
    value: function _loadConfigJSON() {
      // JSONファイルの読み込み
      var fs = require('fs');

      try {
        var jsonObj = JSON.parse(fs.readFileSync(this._userSettingFile));
        return jsonObj;
      } catch (e) {
        return;
      }
    }
  }]);

  return UserSettingController;
})();

exports["default"] = UserSettingController;
module.exports = exports["default"];