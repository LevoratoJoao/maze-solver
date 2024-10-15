import { Board, State, stateColor, CELL_WIDTH, CELL_HEIGHT, BOARD_ROWS, BOARD_COLS } from "./index.mjs";

export class Game {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D | null;
    private _board: Board = []
    private _start: number[] = [];
    private _goal: number[] = [];

    constructor() {
        this._board = this.createBoard();
        this._canvas = document.getElementById('app') as HTMLCanvasElement;;
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

    public get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    public get board(): Board {
        return this._board;
    }

    public get ctx(): CanvasRenderingContext2D {
        if (this._ctx === null) {
            throw new Error('Could not initialize 2d context');
        }
        return this._ctx;
    }

    public get start(): number[] {
        return this._start;
    }

    public get goal(): number[] {
        return this._goal;
    }

    private createBoard(): Board {
        const board: Board = [];
        for (let r = 0; r < BOARD_ROWS; r++) {
            board.push(new Array<State>(BOARD_COLS).fill(0));
        }
        return board;
    }

    public render() {
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