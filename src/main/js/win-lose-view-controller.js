export default class WinLoseViewController {

  constructor(view) {
    this._view = view;
  }

  initialize() {

  }

  display(isVictory, userData, opponentData, reasonString) {
    let winLoseLabel = this._view.getElementById('winLoseLabel');
    let reason = this._view.getElementById('winningLosingReason');
    reason.innerHTML = reasonString;

    let myIcon = this._view.getElementById('winningLosingMyIcon');
    let myName = this._view.getElementById('winningLosingMyName');
    myIcon.src = userData.imageSrc;
    myName.innerHTML = userData.name;

    let opponentIcon = this._view.getElementById('winningLosingOpponentIcon');
    let opponentName = this._view.getElementById('winningLosingOpponentName');
    opponentIcon.src = opponentData.imageSrc;
    opponentName.innerHTML = opponentData.name;

    let winnerIcon = this._view.getElementById('winnerIcon');
    let loserIcon = this._view.getElementById('loserIcon');

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
    let winningLosingArea = this._view.getElementById('winningLosingArea');
    winningLosingArea.style.display = "block";
  }
}
