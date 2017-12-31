import UserSettingController from '../script/user-setting-controller';
import Base64Converter from '../script/base64Converter';


export default class TitleViewController {

  constructor(view) {
    this._view = view;
    this.imageDragover = this.imageDragover.bind(this);
    this.imageDragleave = this.imageDragleave.bind(this);
    this.imageDrop = this.imageDrop.bind(this);
    this.imageClick = this.imageClick.bind(this);
    this.fileInputChange = this.fileInputChange.bind(this);

    this._userSettingController = new UserSettingController();
    this._base64Converter = new Base64Converter();
  }

  initialize() {
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

  banDrop(e) {
    // ------------------------------------------------------------
    // デフォルトのドロップ機能を無効化する
    // ------------------------------------------------------------
    e.preventDefault();
  }

  onClickBattleButton() {
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

    this._view.location.href = './game.html';
  }

  onClickChipsBuyButton() {
    // チップを$500プラスする
    var chipsValueLabel = this._view.getElementById('chipsValueLabelArea');
    var chipsString = chipsValueLabel.innerHTML.replace("$", "");
    var chips = parseInt(chipsString) + 500;

    chipsValueLabel.innerHTML = "$" + chips;
  }
  onClickRegisterButton() {
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

    // アイコンをBase64に変換してJSONに保存
    var base64 = this._base64Converter.encodeImage(iconPath);
    this._userSettingController.writeImageBase64ToJSON(base64);

    // チップをJSONに保存
    var chipsValueLabel = this._view.getElementById('chipsValueLabelArea');
    var chipsString = chipsValueLabel.innerHTML.replace("$", "");
    this._userSettingController.writeChipsToJSON(+chipsString);

    // メニューを閉じる
    var clickMe = document.getElementById("showMenu");
    clickMe.click();

  }

  // ドラッグ中の要素がドロップ要素に重なった時
  imageDragover(ev) {
    ev.preventDefault();
    // ファイルのコピーを渡すようにする
    ev.dataTransfer.dropEffect = 'copy';

    this._dropArea.classList.add('dragover');
  }

  // ドラッグ中の要素がドロップ要素から外れた時
  imageDragleave() {
    this._dropArea.classList.remove('dragover');
  }

  // ドロップ要素にドロップされた時
  imageDrop(ev) {
    ev.preventDefault();
    this._dropArea.classList.remove('dragover');
    // ev.dataTransfer.files に複数のファイルのリストが入っている
    this._organizeFiles(ev.dataTransfer.files);
  }

  // #dropArea がクリックされた時
  imageClick() {
    this._fileInput.click();
  }


  // ファイル参照で画像を追加した場合
  fileInputChange(ev) {
    // ev.target.files に複数のファイルのリストが入っている
    this._organizeFiles(ev.target.files);
    // 値のリセット
    fileInput.value = '';
  }

  // ドロップされたファイルの整理
  _organizeFiles(files) {
    var
      length = files.length,
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

  _outputImage(blob) {
    // 画像要素の生成
    var image = new Image();

    // File/BlobオブジェクトにアクセスできるURLを生成
    var blobURL = URL.createObjectURL(blob);

    // src にURLを入れる
    image.src = blobURL;

    // 画像は描画領域に合わせて表示
    image.style.maxWidth = "100%";
    image.style.height = "auto";
    image.id = "iconImage";

    dropArea.innerHTML = "";

    // 画像読み込み完了後
    image.addEventListener('load', function() {
      // File/BlobオブジェクトにアクセスできるURLを開放
      URL.revokeObjectURL(blobURL);

      // #output へ出力
      dropArea.appendChild(image);
    });
  }

  // 長い。。。
  _updateUserInfoView() {
    // ユーザー名がJSONにあれば設定
    var userName = this._userSettingController.loadUserNameFromJSON();
    if (userName !== undefined) {
      var userNameArea = this._view.getElementById('nameValue');
      userNameArea.value = userName;
    }

    // アイコンがuserDataにあれば設定
    var base64 = this._userSettingController.loadImageBase64FromJSON();
    if (base64 !== undefined) {
      // 画像要素の生成
      var image = new Image();

      // src にURLを入れる
      // ファイル形式は先頭3文字で判断する
      var first3Char = base64.substring(0, 3);
      if (first3Char === "/9j") {
        // JPEG
        image.src = "data:image/jpg;base64," + base64;
      } else if (first3Char === "iVB") {
        // PNG
        image.src = "data:image/png;base64," + base64;
      } else if (first3Char === "R0l") {
        // GIF
        image.src = "data:image/gif;base64," + base64;
      } else {
        // 対応フォーマット以外
        alert("アイコンの読み取り失敗");
        return;
      }

      // 画像は描画領域に合わせて表示
      image.style.maxWidth = "100%";
      image.style.height = "auto";
      image.id = "iconImage";
      dropArea.innerHTML = "";

      // 画像読み込み完了後
      image.addEventListener('load', function() {
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
}
