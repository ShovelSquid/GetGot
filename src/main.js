/** @type {import("../typings/phaser")} */

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [Menu, Play],
    fps: 60,
    physics: {
        default: 'arcade',
        arcade: {
            useTree: true,
            gravity: { y: 0 },
            debug: false
        },
    },
    scale: {
        mode: Phaser.Scale.FIT,
    },
    pixelArt: false,
};

const SCALE = 1;

let game = new Phaser.Game(config);

// define global keys
let keyW, keyS, keyA, keyD;
let keyUp, keyDown, keyLeft, keyRight;

let keyF, keyG;
let keyComma, keyPeriod;