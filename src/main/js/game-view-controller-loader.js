import GameViewController from '../script/game-view-controller';

global.window.addEventListener('DOMContentLoaded', () => {
  global.controller = new GameViewController(global.document);
  global.controller.initialize();
}, false);
