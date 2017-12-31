import TitleViewController from '../script/title-view-controller';

global.window.addEventListener('DOMContentLoaded', () => {
    global.controller = new TitleViewController(global.document);
    global.controller.initialize();
}, false);
