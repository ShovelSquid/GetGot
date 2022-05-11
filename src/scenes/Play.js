class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('frog', './assets/FROG-200.png');
    }

    create() {
        const KeyCodes = Phaser.Input.Keyboard.KeyCodes;
        
        keyUp = this.input.keyboard.addKey(KeyCodes.UP);
        keyDown = this.input.keyboard.addKey(KeyCodes.DOWN);
        keyLeft = this.input.keyboard.addKey(KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(KeyCodes.RIGHT);

        keyW = this.input.keyboard.addKey(KeyCodes.W);
        keyS = this.input.keyboard.addKey(KeyCodes.S);
        keyA = this.input.keyboard.addKey(KeyCodes.A);
        keyD = this.input.keyboard.addKey(KeyCodes.D);

        this.player1 = new Player(this, 100, 200, 'frog', 0, [keyW, keyS, keyA, keyD]);
        this.player2 = new Player(this, 300, 200, 'frog', 0, [keyUp, keyDown, keyLeft, keyRight]);
    }

    update(time, delta) {
        delta /= 1000; // Turn into seconds

        this.player1.update(delta);
        this.player2.update(delta);
    }
}