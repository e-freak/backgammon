'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var TitleViewController = (function () {
    function TitleViewController(view) {
        _classCallCheck(this, TitleViewController);

        this._view = view;
    }

    _createClass(TitleViewController, [{
        key: 'initialize',
        value: function initialize() {
            this._view.getElementById('button-battle').addEventListener('click', this.onClickBattleButton.bind(this));
        }
    }, {
        key: 'onClickBattleButton',
        value: function onClickBattleButton() {
            this._view.location.href = './game.html';
        }
    }]);

    return TitleViewController;
})();

exports['default'] = TitleViewController;
module.exports = exports['default'];