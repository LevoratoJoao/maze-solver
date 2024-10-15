"use strict";
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
