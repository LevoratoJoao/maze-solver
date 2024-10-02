const BOARD_ROWS = 16; // TODO: Add input to decide how many rows and cols the board has
const BOARD_COLS = BOARD_ROWS;

// Creating the canvas and the board
type State = 'path' | 'wall';
const board: Array<Array<State>> = [];
for (let r = 0; r < BOARD_ROWS; r++) {
    board.push(new Array(BOARD_COLS).fill('path'));
}

const canvasId = "app"
const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
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
function render() {
    if (!ctx) {
        throw new Error('2d context is not available');
    }
    ctx.fillStyle = "#202020"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    for (let r = 0; r < BOARD_ROWS; r++) {
        for (let c = 0; c < BOARD_COLS; c++) {
            if (board[r][c] === 'wall') {
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
    if (board[col][row] === 'wall') {
        board[col][row] = 'path';
    }
    render();
});

canvas.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
        let col = Math.floor(e.offsetX / CELL_WIDTH);
        let row = Math.floor(e.offsetY / CELL_HEIGHT);
        if (board[col][row] === 'path') {
            board[col][row] = 'wall';
        }
        render();
    }
});

canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
});

render();