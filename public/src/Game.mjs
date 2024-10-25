import { stateColor, CELL_WIDTH, CELL_HEIGHT, BOARD_ROWS, BOARD_COLS } from "./index.mjs";
export class Game {
    constructor() {
        this._board = [];
        this._start = [];
        this._goal = [];
        this._board = this.createBoard();
        this._canvas = document.getElementById("app");
        if (this._canvas === null) {
            throw new Error('Could not find canvas');
        }
        this._canvas.width = 400;
        this._canvas.height = 400;
        this._ctx = this._canvas.getContext("2d");
        if (this._ctx === null) {
            throw new Error('Could not initialize 2d context');
        }
    }
    get canvas() {
        return this._canvas;
    }
    get board() {
        return this._board;
    }
    set board(b) {
        this._board = b;
    }
    get ctx() {
        if (this._ctx === null) {
            throw new Error('Could not initialize 2d context');
        }
        return this._ctx;
    }
    get start() {
        return this._start;
    }
    get goal() {
        return this._goal;
    }
    createBoard() {
        const board = [];
        for (let r = 0; r < BOARD_ROWS; r++) {
            board.push(new Array(BOARD_COLS).fill(0));
        }
        return board;
    }
    render() {
        for (let r = 0; r < BOARD_ROWS; ++r) {
            for (let c = 0; c < BOARD_COLS; ++c) {
                const x = r * CELL_HEIGHT;
                const y = c * CELL_WIDTH;
                if (this._ctx) {
                    switch (this._board[r][c]) {
                        case 0:
                            this._ctx.fillStyle = stateColor[0];
                            this._ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
                            break;
                        case 1:
                            this._ctx.fillStyle = stateColor[1];
                            this._ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
                            break;
                        case 2:
                            this._start = [r, c];
                            this._ctx.fillStyle = stateColor[2];
                            this._ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
                            break;
                        case 3:
                            this._goal = [r, c];
                            this._ctx.fillStyle = stateColor[3];
                            this._ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }
}
//# sourceMappingURL=Game.mjs.map