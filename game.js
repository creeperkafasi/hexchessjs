// fix js % operator
Number.prototype.mod = function (n) {
    "use strict";
    return ((this % n) + n) % n;
};

const R2 = Math.SQRT2;
const R3 = Math.sqrt(3);

const Moves = {
    straight: [
        [0, 2],
        [-1, 1],
        [-1, -1],
        [0, -2],
        [1, -1],
        [1, 1],
    ],
    diagonal: [
        [2, 0],
        [1, 3],
        [-1, 3],
        [-2, 0],
        [-1, -3],
        [1, -3],
    ]
}

// 0 = black
// 1 = white
// p = pawn
// r = rook
// b = bishop
// n = knight
// q = queen
// k = king
var Map = {
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


/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");


setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const r = 22.5;

    const start = [250, 250];
    ctx.strokeStyle = "black";
    for (let col = 0; col < 11; col++) {
        const rowAmount = 11 - Math.abs(col - 5);
        for (let row = 0; row < rowAmount; row++) {
            x = col - 5;
            y = 2 * row - rowAmount + 1;
            ctx.beginPath();
            ctx.ellipse(
                start[0] + x * R3 * r,
                start[1] + y * r,
                r, r, 0, 0, 360);
            if (Map[`${x},${y}`]) {
                ctx.drawImage(
                    document.getElementById(Map[`${x},${y}`]),
                    start[0] + x * R3 * r - 22.5,
                    start[1] + y * r - 22.5,
                );
            }
            // ctx.strokeText(
            //     `${Map[`${x},${y}`] ?? ""}`
            //     // + `(${x},${y})`
            //     ,
            //     start[0] + x * R3 * r - r / 2,
            //     start[1] + y * r + r / 2,
            // );

            ctx.closePath();
            ctx.stroke();
        }
    }
}, 1000 / 60);
