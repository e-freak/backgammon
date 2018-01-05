export default class WinLoseViewController {

  constructor(view) {
    this._view = view;
  }

  initialize() {

  }

  display(isVictory, userData, opponentData, reasonString) {

    let winLoseLabel = this._view.getElementById('win-lose-label');

    let reason = this._view.getElementById('winning-losing-reason');
    reason.innerHTML = reasonString;

    let myIcon = this._view.getElementById('winning-losing-my-icon');
    let myName = this._view.getElementById('winning-losing-my-name');
    myIcon.src = userData.imageSrc;
    myName.innerHTML = userData.name;

    let opponentIcon = this._view.getElementById('winning-losing-opponent-icon');
    let opponentName = this._view.getElementById('winning-losing-opponent-name');
    opponentIcon.src = opponentData.imageSrc;
    opponentName.innerHTML = opponentData.name;

    let winnerIcon = this._view.getElementById('winner-icon');
    let loserIcon = this._view.getElementById('loser-icon');

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
    let winningLosingArea = this._view.getElementById('winning-losing-area');
    winningLosingArea.style.display = "block";

  }
}
