export default class TitleViewController {

    constructor(view) {
        this._view = view;
    }

    initialize() {
        this._view.getElementById('button-battle').addEventListener('click', this.onClickBattleButton.bind(this));
        }

    onClickBattleButton() {
        var remote = require('electron').remote;
        var main = remote.require('./index');
        console.log('ex remote');
        main.exampleRemote();

        this._view.location.href = './game.html';
    }

}
