'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _scriptGameViewController = require('../script/game-view-controller');

var _scriptGameViewController2 = _interopRequireDefault(_scriptGameViewController);

global.window.addEventListener('DOMContentLoaded', function () {
  global.controller = new _scriptGameViewController2['default'](global.document);
  global.controller.initialize();
}, false);