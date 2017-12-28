'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _scriptUserSettingController = require('../script/user-setting-controller');

var _scriptUserSettingController2 = _interopRequireDefault(_scriptUserSettingController);

var TitleViewController = (function () {
  function TitleViewController(view) {
    _classCallCheck(this, TitleViewController);

    this._view = view;
    this.imageDragover = this.imageDragover.bind(this);
    this.imageDragleave = this.imageDragleave.bind(this);
    this.imageDrop = this.imageDrop.bind(this);
    this.imageClick = this.imageClick.bind(this);
    this.fileInputChange = this.fileInputChange.bind(this);

    this._userSettingController = new _scriptUserSettingController2['default']();
  }

  _createClass(TitleViewController, [{
    key: 'initialize',
    value: function initialize() {
      this._view.getElementById('main').addEventListener('drop', this.banDrop.bind(this));

      this._view.getElementById('button-battle').addEventListener('click', this.onClickBattleButton.bind(this));
      this._view.getElementById('button-register').addEventListener('click', this.onClickRegisterButton.bind(this));
      this._view.getElementById('button-buy').addEventListener('click', this.onClickChipsBuyButton.bind(this));
      this._dropArea = this._view.getElementById('dropArea');
      this._fileInput = this._view.getElementById('fileInput');

      // 画像の最大ファイルサイズ（20MB）
      this._maxSize = 20 * 1024 * 1024;

      this._dropArea.addEventListener('dragover', this.imageDragover);
      this._dropArea.addEventListener('dragleave', this.imageDragleave);
      this._dropArea.addEventListener('drop', this.imageDrop);
      this._dropArea.addEventListener('click', this.imageClick);

      this._fileInput.addEventListener('change', this.fileInputChange);
      this._userSettingController.initialize();

      this._updateUserInfoView();
    }
  }, {
    key: 'banDrop',
    value: function banDrop(e) {
      // ------------------------------------------------------------
      // デフォルトのドロップ機能を無効化する
      // ------------------------------------------------------------
      e.preventDefault();
    }
  }, {
    key: 'onClickBattleButton',
    value: function onClickBattleButton() {
      // ユーザー名が登録されていない場合は警告
      var userName = this._userSettingController.loadUserNameFromJSON();
      if (userName === undefined) {
        alert("ユーザー情報を登録してください");
        return;
      }

      var remote = require('electron').remote;
      var main = remote.require('./index');
      console.log('ex remote');
      main.exampleRemote();

      this._view.location.href = './search-opponent.html';
    }
  }, {
    key: 'onClickChipsBuyButton',
    value: function onClickChipsBuyButton() {
      // チップを$500プラスする
      var chipsValueLabel = this._view.getElementById('chipsValueLabelArea');
      var chipsString = chipsValueLabel.innerHTML.replace("$", "");
      var chips = parseInt(chipsString) + 500;

      chipsValueLabel.innerHTML = "$" + chips;
    }
  }, {
    key: 'onClickRegisterButton',
    value: function onClickRegisterButton() {
      // ユーザー名が設定されているか
      var userName = this._view.getElementById('nameValue').value;
      if (userName === "") {
        // 未入力の場合、アラートを出して終了
        alert("名前: を入力してください");
        return;
      }

      // アイコンが設定されているか(JSONに保存されているか)
      var iconPath = this._userSettingController.loadIconPathFromJSON();
      if (iconPath === undefined) {
        alert("アイコン: を設定してください");
        return;
      }

      // ユーザー名をJSONに保存
      this._userSettingController.writeUserNameToJSON(userName);

      // アイコンをコピー
      // アイコンのファイル名はJSONに保存されている
      this._userSettingController.copyIcon();

      // チップをJSONに保存
      var chipsValueLabel = this._view.getElementById('chipsValueLabelArea');
      var chipsString = chipsValueLabel.innerHTML.replace("$", "");
      this._userSettingController.writeChipsToJSON(+chipsString);

      // メニューを閉じる
      var clickMe = document.getElementById("showMenu");
      clickMe.click();
    }

    // ドラッグ中の要素がドロップ要素に重なった時
  }, {
    key: 'imageDragover',
    value: function imageDragover(ev) {
      ev.preventDefault();
      // ファイルのコピーを渡すようにする
      ev.dataTransfer.dropEffect = 'copy';

      this._dropArea.classList.add('dragover');
    }

    // ドラッグ中の要素がドロップ要素から外れた時
  }, {
    key: 'imageDragleave',
    value: function imageDragleave() {
      this._dropArea.classList.remove('dragover');
    }

    // ドロップ要素にドロップされた時
  }, {
    key: 'imageDrop',
    value: function imageDrop(ev) {
      ev.preventDefault();
      this._dropArea.classList.remove('dragover');
      // ev.dataTransfer.files に複数のファイルのリストが入っている
      this._organizeFiles(ev.dataTransfer.files);
    }

    // #dropArea がクリックされた時
  }, {
    key: 'imageClick',
    value: function imageClick() {
      this._fileInput.click();
    }

    // ファイル参照で画像を追加した場合
  }, {
    key: 'fileInputChange',
    value: function fileInputChange(ev) {
      // ev.target.files に複数のファイルのリストが入っている
      this._organizeFiles(ev.target.files);
      // 値のリセット
      fileInput.value = '';
    }

    // ドロップされたファイルの整理
  }, {
    key: '_organizeFiles',
    value: function _organizeFiles(files) {
      var length = files.length,
          i = 0,
          file;

      for (; i < length; i++) {
        // file には Fileオブジェクト というローカルのファイル情報を含むオブジェクトが入る
        file = files[i];

        // 画像以外は無視
        if (!file || file.type.indexOf('image/') < 0) {
          continue;
        }

        // 指定したサイズを超える画像は無視
        if (file.size > this._maxSize) {
          continue;
        }

        // 画像のパスをJSONに保存しておく
        this._userSettingController.writeIconPathToJSON(file.path);

        // 画像出力処理へ進む
        this._outputImage(file);
      }
    }
  }, {
    key: '_outputImage',
    value: function _outputImage(blob) {

      // 画像要素の生成
      var image = new Image();

      // File/BlobオブジェクトにアクセスできるURLを生成
      var blobURL = URL.createObjectURL(blob);

      // src にURLを入れる
      image.src = blobURL;

      // 画像は描画領域に合わせて表示
      image.style.maxWidth = "100%";
      image.style.height = "auto";

      dropArea.innerHTML = "";

      // 画像読み込み完了後
      image.addEventListener('load', function () {
        // File/BlobオブジェクトにアクセスできるURLを開放
        URL.revokeObjectURL(blobURL);

        // #output へ出力
        dropArea.appendChild(image);
      });
    }
  }, {
    key: '_updateUserInfoView',
    value: function _updateUserInfoView() {
      // ユーザー名がJSONにあれば設定
      var userName = this._userSettingController.loadUserNameFromJSON();
      if (userName !== undefined) {
        var userNameArea = this._view.getElementById('nameValue');
        userNameArea.value = userName;
      }

      // アイコンがuserDataにあれば設定
      var iconPath = this._userSettingController.loadIconPathFromJSON();
      if (iconPath !== undefined) {
        // 画像要素の生成
        var image = new Image();

        // src にURLを入れる
        image.src = iconPath;

        // 画像は描画領域に合わせて表示
        image.style.maxWidth = "100%";
        image.style.height = "auto";

        dropArea.innerHTML = "";

        // 画像読み込み完了後
        image.addEventListener('load', function () {
          // #output へ出力
          dropArea.appendChild(image);
        });
      }

      // 対戦成績を設定

      // チップを設定
      var chips = this._userSettingController.loadChipsFromJSON();
      if (chips !== undefined) {
        var chipsValueLabel = this._view.getElementById('chipsValueLabelArea');
        chipsValueLabel.innerHTML = "$" + chips;
      }

      // ユーザー名が登録されていない場合は、ユーザー情報設定画面を表示してあげる
      if (userName === undefined) {
        var clickMe = document.getElementById("showMenu");
        clickMe.click();
      }
    }
  }]);

  return TitleViewController;
})();

exports['default'] = TitleViewController;
module.exports = exports['default'];