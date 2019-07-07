export const isWinner = (board, player) => {
    const winningPatterns = [
        // rows
        [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }],
        [{ r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }],
        [{ r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 }],
        // crosses
        [{ r: 0, c: 0 }, { r: 1, c: 1 }, { r: 2, c: 2 }],
        [{ r: 0, c: 2 }, { r: 1, c: 1 }, { r: 2, c: 0 }],
        // columns
        [{ r: 0, c: 0 }, { r: 1, c: 0 }, { r: 2, c: 0 }],
        [{ r: 0, c: 1 }, { r: 1, c: 1 }, { r: 2, c: 1 }],
        [{ r: 0, c: 2 }, { r: 1, c: 2 }, { r: 2, c: 2 }],
    ];

    return winningPatterns.some(pattern =>
        pattern.every(square => {
            const { r, c } = square;

            return board[r][c] === player;
        })
    );
};

/**
 * Checks to see if there's a draw on the board
 * NOTE: this function is meant to be called if isWinner returns false
 * @param {number[][]} board The game board
 */
export const isDraw = board => {
    // if there are squares that have a 0 in them, that means the
    // game is still in-progress
    const notDraw = board.some(row => row.some(col => col === 0));

    return !notDraw;
};
