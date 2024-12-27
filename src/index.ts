const sizeOptions = document.getElementById("size-options") as HTMLElement;
const selectedOption = document.querySelector('input[name="size"]:checked') as HTMLInputElement;

let BOARD_ROWS: number = Number(selectedOption.value);
let BOARD_COLS = BOARD_ROWS;

type Board = number[][];

interface States {
    [solve: string]: Array<number | string>;
};
const states: States = {
    "path"  : [0, "#202020"],
    "wall"  : [1, "#555555"],
    "start" : [2, "#50FF50"],
    "goal"  : [3, "#50FFFF"],
    "route" : [4, "#FF5050"]
};

let pathTimer: NodeJS.Timeout | null = null;
let mazePath: number[][] = [];

interface Cell {
    position    : number[];
    stringValue : string;
    gCost       : number;
    cost        : number;
}

class Game {

    private _canvas        : HTMLCanvasElement;
    private _ctx           : CanvasRenderingContext2D | null;
    private _board         : Board = [];
    private _start         : number[] = [];
    private _goal          : number[] = [];
    private _CELL_WIDTH    : number = 0;
    private _CELL_HEIGHT   : number = 0;

    constructor() {
        this._board = [];
        this.createEmptyBoard();
        this.createRandomBoard = this.createRandomBoard.bind(this);
        this.createEmptyBoard = this.createEmptyBoard.bind(this);
        this._canvas = document.getElementById("app") as HTMLCanvasElement;
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
        this._CELL_WIDTH = this._canvas.width / value;
    }

    public get CELL_HEIGHT(): number {
        return this._CELL_HEIGHT;
    }

    public set CELL_HEIGHT(value: number) {
        this._CELL_HEIGHT = this._canvas.height / value;
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
        for (let r = 0; r < BOARD_ROWS; ++r) {
            for (let c = 0; c < BOARD_COLS; ++c) {
                const x = c * this.CELL_WIDTH;
                const y = r * this.CELL_HEIGHT;
                if (this._ctx) {
                    switch (this._board[r][c]) {
                        case 0:
                            this._ctx.fillStyle = states["path"][1] as string;
                            this._ctx.fillRect(x, y, this.CELL_WIDTH, this.CELL_HEIGHT);
                            break;
                            case 1:
                            this._ctx.fillStyle = states["wall"][1] as string;
                            this._ctx.fillRect(x, y, this.CELL_WIDTH, this.CELL_HEIGHT);
                            break;
                        case 2:
                            this._start = [r, c];
                            this._ctx.fillStyle = states["start"][1] as string;
                            this._ctx.fillRect(x, y, this.CELL_WIDTH, this.CELL_HEIGHT);
                            break;
                        case 3:
                            this._goal = [r, c];
                            this._ctx.fillStyle = states["goal"][1] as string;
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

sizeOptions.addEventListener('change', (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target && target.name === "size") {
        BOARD_ROWS = Number(target.value);
        BOARD_COLS = BOARD_ROWS;
        game.CELL_HEIGHT = BOARD_ROWS;
        game.CELL_WIDTH = BOARD_COLS;
        game.createRandomBoard();
    }
})

game.canvas.addEventListener('click', (e) => {
    const col = Math.floor(e.offsetX / game.CELL_WIDTH);
    const row = Math.floor(e.offsetY / game.CELL_HEIGHT);

    //const state = document.getElementsByName("state");
    const state = document.querySelector('input[name="state"]:checked') as HTMLInputElement;
    console.log(state.value);
    if (state.value === "start" && game.start.length > 0) {
        if (game.goal[0] === row && game.goal[1] === col) {
            game.goal = [];
        }
        game.board[game.start[0]][game.start[1]] = 0;
    } else if (state.value === "goal" && game.goal.length > 0) {
        if (game.start[0] === row && game.start[1] === col) {
            game.start = [];
        }
        game.board[game.goal[0]][game.goal[1]] = 0;
    }
    console.log(states[state.value][0] as number);
    game.board[row][col] = states[state.value][0] as number;
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

interface SolveOptions {
    [solve: string]: number[][]
};

function solve() {
    const solveOptions: SolveOptions = {
        "dfs"    : dfs(),
        "bfs"    : bfs(),
        "gbfs" : gbfs(),
        "astar"  : astar()
    };
    const solveSelected = document.querySelector('input[name="solve"]:checked') as HTMLInputElement;

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
                game.ctx.fillStyle = states["route"][1] as string;
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

        game.ctx.fillStyle = states["path"][1] as string;
        game.ctx.fillRect(x, y, game.CELL_WIDTH, game.CELL_HEIGHT);
    }
}

function getNeighbours(cell: number[]): number[][] {
    const directions = [
        [-1, 0], [1, 0], // vertical
        [0, -1], [0, 1]  // horizontal
    ];
    let ngb: number[][] = [];
    for (const [dr, dc] of directions) {
        const r = cell[0] + dr;
        const c = cell[1] + dc;
        if ((0 <= r && r < BOARD_ROWS) && (0 <= c && c < BOARD_COLS)) {
            console.log(`Checking neighbor at (${r}, ${c}): ${game.board[r][c]}`);

            if (game.board[r][c] === 0 || game.board[r][c] === 3) {
                ngb.push([r, c]);
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
    let bestNeighbour: Cell = { position: [], stringValue: "", gCost:0, cost: -1};
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

function gbfs(): number[][] {
    let currentCell: Cell = {position: game.start, stringValue: game.start.toString(), gCost:0, cost: 0};
    const visitedCells = new Set<string>();
    const ngbsHeuristic = new PriorityQueue();
    const mazePath: number[][] = [];

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
                    ngbsHeuristic.push({position: neighbour, stringValue: neighbour.toString(), gCost:0, cost: euclideanHeuristic(neighbour, game.goal)});
                }
            }
        }
    }
    console.log("Goal was not found, current path: ", mazePath);
    return mazePath;
}

function astarHeuristic(neighbour: number[], goal: number[]): number {
    return manhanttanHeuristic(neighbour, goal);
}

function astar(): number[][] {
    const visitedCells = new Set<string>();
    const priorityQueue = new PriorityQueue();
    const gCosts = new Map<string, number>();
    const mazePath: number[][] = [];

    let currentCell: Cell = {position: game.start, stringValue: game.start.toString(), gCost:0, cost: 0};
    priorityQueue.push(currentCell);
    gCosts.set(currentCell.stringValue, 0);

    while (!priorityQueue.isEmpty()) {
        currentCell = priorityQueue.pop();
        if (currentCell.stringValue === game.goal.toString()) {
            console.log("Goal was found, path: ", mazePath);
            mazePath.shift();
            return mazePath
        }
        if (!visitedCells.has(currentCell.stringValue)) {
            visitedCells.add(currentCell.stringValue);
            mazePath.push(currentCell.position);
            for (const neighbour of getNeighbours(currentCell.position)) {
                const gCost = gCosts.get(currentCell.stringValue)! + 1;
                const fCost = gCost + astarHeuristic(neighbour, game.goal);
                if (!gCosts.has(neighbour.toString()) || gCost < gCosts.get(neighbour.toString())!) {
                    gCosts.set(neighbour.toString(), gCost);
                    if (!visitedCells.has(neighbour.toString())) {
                        priorityQueue.push({position: neighbour, stringValue: neighbour.toString(), gCost: gCost, cost: fCost});
                    }
                }
            }
        }
    }
    return mazePath;
}
