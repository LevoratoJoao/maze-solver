import { Board, stateColor, BOARD_ROWS, BOARD_COLS } from "./index.mjs";

export class Game {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D | null;
    private _board: Board = [];
    private _start: number[] = [];
    private _goal: number[] = [];
    private _CELL_WIDTH: number = 0;
    private _CELL_HEIGHT: number = 0;

    constructor() {
        this._board = [];
        this.createEmptyBoard();
        this.createRandomBoard = this.createRandomBoard.bind(this);
        this.createEmptyBoard = this.createEmptyBoard.bind(this);
        this._canvas = document.getElementById("app") as HTMLCanvasElement;
        if (this._canvas === null) {
            throw new Error('Could not find canvas');
        }
        this._canvas.width = 400;
        this._canvas.height = 400;
        this.CELL_HEIGHT = this._canvas.height / BOARD_ROWS;
        this.CELL_WIDTH = this._canvas.height / BOARD_COLS;
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

    public set board(b: Board) {
        this._board = b;
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

    public set start(s: number[]) {
        this._start = s;
    }

    public get goal(): number[] {
        return this._goal;
    }

    public get CELL_WIDTH(): number {
        return this._CELL_WIDTH;
    }

    public set CELL_WIDTH(value: number) {
        this._CELL_WIDTH = value;
    }

    public get CELL_HEIGHT(): number {
        return this._CELL_HEIGHT;
    }

    public set CELL_HEIGHT(value: number) {
        this._CELL_HEIGHT = value;
    }

    public createEmptyBoard() {
        const board: Board = [];
        for (let r = 0; r < BOARD_ROWS; r++) {
            board.push(new Array<number>(BOARD_COLS).fill(0));
        }
        this._board = board;
        this._goal = [];
        this._start = [];
        this.render();
    }

    public createRandomBoard() {
        const board: Board = [];
        for (let r = 0; r < BOARD_ROWS; r++) {
            board[r] = []
            for (let c = 0; c < BOARD_COLS; c++) {
                const x = r * this.CELL_HEIGHT;
                const y = c * this.CELL_WIDTH;
                let rndColor = Math.floor(Math.random() * 2)
                board[r][c] = rndColor;
            }
        }
        this._board = board;
        this._goal = [];
        this._start = [];
        this.render();
    }

    public render() {
        for (let r = 0; r < BOARD_ROWS; ++r) {
            for (let c = 0; c < BOARD_COLS; ++c) {
                const x = r * this.CELL_HEIGHT;
                const y = c * this.CELL_WIDTH;
                if (this._ctx) {
                    switch (this._board[r][c]) {
                        case 0:
                            this._ctx.fillStyle = stateColor[0];
                            this._ctx.fillRect(x, y, this.CELL_WIDTH, this.CELL_HEIGHT);
                            break;
                        case 1:
                            this._ctx.fillStyle = stateColor[1];
                            this._ctx.fillRect(x, y, this.CELL_WIDTH, this.CELL_HEIGHT);
                            break;
                        case 2:
                            this._start = [r, c];
                            this._ctx.fillStyle = stateColor[2];
                            this._ctx.fillRect(x, y, this.CELL_WIDTH, this.CELL_HEIGHT);
                            break;
                        case 3:
                            this._goal = [r, c];
                            this._ctx.fillStyle = stateColor[3];
                            this._ctx.fillRect(x, y, this.CELL_WIDTH, this.CELL_HEIGHT);
                            break;

                        default:
                            break;
                    }
                }
            }
        }
    }
}