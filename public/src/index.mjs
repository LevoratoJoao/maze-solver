import { Game } from './Game.mjs';
export const BOARD_ROWS = 16; // TODO: Add input to decide how many rows and cols the board has
export const BOARD_COLS = BOARD_ROWS;
// 0: path, 1: wall, 2: start, 3: goal, 4: route
export const stateColor = ["#202020", "#555555", "#50FF50", "#50FFFF", "#FF5050"];
const game = new Game();
// Creating the cells
export const CELL_WIDTH = game.canvas.width / BOARD_COLS;
export const CELL_HEIGHT = game.canvas.height / BOARD_ROWS;
game.canvas.addEventListener('click', (e) => {
    const col = Math.floor(e.offsetX / CELL_WIDTH);
    const row = Math.floor(e.offsetY / CELL_HEIGHT);
    const state = document.getElementsByName("state");
    for (let i = 0; i < state.length; i++) {
        if (state[i].checked) {
            if (i === 2 && game.start.length > 0) {
                game.board[game.start[0]][game.start[1]] = 0;
            }
            if (i === 3 && game.goal.length > 0) {
                game.board[game.goal[0]][game.goal[1]] = 0;
            }
            game.board[col][row] = i;
            game.render();
            return;
        }
    }
});
let isMouseDown = false;
game.canvas.addEventListener('mousedown', () => {
    isMouseDown = true;
});
game.canvas.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
        let col = Math.floor(e.offsetX / CELL_WIDTH);
        let row = Math.floor(e.offsetY / CELL_HEIGHT);
        const selectedState = document.querySelector('input[name="state"]:checked');
        if (selectedState && selectedState.value === "wall") {
            game.board[col][row] = 1;
        }
        else if (selectedState && selectedState.value === "path") {
            game.board[col][row] = 0;
        }
        game.render();
    }
});
game.canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
});
game.render();
function randomBoard() {
    const board = game.createBoard();
    for (let r = 0; r < BOARD_ROWS; ++r) {
        for (let c = 0; c < BOARD_COLS; ++c) {
            const x = r * CELL_HEIGHT;
            const y = c * CELL_WIDTH;
            let rndColor = Math.floor(Math.random() * 2);
            board[r][c] = rndColor;
        }
    }
    game.board = board;
    game.render();
}
let mazePath = [];
function solve() {
    const selectElement = document.getElementById('solve-options');
    switch (selectElement.selectedIndex) {
        case 1:
            mazePath = dfs();
            break;
        case 2:
            mazePath = bfs();
            break;
        case 3:
            break;
        default:
            break;
    }
    for (const p of mazePath) {
        const x = p[0] * CELL_HEIGHT;
        const y = p[1] * CELL_WIDTH;
        game.ctx.fillStyle = stateColor[4];
        game.ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
    }
}
function resetPath() {
    for (const p of mazePath) {
        const x = p[0] * CELL_HEIGHT;
        const y = p[1] * CELL_WIDTH;
        game.ctx.fillStyle = stateColor[0];
        game.ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
    }
}
function resetBoard() {
    game.board = game.createBoard();
    game.render();
}
function getNeighbours(cell) {
    let ngb = [];
    for (let dr = -1; dr <= 1; ++dr) {
        for (let dc = -1; dc <= 1; ++dc) {
            if (dr != 0 || dc != 0) {
                const r = cell[0] + dr;
                const c = cell[1] + dc;
                if ((0 <= r && r < BOARD_ROWS) && (0 <= c && c < BOARD_COLS)) {
                    if (game.board[r][c] === 0 || game.board[r][c] === 3) {
                        ngb.push([r, c]);
                    }
                }
            }
        }
    }
    return ngb;
}
function dfs() {
    const visitedCells = new Map();
    const stack = [game.start];
    const mazePath = [];
    while (stack.length > 0) {
        const currentCell = stack.pop();
        if (!visitedCells.has(currentCell.toString())) {
            visitedCells.set(currentCell.toString(), currentCell);
            // Explore neighboring cells
            for (const neighbour of getNeighbours(currentCell)) {
                if (game.goal.every((val, index) => val === neighbour[index])) {
                    return mazePath;
                }
                if (!visitedCells.has(neighbour.toString())) {
                    mazePath.push(neighbour);
                    stack.push(neighbour);
                }
            }
        }
    }
    return mazePath;
}
function bfs() {
    const visitedCells = new Map();
    const queue = [game.start];
    const mazePath = [];
    visitedCells.set(game.start.toString(), game.start);
    while (queue.length > 0) {
        const currentCell = queue.pop();
        // Explore neighboring cells
        for (const neighbour of getNeighbours(currentCell)) {
            if (game.goal.every((val, index) => val === neighbour[index])) {
                return mazePath;
            }
            if (!visitedCells.has(neighbour.toString())) {
                visitedCells.set(currentCell.toString(), currentCell);
                mazePath.push(neighbour);
                queue.unshift(neighbour);
            }
        }
    }
    return mazePath;
}
//# sourceMappingURL=index.mjs.map