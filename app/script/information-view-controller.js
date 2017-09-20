'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var InformationViewController = (function () {
  function InformationViewController(view) {
    _classCallCheck(this, InformationViewController);

    this._view = view;
    this._playerName = "name";
    this._iconImag;
    this._pipCount = 167;
    this._timeLimit = 600; // 制限時間
    this._isTurn = true; // 自分のターンか？

    this._pipElement;
    this._timeElement;
  }

  _createClass(InformationViewController, [{
    key: 'initialize',
    value: function initialize() {
      this._pipElement = this._view.getElementById('my-pipCount');
      this._timeElement = this._view.getElementById('my-timeLimit');
    }
  }, {
    key: 'startTime',
    value: function startTime() {
      this._timeLimit--;
      console.log(this._timeLimit);
      var id = setTimeout(this.startTime.bind(this), 1000);
      if (this._isTurn === false) {
        this._isTurn = true; // ここでtrueにするの微妙。。。
        clearTimeout(id); //idをclearTimeoutで指定している
      }
      var min = String(Math.floor(this._timeLimit / 60));
      var second = String(this._timeLimit % 60);
      this._timeElement.innerText = min + ":" + second;
    }
  }, {
    key: 'stopTime',
    value: function stopTime() {
      this._isTurn = false;
    }
  }, {
    key: 'updatePipNumber',
    value: function updatePipNumber(num) {
      this._pipCount += num;
      this._pipElement.innerText = String(this._pipCount);
    }
  }]);

  return InformationViewController;
})();

exports['default'] = InformationViewController;
module.exports = exports['default'];