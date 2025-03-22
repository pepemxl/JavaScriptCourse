import { KEYBOARD_KEYS } from "./constants";
import { COLORS } from "./constants";
import { pieceImagesRainbowFriends } from "./constants"
import { pieceImagesRainbowFriendsBig } from "./constants";
import { pieceImagesMario } from "./constants";

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
// defining size of my canvas
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

const nextPieceCanvas = document.getElementById('next-piece');
const nextPieceContext = nextPieceCanvas.getContext('2d');
nextPieceContext.scale(BLOCK_SIZE, BLOCK_SIZE)

let renderMode = 'colors'
const savedRenderMode = localStorage.getItem('renderMode');
if (savedRenderMode) {
    renderMode = savedRenderMode;
    renderModeSelector.value = savedRenderMode;
}


const renderModeSelector = document.getElementById('render-mode');
renderModeSelector.addEventListener('change', (event) => {
    renderMode = event.target.value;
});

// create function to base canvas for tetris
const createMatrix = (w, h) => {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}
// instance of canvas
const arena = createMatrix(COLS, ROWS);
// properties of every player
const player = {
    pos: { 
        x: 0, 
        y: 0 
    },
    matrix: null,
    score: 0,
};



const pieces = [
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    [
        [2, 2, 0],
        [0, 2, 2],
        [0, 0, 0],
    ],
    [
        [0, 3, 3],
        [3, 3, 0],
        [0, 0, 0],
    ],
    [
        [4, 4],
        [4, 4],
    ],
    [
        [0, 5, 0],
        [0, 5, 0],
        [0, 5, 0],
        [0, 5, 0],
    ],
    [
        [6, 6, 6],
        [0, 6, 0],
        [0, 0, 0],
    ],
    [
        [7, 0, 0],
        [7, 7, 7],
        [0, 0, 0],
    ],
];

const drawImage = (image, x, y) => {
    context.drawImage(image, x, y, 1, 1);
};

const drawNextPieceImage = (image, x, y) => {
    nextPieceContext.drawImage(image, x, y, 1, 1);
};

const drawMatrix = (matrix, offset) => {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                if (renderMode === 'colors'){
                    context.fillStyle = COLORS[value];
                    context.fillRect(x + offset.x, y + offset.y, 1, 1);
                } else if (renderMode === 'rainbow-friends'){
                    const pieceType = Object.keys(pieceImagesRainbowFriends)[value - 1];
                    drawImage(pieceImagesRainbowFriends[pieceType], x + offset.x, y + offset.y);
                } else if (renderMode === 'mario'){
                    const pieceType = Object.keys(pieceImagesMario)[value - 1];
                    drawImage(pieceImagesMario[pieceType], x + offset.x, y + offset.y);
                } else {
                    context.fillStyle = COLORS[value];
                    context.fillRect(x + offset.x, y + offset.y, 1, 1);
                }
            }
        });
    });
};

const draw = () => {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
};


const drawNextPiece = (pieceMatrix) => {
    // Limpiar el canvas
    nextPieceContext.fillStyle = '#000';
    nextPieceContext.fillRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);

    // Dibujar la próxima pieza
    pieceMatrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                //nextPieceContext.fillStyle = colors[value];
                //nextPieceContext.fillRect(x, y, 1, 1);
                if (renderMode === 'colors'){
                    nextPieceContext.fillStyle = COLORS[value];
                    nextPieceContext.fillRect(x, y, 1, 1);
                } else if (renderMode === 'rainbow-friends'){
                    const pieceType = Object.keys(pieceImagesRainbowFriendsBig)[value - 1];
                    drawNextPieceImage(pieceImagesRainbowFriendsBig[pieceType], x, y);
                } else if (renderMode === 'mario'){
                    const pieceType = Object.keys(pieceImagesMario)[value - 1];
                    drawNextPieceImage(pieceImagesMario[pieceType], x, y);
                } else {
                    nextPieceContext.fillStyle = COLORS[value];
                    nextPieceContext.fillRect(x, y, 1, 1);
                }
            }
        });
    });
};

const merge = (arena, player) => {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
};

const collide = (arena, player) => {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
};

const rotate = (matrix, dir) => {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
};

const playerDrop = () => {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
};

const playerMove = (dir) => {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
};

const playerReset = () => {
    const pieces = 'ILJOTSZ';
    let nextPiece = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.matrix = nextPiece;
    drawNextPiece(nextPiece);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }
};

const arenaSweep = () => {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        player.score += rowCount * 10;
        rowCount *= 2;
    }
};

const updateScore = () => {
    document.getElementById('score').innerText = player.score;
};

const createPiece = (type) => {
    if (type === 'T') {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
        ];
    } else if (type === 'O') {
        return [
            [2, 2],
            [2, 2],
        ];
    } else if (type === 'L') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3],
        ];
    } else if (type === 'J') {
        return [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0],
        ];
    } else if (type === 'I') {
        return [
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'Z') {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0],
        ];
    }
};

let dropCounter = 0;
let dropInterval = 2000;

let lastTime = 0;
const update = (time = 0) => {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    draw();
    requestAnimationFrame(update);
};

const keyDown = (e) => {
    if (e.keyCode === KEYBOARD_KEYS.LEFT) {
        playerMove(-1);
    } else if (e.keyCode === KEYBOARD_KEYS.RIGHT) {
        playerMove(1);
    } else if (e.keyCode === KEYBOARD_KEYS.DOWN) {
        playerDrop();
    } else if (e.keyCode === KEYBOARD_KEYS.UP) {
        rotate(player.matrix, -1);
    } else if (e.keyCode === KEYBOARD_KEYS.Q) {
        rotate(player.matrix, -1);
    } else if (e.keyCode === KEYBOARD_KEYS.W) {
        rotate(player.matrix, 1);
    }
};

document.addEventListener('keydown', keyDown);

playerReset();
updateScore();
update();
