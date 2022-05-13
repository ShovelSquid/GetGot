class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('player', './assets/triangle.png');
        this.load.image('frog', './assets/FROG-200.png');
        this.load.image('background', './assets/background.png');
    }

    create() {
        const KeyCodes = Phaser.Input.Keyboard.KeyCodes;

        this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setOrigin(0, 0);
        
        keyUp = this.input.keyboard.addKey(KeyCodes.UP);
        keyDown = this.input.keyboard.addKey(KeyCodes.DOWN);
        keyLeft = this.input.keyboard.addKey(KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(KeyCodes.RIGHT);

        keyW = this.input.keyboard.addKey(KeyCodes.W);
        keyS = this.input.keyboard.addKey(KeyCodes.S);
        keyA = this.input.keyboard.addKey(KeyCodes.A);
        keyD = this.input.keyboard.addKey(KeyCodes.D);

        // f, g = slash, charge
        keyF = this.input.keyboard.addKey(KeyCodes.F);
        keyG = this.input.keyboard.addKey(KeyCodes.G);
        // ,, . = slash, charge
        keyComma = this.input.keyboard.addKey(KeyCodes.COMMA);
        keyPeriod = this.input.keyboard.addKey(KeyCodes.PERIOD);

        this.player1 = new Player(this, 100, 200, 'frog', 0, [keyW, keyS, keyA, keyD, keyF, keyG]);
        this.player2 = new Player(this, 300, 200, 'frog', 0, [keyUp, keyDown, keyLeft, keyRight, keyComma, keyPeriod]);

        const borderWidth = 10;
        this.add.rectangle(0, 0, game.config.width, borderWidth, 0x63452b).setOrigin(0,0);
        this.add.rectangle(0, 0, borderWidth, game.config.height, 0x63452b).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderWidth, game.config.width, borderWidth, 0x63452b).setOrigin(0,0);
        this.add.rectangle(game.config.width - borderWidth, 0, borderWidth, game.config.height, 0x63452b).setOrigin(0,0);
    }

    update(time, delta) {
        delta /= 1000; // Turn into seconds

        this.player1.update(delta);
        this.player2.update(delta);
    }
}