export default class UserSettingController {

  constructor() {
    // ユーザー情報を保存するパス
    var appPath = __dirname.substring(0, __dirname.lastIndexOf('/'));
    this._userSettingPath = appPath + "/userData";
    this._userSettingFile = this._userSettingPath + "/userSetting.json";
  }

  initialize() {

  }

  writeUserNameToJSON(userName){
    var obj = {"userName" : userName};
    this._writeConfigJSON(obj);
  }

  writeIconPathToJSON(iconPath){
    var obj = {"iconPath" : iconPath};
    this._writeConfigJSON(obj);
  }

  writeImageBase64ToJSON(base64){
    var obj = {"iconBase64" : base64};
    this._writeConfigJSON(obj);
  }

  writeChipsToJSON(chips){
    var obj = {"chips" : chips};
    this._writeConfigJSON(obj);
  }

  loadUserNameFromJSON(){
    var jsonObj = this._loadConfigJSON();
    try {
      return jsonObj.userName;
    }
    catch (e) {
      return;
    }
  }

  loadImageBase64FromJSON(){
    var jsonObj = this._loadConfigJSON();
    try {
      return jsonObj.iconBase64;
    }
    catch (e) {
      return;
    }
  }

  loadIconPathFromJSON(){
    var jsonObj = this._loadConfigJSON();
    try {
      return jsonObj.iconPath;
    }
    catch (e) {
      return;
    }
  }

  loadChipsFromJSON(){
    var jsonObj = this._loadConfigJSON();
    try {
      return jsonObj.chips;
    }
    catch (e) {
      return;
    }
  }

  copyIcon(){
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


  _writeConfigJSON(obj) {
    var loadObj = this._loadConfigJSON();
    var writeObj;
    if (loadObj === undefined) {
      writeObj = obj;
    }else{
      writeObj = Object.assign(loadObj, obj);
    }

    var fs = require('fs');
    fs.writeFileSync(this._userSettingFile, JSON.stringify(writeObj, null, 4));
  }

  _loadConfigJSON() {
    // JSONファイルの読み込み
    var fs = require('fs');

    try {
      var jsonObj = JSON.parse(fs.readFileSync(this._userSettingFile));
      return jsonObj;
    }
    catch (e) {
      return;
    }
  }

}
