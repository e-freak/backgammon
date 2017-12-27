'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _scriptSpinSpin = require('../script/spin/spin');

var _scriptSpinSpin2 = _interopRequireDefault(_scriptSpinSpin);

var SearchOpponentViewController = (function () {
    function SearchOpponentViewController(view) {
        _classCallCheck(this, SearchOpponentViewController);

        this._view = view;

        var opts = {
            lines: 13, // The number of lines to draw
            length: 33, // The length of each line
            width: 11, // The line thickness
            radius: 16, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 74, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#000', // #rgb or #rrggbb or array of colors
            speed: 1.5, // Rounds per second
            trail: 71, // Afterglow percentage
            shadow: true, // Whether to render a shadow
            hwaccel: true, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: '50%', // Top position relative to parent
            left: '50%' // Left position relative to parent
        };
        this._target = document.getElementById('spin-area');
        this._spinner = new _scriptSpinSpin2['default'](opts);
    }

    _createClass(SearchOpponentViewController, [{
        key: 'initialize',
        value: function initialize() {
            // spinnerを表示
            this._spinner.spin(this._target);
        }
    }]);

    return SearchOpponentViewController;
})();

exports['default'] = SearchOpponentViewController;
module.exports = exports['default'];