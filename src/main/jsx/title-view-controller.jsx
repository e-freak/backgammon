export default class TitleViewController {
    
    constructor(view) {
        this._view = view;
    }
    
    initialize() {
        this._view.getElementById('button-battle').addEventListener('click', this.onClickBattleButton);
    }
    
    onClickBattleButton() {
        this.textContent = 'coming soon..';
    }
    
}

