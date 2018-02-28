'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _piece = require('../../app/script/piece.js');

var _piece2 = _interopRequireDefault(_piece);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * piece-controller-test.js
 */

describe('[Class] Piece', function () {
    describe('[Method] getTop()', function () {
        it('[正常] 通常処理', function () {
            var dummy_swishSound = {};
            var piece = createPiece(100, 100, false, 1, dummy_swishSound);

            _assert2.default.strictEqual(piece.getTop(), 100);
        });
    });

    function createPiece(top, left, point, isMyPiece, identityNumber, swishSound) {
        return new _piece2.default(top, left, point, isMyPiece, identityNumber, swishSound);
    }
});