"use strict";
var _a, _b, _c, _d;
const sizeOptions = document.getElementById("size-options");
const selectedOption = document.querySelector('input[name="size"]:checked');
let BOARD_ROWS = Number(selectedOption.value);
let BOARD_COLS = BOARD_ROWS;
;
const states = {
    "path": [0, "#202020"],
    "wall": [1, "#555555"],
    "start": [2, "#50FF50"],
    "goal": [3, "#50FFFF"],
    "route": [4, "#FF5050"]
};
let pathTimer = null;
let mazePath = [];
class Game {
    constructor() {
        this._board = [];
        this._start = [];
        this._goal = [];
        this._CELL_WIDTH = 0;
        this._CELL_HEIGHT = 0;
        this._board = [];
        this.createEmptyBoard();
        this.createRandomBoard = this.createRandomBoard.bind(this);
        this.createEmptyBoard = this.createEmptyBoard.bind(this);
        this._canvas = document.getElementById("app");
        if (this._canvas === null) {
            throw new Error('Could not find canvas');
        }
        this._canvas.width = 550;
        this._canvas.height = 550;
        this._CELL_HEIGHT = this._canvas.height / BOARD_ROWS;
        this._CELL_WIDTH = this._canvas.width / BOARD_COLS;
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
    set start(s) {
        this._start = s;
    }
    get goal() {
        return this._goal;
    }
    set goal(g) {
        this._goal = g;
    }
    get CELL_WIDTH() {
        return this._CELL_WIDTH;
    }
    set CELL_WIDTH(value) {
        this._CELL_WIDTH = this._canvas.width / value;
    }
    get CELL_HEIGHT() {
        return this._CELL_HEIGHT;
    }
    set CELL_HEIGHT(value) {
        this._CELL_HEIGHT = this._canvas.height / value;
    }
    createEmptyBoard() {
        mazePath = [];
        const board = [];
        for (let r = 0; r < BOARD_ROWS; r++) {
            board[r] = [];
            for (let c = 0; c < BOARD_COLS; c++) {
                board[r][c] = 0;
            }
        }
        this._board = board;
        this._goal = [];
        this._start = [];
        this.render();
    }
    createRandomBoard() {
        mazePath = [];
        const board = [];
        for (let r = 0; r < BOARD_ROWS; r++) {
            board[r] = [];
            for (let c = 0; c < BOARD_COLS; c++) {
                let rndColor = Math.floor(Math.random() * 2);
                board[r][c] = rndColor;
            }
        }
        this._board = board;
        this._goal = [];
        this._start = [];
        this.render();
    }
    render() {
        if (pathTimer) {
            clearTimeout(pathTimer);
        }
        for (let r = 0; r < BOARD_ROWS; ++r) {
            for (let c = 0; c < BOARD_COLS; ++c) {
                const x = c * this.CELL_WIDTH;
                const y = r * this.CELL_HEIGHT;
                if (this._ctx) {
                    switch (this._board[r][c]) {
                        case 0:
                            this._ctx.fillStyle = states["path"][1];
                            this._ctx.fillRect(x, y, this.CELL_WIDTH, this.CELL_HEIGHT);
                            break;
                        case 1:
                            this._ctx.fillStyle = states["wall"][1];
                            this._ctx.fillRect(x, y, this.CELL_WIDTH, this.CELL_HEIGHT);
                            break;
                        case 2:
                            this._start = [r, c];
                            this._ctx.fillStyle = states["start"][1];
                            this._ctx.fillRect(x, y, this.CELL_WIDTH, this.CELL_HEIGHT);
                            break;
                        case 3:
                            this._goal = [r, c];
                            this._ctx.fillStyle = states["goal"][1];
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
const game = new Game();
sizeOptions.addEventListener('change', (event) => {
    const target = event.target;
    if (target && target.name === "size") {
        BOARD_ROWS = Number(target.value);
        BOARD_COLS = BOARD_ROWS;
        game.CELL_HEIGHT = BOARD_ROWS;
        game.CELL_WIDTH = BOARD_COLS;
        game.createRandomBoard();
    }
});
game.canvas.addEventListener('click', (e) => {
    let col = Math.floor(e.offsetX / game.CELL_WIDTH);
    let row = Math.floor(e.offsetY / game.CELL_HEIGHT);
    if (row === game.board.length) {
        row -= 1;
    }
    //const state = document.getElementsByName("state");
    const state = document.querySelector('input[name="state"]:checked');
    console.log(state.value);
    if (state.value === "start" && game.start.length > 0) {
        if (game.goal[0] === row && game.goal[1] === col) {
            game.goal = [];
        }
        game.board[game.start[0]][game.start[1]] = 0;
    }
    else if (state.value === "goal" && game.goal.length > 0) {
        if (game.start[0] === row && game.start[1] === col) {
            game.start = [];
        }
        game.board[game.goal[0]][game.goal[1]] = 0;
    }
    console.log(states[state.value][0]);
    console.log("Row: " + row + " Col: " + col);
    console.log("Game board: " + game.board[row][col]);
    game.board[row][col] = states[state.value][0];
    game.render();
});
let isMouseDown = false;
game.canvas.addEventListener('mousedown', () => {
    isMouseDown = true;
});
game.canvas.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
        let col = Math.floor(e.offsetX / game.CELL_WIDTH);
        let row = Math.floor(e.offsetY / game.CELL_HEIGHT);
        const selectedState = document.querySelector('input[name="state"]:checked');
        if (selectedState && selectedState.value === "wall") {
            game.board[row][col] = 1;
        }
        else if (selectedState && selectedState.value === "path") {
            game.board[row][col] = 0;
        }
        game.render();
    }
});
game.canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
});
game.render();
(_a = document.getElementById("solve")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", solve);
(_b = document.getElementById("randomBoard")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", game.createRandomBoard);
(_c = document.getElementById("resetPath")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", resetPath);
(_d = document.getElementById("resetBoard")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", game.createEmptyBoard);
;
function solve() {
    const solveOptions = {
        "dfs": dfs(),
        "bfs": bfs(),
        "gbfs": gbfs(),
        "ucs": ucs(),
        "astar": astar()
    };
    const solveSelected = document.querySelector('input[name="solve"]:checked');
    console.log("Game board: ", game.board);
    console.log("Start: ", game.start);
    console.log("Goal: ", game.goal);
    console.log("Solve option: ", solveSelected.value);
    resetPath();
    mazePath = solveOptions[solveSelected.value];
    let index = 0;
    function fillPath() {
        if (index < mazePath.length) {
            if ((mazePath[index][0] != game.goal[0] || mazePath[index][1] != game.goal[1])) {
                const x = mazePath[index][1] * game.CELL_WIDTH;
                const y = mazePath[index][0] * game.CELL_HEIGHT;
                game.ctx.fillStyle = states["route"][1];
                game.ctx.fillRect(x, y, game.CELL_WIDTH, game.CELL_HEIGHT);
            }
            index++;
            pathTimer = setTimeout(fillPath, 100);
        }
    }
    fillPath();
}
function resetPath() {
    if (pathTimer) {
        clearTimeout(pathTimer);
    }
    for (let i = 0; i < mazePath.length; i++) {
        const x = mazePath[i][1] * game.CELL_WIDTH;
        const y = mazePath[i][0] * game.CELL_HEIGHT;
        game.ctx.fillStyle = states["path"][1];
        game.ctx.fillRect(x, y, game.CELL_WIDTH, game.CELL_HEIGHT);
    }
}
function getNeighbours(cell) {
    const directions = [
        [-1, 0], [1, 0], // vertical
        [0, -1], [0, 1] // horizontal
    ];
    let ngb = [];
    for (const [dr, dc] of directions) {
        const r = cell[0] + dr;
        const c = cell[1] + dc;
        if ((0 <= r && r < BOARD_ROWS) && (0 <= c && c < BOARD_COLS)) {
            if (game.board[r][c] === 0 || game.board[r][c] === 3) {
                ngb.push([r, c]);
            }
        }
    }
    return ngb;
}
function dfs() {
    const visitedCells = new Set();
    const stack = [game.start];
    const mazePath = [];
    while (stack.length > 0) {
        const currentCell = stack.pop();
        if (game.goal.toString() === currentCell.toString()) {
            console.log("Goal was found, path: ", mazePath);
            mazePath.shift();
            return mazePath;
        }
        if (!visitedCells.has(currentCell.toString())) {
            visitedCells.add(currentCell.toString());
            mazePath.push(currentCell);
            // Explore neighboring cells
            for (const neighbour of getNeighbours(currentCell)) {
                if (!visitedCells.has(neighbour.toString())) {
                    stack.push(neighbour);
                }
            }
        }
    }
    console.log("Goal was not found, current path: ", mazePath);
    return mazePath;
}
function bfs() {
    const visitedCells = new Set();
    const queue = [game.start];
    const mazePath = [];
    while (queue.length > 0) {
        const currentCell = queue.shift();
        if (game.goal.toString() === currentCell.toString()) {
            console.log("Goal was found, path: ", mazePath);
            mazePath.shift();
            return mazePath;
        }
        if (!visitedCells.has(currentCell.toString())) {
            visitedCells.add(currentCell.toString());
            mazePath.push(currentCell);
            // Explore neighboring cells
            for (const neighbour of getNeighbours(currentCell)) {
                if (!visitedCells.has(neighbour.toString())) {
                    queue.push(neighbour);
                }
            }
        }
    }
    console.log("Goal was not found, current path: ", mazePath);
    return mazePath;
}
function manhanttanHeuristic(neighbour, goal) {
    let xy1 = neighbour;
    let xy2 = goal;
    return Math.abs(xy1[0] - xy2[0]) + Math.abs(xy1[1] - xy2[1]);
}
function euclideanHeuristic(neighbour, goal) {
    let xy1 = neighbour;
    let xy2 = goal;
    return Math.pow((Math.pow((xy1[0] - xy2[0]), 2) + Math.pow((xy1[1] - xy2[1]), 2)), 0.5);
}
function chebyshevHeuristic(neighbour, goal) {
    let xy1 = neighbour;
    let xy2 = goal;
    return Math.max(Math.abs(xy2[0] - xy1[0]), Math.abs(xy2[1] - xy1[1]));
}
// function findBestNeighbour(neighbours: Array<Cell>): Cell {
//     let bestNeighbour: Cell = { position: [], stringValue: "", gCost:0, cost: -1};
//     let bestCost = Infinity;
//     for (const neighbour of neighbours) {
//         const cost = neighbour.cost + 1
//         if (cost < bestCost) {
//             bestNeighbour = neighbour;
//             bestCost = cost;
//         }
//     }
//     return bestNeighbour;
// }
function ucs() {
    const visitedCells = new Set();
    const priorityQueue = new PriorityQueue();
    const mazePath = [];
    let cost = 0;
    let currentCell = { position: game.start, stringValue: game.start.toString(), gCost: 0, cost: 0 };
    priorityQueue.push(currentCell);
    while (!priorityQueue.isEmpty()) {
        currentCell = priorityQueue.pop();
        if (currentCell.stringValue === game.goal.toString()) {
            console.log("Goal was found, path: ", mazePath);
            mazePath.shift();
            return mazePath;
        }
        if (!visitedCells.has(currentCell.stringValue)) {
            visitedCells.add(currentCell.stringValue);
            mazePath.push(currentCell.position);
            for (let neighbour of getNeighbours(currentCell.position)) {
                if (!visitedCells.has(neighbour.toString())) {
                    priorityQueue.push({ position: neighbour, stringValue: neighbour.toString(), gCost: 0, cost: cost + 1 });
                }
            }
        }
    }
    console.log("Goal was not found, current path: ", mazePath);
    return mazePath;
}
function heuristic(neighbour, goal) {
    const heuristicSelected = document.querySelector('input[name="heuristic"]:checked');
    switch (heuristicSelected.value) {
        case "manhattan":
            return manhanttanHeuristic(neighbour, goal);
        case "euclidean":
            return euclideanHeuristic(neighbour, goal);
        case "chebyshev":
            return chebyshevHeuristic(neighbour, goal);
        default:
            break;
    }
    return 0;
}
function gbfs() {
    let currentCell = { position: game.start, stringValue: game.start.toString(), gCost: 0, cost: 0 };
    const visitedCells = new Set();
    const ngbsHeuristic = new PriorityQueue();
    const mazePath = [];
    ngbsHeuristic.push(currentCell);
    while (ngbsHeuristic.size() > 0) {
        currentCell = ngbsHeuristic.pop();
        if (game.goal.toString() === currentCell.stringValue) {
            console.log("Goal was found, path: ", mazePath);
            mazePath.shift();
            return mazePath;
        }
        if (!visitedCells.has(currentCell.stringValue)) {
            visitedCells.add(currentCell.stringValue);
            mazePath.push(currentCell.position);
            for (const neighbour of getNeighbours(currentCell.position)) {
                if (!visitedCells.has(neighbour.toString())) {
                    ngbsHeuristic.push({ position: neighbour, stringValue: neighbour.toString(), gCost: 0, cost: heuristic(neighbour, game.goal) });
                }
            }
        }
    }
    console.log("Goal was not found, current path: ", mazePath);
    return mazePath;
}
function astar() {
    const visitedCells = new Set();
    const priorityQueue = new PriorityQueue();
    const gCosts = new Map();
    const mazePath = [];
    let currentCell = { position: game.start, stringValue: game.start.toString(), gCost: 0, cost: 0 };
    priorityQueue.push(currentCell);
    gCosts.set(currentCell.stringValue, 0);
    while (!priorityQueue.isEmpty()) {
        currentCell = priorityQueue.pop();
        if (currentCell.stringValue === game.goal.toString()) {
            console.log("Goal was found, path: ", mazePath);
            mazePath.shift();
            return mazePath;
        }
        if (!visitedCells.has(currentCell.stringValue)) {
            visitedCells.add(currentCell.stringValue);
            mazePath.push(currentCell.position);
            for (const neighbour of getNeighbours(currentCell.position)) {
                const gCost = gCosts.get(currentCell.stringValue) + 1;
                const fCost = gCost + heuristic(neighbour, game.goal);
                if (!gCosts.has(neighbour.toString()) || gCost < gCosts.get(neighbour.toString())) {
                    gCosts.set(neighbour.toString(), gCost);
                    if (!visitedCells.has(neighbour.toString())) {
                        priorityQueue.push({ position: neighbour, stringValue: neighbour.toString(), gCost: gCost, cost: fCost });
                    }
                }
            }
        }
    }
    console.log("Goal was not found, current path: ", mazePath);
    return mazePath;
}
//# sourceMappingURL=index.js.map