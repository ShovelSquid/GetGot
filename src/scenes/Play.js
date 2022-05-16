class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.spritesheet('player', './assets/Player_Triangle-Sheet.png', {
            frameWidth: 100,
            frameHeight: 100,
            startFrame: 0,
            endFrame: 11,
        });
        this.load.spritesheet('explosion', './assets/explosionado-Sheet.png', {
            frameWidth: 32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 4
        });
        this.load.image('player', './assets/triangle.png');
        this.load.image('frog', './assets/FROG-200.png');
        this.load.image('background', './assets/background.png');
    }

    create() {
        // Player Animations
        this.anims.create({
            key: 'player_triangle_idle',
            frames: this.anims.generateFrameNames('player', {start: 5, end: 8}),
            frameRate: 12, 
            repeat: -1
        });
        this.anims.create({
            key: 'player_triangle_run',
            frames: this.anims.generateFrameNames('player', {start: 9, end: 11}),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'player_triangle_charge',
            frames: this.anims.generateFrameNumbers('player', {start: 0, end: 4}),
            frameRate: 12,
            repeat: -1
        });
        // Effect Animations
        this.anims.create({ 
            key: 'explode',
            frames: this.anims.generateFrameNames('explosion', {start: 0, end: 4}),
            frameRate: 12
        });
        const KeyCodes = Phaser.Input.Keyboard.KeyCodes;

        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setOrigin(0, 0);
        
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
        this.physics.add.collider(this.player1, this.player2, () => {
            if (this.player1.isLAUNCHING || this.player2.isLAUNCHING) {
                if (this.player1.isLAUNCHING) {
                    this.player2.explode();
                }
                if (this.player2.isLAUNCHING) {
                    this.player1.explode();
                }
            }
        });

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