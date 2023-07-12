// fix js % operator
function mod(a, b) {
    "use strict";
    return ((a % b) + b) % b;
};

const R2 = Math.SQRT2;
const R3 = Math.sqrt(3);

const Moves = {
    straight: [
        [0, -2],
        [1, -1],
        [1, 1],
        [0, 2],
        [-1, 1],
        [-1, -1],
    ],
    diagonal: [
        [2, 0],
        [1, 3],
        [-1, 3],
        [-2, 0],
        [-1, -3],
        [1, -3],
    ],

}

// d = dark
// l = light
// p = pawn
// r = rook
// b = bishop
// n = knight
// q = queen
// k = king
var Table = {
    // Black Pieces
    "-3,-7": "pd",
    "-2,-6": "pd",
    "-1,-5": "pd",
    "0,-4": "pd",
    "1,-5": "pd",
    "2,-6": "pd",
    "3,-7": "pd",

    "0,-6": "bd",
    "0,-8": "bd",
    "0,-10": "bd",

    "-2,-8": "rd",
    "2,-8": "rd",

    "-1,-7": "nd",
    "1,-7": "nd",

    "-1,-9": "qd",
    "1,-9": "kd",

    // White pieces
    "-3,7": "pl",
    "-2,6": "pl",
    "-1,5": "pl",
    "0,4": "pl",
    "1,5": "pl",
    "2,6": "pl",
    "3,7": "pl",

    "0,6": "bl",
    "0,8": "bl",
    "0,10": "bl",

    "-2,8": "rl",
    "2,8": "rl",

    "-1,7": "nl",
    "1,7": "nl",

    "-1,9": "ql",
    "1,9": "kl",
}
// Test board
// var Table = {
//     "0,0": "nl"
// }
const pawnInits = {
    d: [
        "-3,-7",
        "-2,-6",
        "-1,-5",
        "0,-4",
        "1,-5",
        "2,-6",
        "3,-7",
    ],
    l: [
        "-3,7",
        "-2,6",
        "-1,5",
        "0,4",
        "1,5",
        "2,6",
        "3,7",
    ]
}

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");


let selectedPiece = "";
let moves = [];

const r = 22.5;

setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const start = [canvas.width / 2, canvas.height / 2];
    ctx.strokeStyle = "black";
    for (let col = 0; col < 11; col++) {
        const rowAmount = 11 - Math.abs(col - 5);
        for (let row = 0; row < rowAmount; row++) {
            x = col - 5;
            y = 2 * row - rowAmount + 1;

            // Initialize empty tiles with "e" so to not be confused with out of bounds tiles
            if (!Table[`${x},${y}`]) Table[`${x},${y}`] = "e";

            // Draw tile
            ctx.strokeStyle = "black";
            ctx.beginPath();
            ctx.ellipse(
                start[0] + x * R3 * r,
                start[1] + y * r,
                r, r, 0, 0, 360);
            ctx.stroke();
            ctx.closePath();


            if (selectedPiece == `${x},${y}`) {
                ctx.fillStyle = "#5555ff44"
                ctx.beginPath();
                ctx.ellipse(
                    start[0] + x * R3 * r,
                    start[1] + y * r,
                    r, r, 0, 0, 360);
                ctx.fill();
                ctx.closePath();

                let piece = Table[selectedPiece];
                if (piece) {
                    switch (piece[0]) {
                        case 'p':
                            moves = [(piece[1] == 'd' ? [x, y + 2] : [x + 0, y - 2])];
                            if (pawnInits[piece[1]].includes(selectedPiece)) {
                                moves.push((piece[1] == 'd' ? [x, y + 4] : [x + 0, y - 4]))
                            }
                            // TODO: Diagonal attack moves
                            getAvailableLine(moves, false).concat().forEach((move) => {
                                ctx.fillStyle = "#55ff5544"
                                ctx.beginPath();
                                ctx.ellipse(
                                    start[0] + (move[0]) * R3 * r,
                                    start[1] + (move[1]) * r,
                                    r, r, 0, 0, 360);
                                ctx.fill();
                                ctx.closePath();
                            });
                            break;
                        case 'b':
                            moves = Moves.diagonal.map(
                                (d) => getAvailableLine(
                                    // 6 is the longest distance you can travel diagonally
                                    Array(6).fill(d).map(
                                        (v, i) => [x + v[0] * (i + 1), y + v[1] * (i + 1)]
                                    )
                                )
                            ).flat();
                            break;

                        case 'r':
                            moves = Moves.straight.map(
                                (d) => getAvailableLine(
                                    // 11 is the longest distance you can travel straight
                                    Array(11).fill(d).map(
                                        (v, i) => [x + v[0] * (i + 1), y + v[1] * (i + 1)]
                                    )
                                )
                            ).flat();
                            break;
                        case 'q':
                            moves = Moves.straight.concat(Moves.diagonal).map(
                                (d) => getAvailableLine(
                                    // 11 > 6 \_(シ)_/
                                    Array(11).fill(d).map(
                                        (v, i) => [x + v[0] * (i + 1), y + v[1] * (i + 1)]
                                    )
                                )
                            ).flat()
                            break;
                        case 'k':
                            moves = Moves.straight.concat(Moves.diagonal).map(
                                (d) => getAvailableLine([[x + d[0], y + d[1]]])
                            ).flat()
                            break;
                        case 'n':
                            moves = Moves.straight.map((a, i) => [
                                [x + a[0] * 2 + str60deg(i)[0][0], y + a[1] * 2 + str60deg(i)[0][1]],
                                [x + a[0] * 2 + str60deg(i)[1][0], y + a[1] * 2 + str60deg(i)[1][1]]
                            ]).flat().filter((v) => getAvailableLine([v]).length > 0);
                            break;

                        default:
                            break;
                    }

                    moves.forEach((move) => {
                        ctx.fillStyle = "#55ff5544"
                        ctx.beginPath();
                        ctx.ellipse(
                            start[0] + (move[0]) * R3 * r,
                            start[1] + (move[1]) * r,
                            r, r, 0, 0, 360);
                        ctx.fill();
                        ctx.closePath();
                    });
                }
            }

            // Draw piece
            if (!checkAvailable(x, y)) {
                ctx.drawImage(
                    document.getElementById(Table[`${x},${y}`]),
                    start[0] + x * R3 * r - 22.5,
                    start[1] + y * r - 22.5,
                );
            }

            // Draw debug info
            ctx.beginPath();
            ctx.strokeStyle = "blue";
            ctx.strokeText(""
                // + `${Table[`${x},${y}`] ?? ""}`
                + `(${x},${y})`
                ,
                start[0] + x * R3 * r - r / 2,
                start[1] + y * r + r / 2,
            );
            ctx.closePath();
            ctx.stroke();
        }
    }
}, 1000 / 60);

// Magic collision detection made via trial and error
canvas.addEventListener("click", (ev) => {
    const ex = ev.offsetX - 250;
    let ey = ev.offsetY - 250;
    ey = ey - r + mod(x, 2) * r;


    x = Math.round(ex / r / R3);
    if (mod(x, 2) == 0) {
        y = Math.round(ey / r / 2) * 2;
    }
    else {
        ey -= mod(ey, 2 * r);
        y = ey / (r);
        y = y - (y % 2) + 1;
    }
    if (moves.find((e) => (e[0] == x && e[1] == y))) {
        if (!checkAvailable(Table[`${x},${y}`]) && Table[`${x},${y}`][0] == "k") {
            return;
        }
        const selectedCoord = selectedPiece.split(",").map(e => Number.parseInt(e));
        Table[`${x},${y}`] = copy(Table[`${selectedCoord[0]},${selectedCoord[1]}`]);
        Table[`${selectedCoord[0]},${selectedCoord[1]}`] = "e";
        selectedPiece = "";
        moves = [];
        return;
    }
    moves = [];
    selectedPiece = `${x},${y}`;
});

function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * @param {int} i 
 * @returns {number[][]} Straight axes that make a 60deg angle with `Moves.straight[i]`
 */
function str60deg(i) {
    return [
        Moves.straight[(i + 5) % 6],
        Moves.straight[(i + 1) % 6]
    ]
}

function checkAvailable(x, y) {
    return Table[`${x},${y}`] == "e";
}

function checkOutOfBounds(x, y) {
    return Table[`${x},${y}`] == undefined;
}

function checkSameColor(x1, y1, x2, y2) {
    if (!Table[`${x},${y}`]) return true;
    if (checkAvailable(x1, y1) || checkAvailable(x2, y2)) return false;
    return Table[`${x1},${y1}`][1] == Table[`${x2},${y2}`][1];
}

/**
 * @param {Number[][]} coords
 * @param {boolean} canEatNext
 * @returns {Number[][]}
 */
function getAvailableLine(coords, canEatNext = true) {
    let ret = [];
    let hasEaten = false;
    const selectedCoord = selectedPiece.split(",").map((n) => Number.parseInt(n));
    coords.every(([x, y]) => {
        if (hasEaten) {
            return false;
        }
        if (checkOutOfBounds(x, y)) {
            return false;
        }
        if (checkAvailable(x, y)) {
            ret.push([x, y])
            return true;
        }
        else if (canEatNext && !hasEaten && !checkSameColor(x, y, selectedCoord[0], selectedCoord[1])) {
            ret.push([x, y]);
            hasEaten = true;
            return true;
        }
        return false
    });
    return ret;
}