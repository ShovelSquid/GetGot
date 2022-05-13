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
        this.load.image('background', './assets/background.png');
    }

    create() {
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
            frames: this.anims.generateFrameNumbers('player', {start: 0, end: 2}),
            frameRate: 12,
            repeat: -1
        });
        const KeyCodes = Phaser.Input.Keyboard.KeyCodes;
        
        keyUp = this.input.keyboard.addKey(KeyCodes.UP);
        keyDown = this.input.keyboard.addKey(KeyCodes.DOWN);
        keyLeft = this.input.keyboard.addKey(KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(KeyCodes.RIGHT);

        keyW = this.input.keyboard.addKey(KeyCodes.W);
        keyS = this.input.keyboard.addKey(KeyCodes.S);
        keyA = this.input.keyboard.addKey(KeyCodes.A);
        keyD = this.input.keyboard.addKey(KeyCodes.D);

        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setOrigin(0, 0);

        this.player1 = new Player(this, 100, 200, 'player', 0, [keyW, keyS, keyA, keyD]);
        this.player2 = new Player(this, 300, 200, 'player', 0, [keyUp, keyDown, keyLeft, keyRight]);
    }

    update(time, delta) {
        delta /= 1000; // Turn into seconds

        this.player1.update(delta);
        this.player2.update(delta);
    }
}