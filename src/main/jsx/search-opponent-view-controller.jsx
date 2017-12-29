import Spinner from '../script/spin/spin';
import PeerController from '../script/peer-controller';

export default class SearchOpponentViewController {

    constructor(view) {
        this._view = view;

        var opts = {
        	lines: 13, // The number of lines to draw
        	length: 33, // The length of each line
        	width: 11, // The line thickness
        	radius: 16, // The radius of the inner circle
        	corners: 1, // Corner roundness (0..1)
        	rotate: 74, // The rotation offset
        	direction: 1, // 1: clockwise, -1: counterclockwise
        	color: '#000', // #rgb or #rrggbb or array of colors
        	speed: 1.5, // Rounds per second
        	trail: 71, // Afterglow percentage
        	shadow: true, // Whether to render a shadow
        	hwaccel: true, // Whether to use hardware acceleration
        	className: 'spinner', // The CSS class to assign to the spinner
        	zIndex: 2e9, // The z-index (defaults to 2000000000)
        	top: '50%', // Top position relative to parent
        	left: '50%' // Left position relative to parent
        };
        this._target = document.getElementById('spin-area');
        this._spinner = new Spinner(opts);

        // Peerからのメッセージを受信した場合の通知
        this.notificationOfReceiveMessage = this.notificationOfReceiveMessage.bind(this);
    }

    initialize() {
        // spinnerを表示
        this._spinner.spin(this._target);

        this._peerController = new PeerController(this.notificationOfReceiveMessage);
        this._peerController.initialize();
    }

    // Peerからのメッセージを受信した場合の通知
    notificationOfReceiveMessage(data) {
      alert("メッセージ受信(search):" + data.userName);
    }

}
