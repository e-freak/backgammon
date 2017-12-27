'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _scriptSearchOpponentViewController = require('../script/search-opponent-view-controller');

var _scriptSearchOpponentViewController2 = _interopRequireDefault(_scriptSearchOpponentViewController);

global.window.addEventListener('DOMContentLoaded', function () {
    global.controller = new _scriptSearchOpponentViewController2['default'](global.document);
    global.controller.initialize();
}, false);