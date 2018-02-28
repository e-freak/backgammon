'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WinLoseViewController = function () {
  function WinLoseViewController(view) {
    _classCallCheck(this, WinLoseViewController);

    this._view = view;
  }

  _createClass(WinLoseViewController, [{
    key: 'initialize',
    value: function initialize() {
      this._view.getElementById('goToTopButton').addEventListener('click', this.onClickGotoTopButton.bind(this));
    }
  }, {
    key: 'display',
    value: function display(isVictory, userData, opponentData, reasonString, myChips) {
      var winLoseLabel = this._view.getElementById('winLoseLabel');
      var reason = this._view.getElementById('winningLosingReason');
      reason.innerHTML = reasonString;

      var myIcon = this._view.getElementById('winningLosingMyIcon');
      var myName = this._view.getElementById('winningLosingMyName');
      myIcon.src = userData.imageSrc;
      myName.innerHTML = userData.name;

      var opponentIcon = this._view.getElementById('winningLosingOpponentIcon');
      var opponentName = this._view.getElementById('winningLosingOpponentName');
      opponentIcon.src = opponentData.imageSrc;
      opponentName.innerHTML = opponentData.name;

      var winnerIcon = this._view.getElementById('winnerIcon');
      var loserIcon = this._view.getElementById('loserIcon');

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
      var winningLosingArea = this._view.getElementById('winningLosingArea');
      winningLosingArea.style.display = "block";

      // チップ
      var myChipsLabel = this._view.getElementById('winningLosingMyChips');
      myChipsLabel.innerHTML = "$" + myChips;
    }
  }, {
    key: 'onClickGotoTopButton',
    value: function onClickGotoTopButton() {
      history.back();
    }
  }]);

  return WinLoseViewController;
}();

exports.default = WinLoseViewController;