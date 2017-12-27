import SearchOpponentViewController from '../script/search-opponent-view-controller';

global.window.addEventListener('DOMContentLoaded', () => {
    global.controller = new SearchOpponentViewController(global.document);
    global.controller.initialize();
}, false);
