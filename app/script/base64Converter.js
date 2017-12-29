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
  }]);

  return Base64Converter;
})();

exports['default'] = Base64Converter;
module.exports = exports['default'];