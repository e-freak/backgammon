'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _scriptTitleViewController = require('../script/title-view-controller');

var _scriptTitleViewController2 = _interopRequireDefault(_scriptTitleViewController);

global.window.addEventListener('DOMContentLoaded', function () {
  global.controller = new _scriptTitleViewController2['default'](global.document);
  global.controller.initialize();
}, false);