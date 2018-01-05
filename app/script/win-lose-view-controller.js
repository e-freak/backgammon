'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var WinLoseViewController = (function () {
  function WinLoseViewController(view) {
    _classCallCheck(this, WinLoseViewController);

    this._view = view;
  }

  _createClass(WinLoseViewController, [{
    key: 'initialize',
    value: function initialize() {}
  }, {
    key: 'display',
    value: function display(isVictory, userData, opponentData, reasonString) {

      var winLoseLabel = this._view.getElementById('win-lose-label');

      var reason = this._view.getElementById('winning-losing-reason');
      reason.innerHTML = reasonString;

      var myIcon = this._view.getElementById('winning-losing-my-icon');
      var myName = this._view.getElementById('winning-losing-my-name');
      myIcon.src = userData.imageSrc;
      myName.innerHTML = userData.name;

      var opponentIcon = this._view.getElementById('winning-losing-opponent-icon');
      var opponentName = this._view.getElementById('winning-losing-opponent-name');
      opponentIcon.src = opponentData.imageSrc;
      opponentName.innerHTML = opponentData.name;

      var winnerIcon = this._view.getElementById('winner-icon');
      var loserIcon = this._view.getElementById('loser-icon');

      if (isVictory) {
        winnerIcon.style.top = "150px";
        winnerIcon.style.left = "10px";
        loserIcon.style.top = "150px";
        loserIcon.style.left = "340px";
        winLoseLabel.innerHTML = "You Win";
      } else {
        winnerIcon.style.top = "150px";
        winnerIcon.style.left = "340px";
        loserIcon.style.top = "150px";
        loserIcon.style.left = "10px";
        winLoseLabel.innerHTML = "You Lose";
      }
      var winningLosingArea = this._view.getElementById('winning-losing-area');
      winningLosingArea.style.display = "block";
    }
  }]);

  return WinLoseViewController;
})();

exports['default'] = WinLoseViewController;
module.exports = exports['default'];