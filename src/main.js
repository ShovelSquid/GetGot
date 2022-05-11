/** @type {import("../typings/phaser")} */

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [Menu, Play],
    fps: 60,
    physics: {
        defaults: 'arcade',
        arcade: {
            useTree: true,
            gravity: { y: 0 },
            debug: false
        },
    },
    scale: {
        mode: Phaser.Scale.FIT,
    },
    pixelArt: true,
};

let game = new Phaser.Game(config);