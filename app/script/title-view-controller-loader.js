'use strict';

var _titleViewController = require('../script/title-view-controller');

var _titleViewController2 = _interopRequireDefault(_titleViewController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.window.addEventListener('DOMContentLoaded', function () {
  global.controller = new _titleViewController2.default(global.document);
  global.controller.initialize();
}, false);