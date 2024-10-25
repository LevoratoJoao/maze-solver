const BOARD_ROWS = 16; // TODO: Add input to decide how many rows and cols the board has
const BOARD_COLS = BOARD_ROWS;

// Types and colors
type Board = number[][];
// 0: path, 1: wall, 2: start, 3: goal, 4: route
const stateColor = ["#202020", "#555555", "#50FF50", "#50FFFF", "#FF5050"];

interface GraphNode {
    value: string;
    neighbors: GraphNode[];
}

class Graph {
    private nodes: GraphNode[];

    constructor() {
        this.nodes = [];
    }

    addNode(value: string): void {
        const node: GraphNode = { value, neighbors: [] };
        this.nodes.push(node);
    }

    addEdge(source: GraphNode, destination: GraphNode): void {
        source.neighbors.push(destination);
    }

    dfs(startNode: GraphNode): void {
        const visited = new Set();
        const stack: GraphNode[] = [startNode];

        while (stack.length > 0) {
            const currentNode = stack.pop()!;
            if (!visited.has(currentNode)) {
                visited.add(currentNode);
                console.log(currentNode.value);

                for (const neighbor of currentNode.neighbors) {
                    if (!visited.has(neighbor)) {
                        stack.push(neighbor);
                    }
                }
            }
        }
    }
}

class Game {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D | null;
    private _board: Board = [];
    private _start: number[] = [];
    private _goal: number[] = [];

    constructor() {
        this._board = this.createBoard();
        this._canvas = document.getElementById("app") as HTMLCanvasElement;
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
            board.push(new Array<number>(BOARD_COLS).fill(0));
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

const game = new Game();

// Creating the cells
const CELL_WIDTH = game.canvas.width / BOARD_COLS;
const CELL_HEIGHT = game.canvas.height / BOARD_ROWS;

game.canvas.addEventListener('click', (e) => {
    const col = Math.floor(e.offsetX / CELL_WIDTH);
    const row = Math.floor(e.offsetY / CELL_HEIGHT);

    const state = document.getElementsByName("state");
    for (let i = 0; i < state.length; i++) {
        if ((state[i] as HTMLInputElement).checked) {
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
        const selectedState = document.querySelector('input[name="state"]:checked') as HTMLInputElement;
        if (selectedState && selectedState.value === "wall") {
            game.board[col][row] = 1;
        } else if (selectedState && selectedState.value === "path") {
            game.board[col][row] = 0;
        }
        game.render();
    }
});

game.canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
});

game.render();

function solve() {
    const path: number[][] = dfs();

    for (const p of path) {
        const x = p[0] * CELL_HEIGHT;
        const y = p[1] * CELL_WIDTH;

        game.ctx.fillStyle = stateColor[4];
        game.ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
    }
}

function getNeighbours(cell: number[]): number[][] {
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

function dfs(): number[][] {
    const visitedCells = new Map<string, number[]>();
    const stack: number[][] = [game.start];
    const path: number[][] = [];

    while (stack.length > 0) {
        const currentCell = stack.pop()!;
        if (!visitedCells.has(currentCell.toString())) {
            visitedCells.set(currentCell.toString(), currentCell);
            // Explore neighboring cells
            for (const neighbour of getNeighbours(currentCell)) {
                if (game.goal.every((val, index) => val === neighbour[index])) {
                    return path;
                }
                if (!visitedCells.has(neighbour.toString())) {
                    path.push(neighbour);
                    stack.push(neighbour);
                }
            }
        }
    }
    return [];
}