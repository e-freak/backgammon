'use strict';

var _gameViewController = require('../script/game-view-controller');

var _gameViewController2 = _interopRequireDefault(_gameViewController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.window.addEventListener('DOMContentLoaded', function () {
  global.controller = new _gameViewController2.default(global.document);
  global.controller.initialize();
}, false);