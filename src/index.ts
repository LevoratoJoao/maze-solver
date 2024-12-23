const BOARD_ROWS = 16; // TODO: Add input to decide how many rows and cols the board has
const BOARD_COLS = BOARD_ROWS;

// Types and colors
type Board = number[][];
// 0: path, 1: wall, 2: start, 3: goal, 4: route
const stateColor = ["#202020", "#555555", "#50FF50", "#50FFFF", "#FF5050"];
let pathTimer: NodeJS.Timeout | null = null;
let mazePath: number[][] = [];

interface Cell {
    position: number[];
    stringValue: string;
    cost: number;
}

class Game {

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
        this.CELL_WIDTH = this._canvas.width / BOARD_COLS;
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

    public set goal(g: number[]) {
        this._goal = g;
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
        mazePath = [];
        const board: Board = [];
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

    public createRandomBoard() {
        mazePath = [];
        const board: Board = [];
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

    public render() {
        if (pathTimer) {
            clearTimeout(pathTimer);
        }
        for (let c = 0; c < BOARD_COLS; ++c) {
            for (let r = 0; r < BOARD_ROWS; ++r) {
                const x = r * this.CELL_WIDTH;
                const y = c * this.CELL_HEIGHT;
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

const game = new Game();

game.canvas.addEventListener('click', (e) => {
    const col = Math.floor(e.offsetY / game.CELL_HEIGHT);
    const row = Math.floor(e.offsetX / game.CELL_WIDTH);

    const state = document.getElementsByName("state");
    for (let i = 0; i < state.length; i++) {
        if ((state[i] as HTMLInputElement).checked) {
            if (i === 2 && game.start.length > 0) {
                if (game.goal[0] === row && game.goal[1] === col) {
                    game.goal = [];
                }
                game.board[game.start[0]][game.start[1]] = 0;
            }
            if (i === 3 && game.goal.length > 0) {
                if (game.start[0] === row && game.start[1] === col) {
                    game.start = [];
                }
                game.board[game.goal[0]][game.goal[1]] = 0;
            }
            game.board[row][col] = i;
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
        let col = Math.floor(e.offsetY / game.CELL_HEIGHT);
        let row = Math.floor(e.offsetX / game.CELL_WIDTH);
        const selectedState = document.querySelector('input[name="state"]:checked') as HTMLInputElement;
        if (selectedState && selectedState.value === "wall") {
            game.board[row][col] = 1;
        } else if (selectedState && selectedState.value === "path") {
            game.board[row][col] = 0;
        }
        game.render();
    }
});

game.canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
});

game.render();

document.getElementById("solve")?.addEventListener("click", solve);
document.getElementById("randomBoard")?.addEventListener("click", game.createRandomBoard);
document.getElementById("resetPath")?.addEventListener("click", resetPath);
document.getElementById("resetBoard")?.addEventListener("click", game.createEmptyBoard);

function solve() {
    const selectElement = document.getElementById('solve-options') as HTMLSelectElement;
    console.log("Game board: ", game.board);
    console.log("Start: ", game.start);
    console.log("Goal: ", game.goal);
    resetPath();
    switch (selectElement.selectedIndex) {
        case 1:
            mazePath = dfs();
            break;
        case 2:
            mazePath = bfs();
            break;
        case 3:
            mazePath = greedyAlgo();
            break;
        case 4:
            mazePath = astar();
            break;
        default:
            break;
    }
    let index = 0;
    function fillPath() {
        if (index < mazePath.length) {
            if ((mazePath[index][0] != game.goal[0] || mazePath[index][1] != game.goal[1])) {
                const x = mazePath[index][0] * game.CELL_HEIGHT;
                const y = mazePath[index][1] * game.CELL_WIDTH;
                game.ctx.fillStyle = stateColor[4];
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
        const x = mazePath[i][0] * game.CELL_HEIGHT;
        const y = mazePath[i][1] * game.CELL_WIDTH;

        game.ctx.fillStyle = stateColor[0];
        game.ctx.fillRect(x, y, game.CELL_WIDTH, game.CELL_HEIGHT);
    }
}

/**
 *  TODO: More optimized, try latter
    const directions = [
        [-1, 0], [1, 0], // vertical
        [0, -1], [0, 1]  // horizontal
    ];
    const neighbours = [];
    for (const [dr, dc] of directions) {
 */
function getNeighbours(cell: number[]): number[][] {
    let ngb: number[][] = [];
    for (let dr = -1; dr <= 1; ++dr) {
        for (let dc = -1; dc <= 1; ++dc) {
            if ((dr != 0 || dc != 0) && (dr != dc) && (dr != -dc)) {
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

function dfs(): number[][] {
    const visitedCells = new Set<string>();
    const stack: number[][] = [game.start];
    const mazePath: number[][] = [];

    while (stack.length > 0) {
        const currentCell = stack.pop()!;
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

function bfs(): number[][] {
    const visitedCells = new Set<string>();
    const queue: number[][] = [game.start];
    const mazePath: number[][] = [];

    while (queue.length > 0) {
        const currentCell = queue.shift()!;
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

function manhanttanHeuristic(neighbour: number[], goal: number[]): number {
    let xy1 = neighbour;
    let xy2 = goal;
    return Math.abs(xy1[0] - xy2[0]) + Math.abs(xy1[1] - xy2[1]);
}

function euclideanHeuristic(neighbour: number[], goal: number[]): number {
    let xy1 = neighbour;
    let xy2 = goal;
    return ( (xy1[0] - xy2[0]) ** 2 + (xy1[1] - xy2[1]) ** 2 ) ** 0.5;
}

function findBestNeighbour(neighbours: Array<Cell>): Cell {
    let bestNeighbour: Cell = { position: [], stringValue: "", cost: -1};
    let bestCost = Infinity;
    for (const neighbour of neighbours) {
        const cost = neighbour.cost + 1
        if (cost < bestCost) {
            bestNeighbour = neighbour;
            bestCost = cost;
        }
    }
    return bestNeighbour;
}

function greedyAlgo(): number[][] {
    let currentCell: Cell = {position: game.start, stringValue: game.start.toString(), cost: 0};
    const visitedCells = new Set<string>();
    // const ngbsHeuristic = new Array<Cell>();
    const ngbsHeuristic = new PriorityQueue();
    const mazePath: number[][] = [];

    ngbsHeuristic.push(currentCell);

    while (ngbsHeuristic.size() > 0) {
        const poppedCell = ngbsHeuristic.pop();
        currentCell = poppedCell;
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
                    ngbsHeuristic.push({position: neighbour, stringValue: neighbour.toString(), cost: euclideanHeuristic(neighbour, game.goal)});
                }
            }
            console.log(ngbsHeuristic);
            //currentCell = findBestNeighbour(ngbsHeuristic);
        }
    }
    console.log("Goal was not found, current path: ", mazePath);
    return mazePath;
}

function astar(): number[][] {
    const visitedCells = new Set<string>();
    const priorityQueue = new PriorityQueue(); // TODO
    const mazePath: number[][] = [];

    let currentCell: Cell = {position: game.start, stringValue: game.start.toString(), cost: 0};

    priorityQueue.push(currentCell);
    return mazePath;
}