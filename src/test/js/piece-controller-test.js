/**
 * piece-controller-test.js
 */

import assert from 'assert';

import Piece from '../../app/script/piece.js';

describe('[Class] Piece', () => {
    describe('[Method] getTop()', () => {
        it('[正常] 通常処理', () => {
            var dummy_swishSound = {};
            const piece = createPiece(100, 100, false, 1, dummy_swishSound);

            assert.strictEqual(piece.getTop(), 100);
        });
    });

    function createPiece(top, left, point, isMyPiece, identityNumber, swishSound) {
        return new Piece(top, left, point, isMyPiece, identityNumber, swishSound);
    }
});
