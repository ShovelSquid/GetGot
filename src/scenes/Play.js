class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.audio('bloodexplode', './assets/bloodexplode.wav');
        this.load.audio('hitwall', './assets/hitwall.wav');
        this.load.audio('schmack', './assets/schmack.wav');

        this.load.spritesheet('REDplayer', './assets/Player_Triangle-Sheet.png', {
            frameWidth: 100,
            frameHeight: 100,
            startFrame: 0,
            endFrame: 11,
        });
        this.load.spritesheet('BLUEplayer', './assets/Player-Triangle-Sheet-Blue.png', {
            frameWidth: 100,
            frameHeight: 100,
            startFrame: 0,
            endFrame: 11
        });
        this.load.spritesheet('explosion', './assets/explosionado-Sheet.png', {
            frameWidth: 32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 4
        });
        this.load.spritesheet('splurt', './assets/splurt-sheet.png', {
            frameWidth: 100,
            frameHeight: 100,
            startFrame: 0,
            endFrame: 1
        });
        this.load.spritesheet('slash', './assets/slash.png', {
            frameWidth: 100,
            frameHeight: 100,
            startFrame: 0,
            endFrame: 2
        });
        this.load.spritesheet('wall', './assets/Wall-Sheet.png', {      // Tiled tilesheet
            frameWidth: 100,
            frameHeight: 100,
            startFrame: 0,
            endFrame: 9,
        });
        this.load.tilemapTiledJSON('wall_map', './assets/tilemap01.json');       // Adds Tiled tilemap 
        this.load.image('frog', './assets/FROG-200.png');
        this.load.image('background', './assets/background.png');
        this.load.image('poof', './assets/poof.png');
    }

    create() {
        this.bloodexplode = this.sound.add('bloodexplode');
        this.hitwall = this.sound.add('hitwall');
        this.schmack = this.sound.add('schmack');

        const map = this.add.tilemap('wall_map');

        const tileset = map.addTilesetImage('walls', 'wall');

        // RED Player Animations
        this.anims.create({
            key: 'REDplayer_triangle_idle',
            frames: this.anims.generateFrameNames('REDplayer', {start: 5, end: 8}),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'REDplayer_triangle_run',
            frames: this.anims.generateFrameNames('REDplayer', {start: 9, end: 11}),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'REDplayer_triangle_charge',
            frames: this.anims.generateFrameNumbers('REDplayer', {start: 0, end: 4}),
            frameRate: 12,
            repeat: -1
        });
        // BLUE player animations
        this.anims.create({
            key: 'BLUEplayer_triangle_idle',
            frames: this.anims.generateFrameNames('BLUEplayer', {start: 5, end: 8}),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'BLUEplayer_triangle_run',
            frames: this.anims.generateFrameNames('BLUEplayer', {start: 9, end: 11}),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'BLUEplayer_triangle_charge',
            frames: this.anims.generateFrameNumbers('BLUEplayer', {start: 0, end: 4}),
            frameRate: 12,
            repeat: -1
        });

        // Wall anims
        this.anims.create({
            key: 'wall_idle',
            frames: this.anims.generateFrameNumbers('wall', {start: 0, end: 4}),
            frameRate: 12,
            repeat: -1,
        });
        this.anims.create({
            key: 'wall_hurt',
            frames: this.anims.generateFrameNumbers('wall', {start: 5, end: 5}),
            frameRate: 0,
            repeat: -1
        });
        this.anims.create({
            key: 'wall_break',
            frames: this.anims.generateFrameNumbers('wall', {start: 6, end: 9}), 
            frameRate: 12,
            repeat: -1
        });

        // Effect Animations
        this.anims.create({ 
            key: 'explode',
            frames: this.anims.generateFrameNames('explosion', {start: 0, end: 4}),
            frameRate: 12
        });
        this.anims.create({
            key: 'player_slash',
            frames: this.anims.generateFrameNumbers('slash', {start: 0, end: 2}),
            frameRate: 24,
            repeat: -1
        });

        const KeyCodes = Phaser.Input.Keyboard.KeyCodes;

        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setOrigin(0, 0);
        
        // Splatoon
        const bg = document.createElement('canvas');
        this.ctx = bg.getContext('2d');

        this.backg = this.textures.addCanvas('backg', bg);
        this.backg.setSize(game.config.width, game.config.height);
        const backg = this.add.image(0, 0, 'backg').setOrigin(0, 0);

        // Keys
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

        this.bloodVFXManager = this.add.particles('splurt');
        this.poofVFXManager = this.add.particles('poof');

        this.players = this.add.group();
        
        this.player1 = new Player(this, 100, 200, 'REDplayer', 0, [keyW, keyS, keyA, keyD, keyF, keyG]);
        this.player2 = new Player(this, 300, 200, 'BLUEplayer', 0, [keyUp, keyDown, keyLeft, keyRight, keyComma, keyPeriod]);
        
        this.players.add(this.player1);
        this.players.add(this.player2);

        this.physics.add.collider(this.players, this.players, () => {
            if (this.player1.isLAUNCHING && this.player1.body.velocity.length() >= 2*this.player1.SPEED) {
                this.player2.explode();
            }
            if (this.player2.isLAUNCHING && this.player2.body.velocity.length() >= 2*this.player2.SPEED) {
                this.player1.explode();
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