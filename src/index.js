"use strict";
const BOARD_ROWS = 16; // TODO: Add input to decide how many rows and cols the board has
const BOARD_COLS = BOARD_ROWS;
const stateColor = ["#202020", "#FF5050", "#50FF50", "#5050FF"]; // 0: path, 1: wall, 2: start, 3: goal
function createBoard() {
    const board = [];
    for (let r = 0; r < BOARD_ROWS; r++) {
        board.push(new Array(BOARD_COLS).fill(0));
    }
    return board;
}
class Game {
    constructor(board, start, goal = []) {
        this.board = [];
        this.start = [];
        this.goal = [];
        this.board = board;
        this.start = start;
        this.goal = goal;
    }
}
const board = createBoard();
const canvasId = "app";
const canvas = document.getElementById(canvasId);
if (canvas === null) {
    throw new Error(`Could not find canvas ${canvasId}`);
}
canvas.width = 900;
canvas.height = 900;
const ctx = canvas.getContext("2d");
if (ctx === null) {
    throw new Error(`Could not initialize 2d context`);
}
// Rendering the cells
function render(ctx, board) {
    ctx.fillStyle = "#202020";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FF5050";
    for (let r = 0; r < BOARD_ROWS; r++) {
        for (let c = 0; c < BOARD_COLS; c++) {
            if (board[r][c] === 1) {
                const x = r * CELL_WIDTH;
                const y = c * CELL_HEIGHT;
                ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
            }
        }
    }
}
let isMouseDown = false;
// Creating the cells
const CELL_WIDTH = canvas.width / BOARD_COLS;
const CELL_HEIGHT = canvas.height / BOARD_ROWS;
canvas.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    let col = Math.floor(e.offsetX / CELL_WIDTH);
    let row = Math.floor(e.offsetY / CELL_HEIGHT);
    if (board[col][row] === 1) {
        board[col][row] = 0;
    }
    render(ctx, board);
});
canvas.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
        let col = Math.floor(e.offsetX / CELL_WIDTH);
        let row = Math.floor(e.offsetY / CELL_HEIGHT);
        if (board[col][row] === 0) {
            board[col][row] = 1;
        }
        render(ctx, board);
    }
});
canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
});
render(ctx, board);
