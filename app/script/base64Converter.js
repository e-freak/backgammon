// https://qiita.com/yasumodev/items/e1708f01ff87692185cd

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Base64Converter = (function () {
  function Base64Converter() {
    _classCallCheck(this, Base64Converter);
  }

  _createClass(Base64Converter, [{
    key: 'initialize',
    value: function initialize() {}
  }, {
    key: 'encodeImage',
    value: function encodeImage(fileName) {
      var fs = require('fs');
      var data = fs.readFileSync(fileName, 'base64');
      return data;
    }
  }, {
    key: 'decodeImage',
    value: function decodeImage(base64Image) {
      return new Buffer(base64Image, 'base64');
    }

    // <img>要素 → Base64形式の文字列に変換
    // [使い方]
    // var img = document.getElementById('MyImg');
    // var b64 = ImageToBase64(img, "image/jpeg"); // "data:image/jpeg;base64,XXXXXX..." みたいな文字列
  }, {
    key: 'imageToBase64',
    value: function imageToBase64(img, mime_type) {
      // New Canvas
      var canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      // Draw Image
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      // To Base64
      return canvas.toDataURL(mime_type);
    }

    // Base64形式の文字列 → <img>要素に変換
    // [使い方]
    // Base64ToImage(base64img, function(img) {
    //  // <img>要素にすることで幅・高さがわかります
    //  alert("w=" + img.width + " h=" + img.height);
    //  // <img>要素としてDOMに追加
    //  document.getElementById('main').appendChild(img);
    // });
  }, {
    key: 'base64ToImage',
    value: function base64ToImage(base64img, callback) {
      var img = new Image();
      img.onload = function () {
        callback(img);
      };
      img.src = base64img;
    }
  }]);

  return Base64Converter;
})();

exports['default'] = Base64Converter;
module.exports = exports['default'];