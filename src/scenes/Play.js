let loaded = false;
let canvasbgelement;
let bgctx;
let canvasbg;

class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // Sounds
        this.load.audio('bloodexplode', './assets/bloodexplode.wav');
        this.load.audio('hitwall', './assets/hitwall.wav');
        this.load.audio('schmack', './assets/schmack.wav');
        this.load.audio('walking', './assets/walking.wav');
        this.load.audio('charging', './assets/charging.wav');

        // Sprites
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
        this.load.spritesheet('slash', './assets/Slash-Sheet.png', {
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
        this.gameOver = false;
        
        // Set up sounds
        this.bloodexplode = this.sound.add('bloodexplode');
        this.hitwall = this.sound.add('hitwall');
        this.schmack = this.sound.add('schmack');
        this.walking = this.sound.add('walking');
        this.charging = this.sound.add('charging');


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

        // Wall anims/states
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
            frameRate: 12,
            repeat: 0
        });

        const KeyCodes = Phaser.Input.Keyboard.KeyCodes; // Less typing

        // Background image
        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setOrigin(0, 0);
        
        // Splatoon
        // Interactive, cavas-based background
        if (!loaded) {
            // Only make a new canvas if this is the first time we are playing
            canvasbgelement = document.createElement('canvas');
            bgctx = canvasbgelement.getContext('2d');
            canvasbg = this.textures.addCanvas('splatback', canvasbgelement);
            canvasbg.setSize(game.config.width, game.config.height);
            loaded = true;
        }

        this.canvasbgelement = canvasbgelement;
        this.bgctx = bgctx;
        this.canvasbg = canvasbg;
        this.bgctx.clearRect(0, 0, canvasbgelement.width, canvasbgelement.height);
        this.canvasbg.refresh();
        this.splatback = this.add.image(0, 0, 'splatback').setOrigin(0, 0);

        // Keys
        // Movement P1
        keyUp = this.input.keyboard.addKey(KeyCodes.UP);
        keyDown = this.input.keyboard.addKey(KeyCodes.DOWN);
        keyLeft = this.input.keyboard.addKey(KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(KeyCodes.RIGHT);
        // Movement P2
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
        
        // Enter for Restart
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.bloodVFXManager = this.add.particles('splurt');
        this.poofVFXManager = this.add.particles('poof');

        // Add our player characters
        this.players = this.add.group();
        
        this.player1 = new Player(this, 150, 200, 'REDplayer', 0, [keyW, keyS, keyA, keyD, keyF, keyG]);
        this.player2 = new Player(this, 300, 250, 'BLUEplayer', 0, [keyUp, keyDown, keyLeft, keyRight, keyComma, keyPeriod]);
        
        this.players.add(this.player1);
        this.players.add(this.player2);


        this.physics.world.setBounds(0, 0, game.config.width, game.config.height);
        // console.log(this.physics.world.bounds);

        // Explode when launching into each other
        this.physics.add.collider(this.players, this.players, () => {
            if (this.player1.isLAUNCHING && this.player1.body.velocity.length() >= 2*this.player1.SPEED) {
                this.player2.explode(this.player1, this.player2);
                console.log("Player1 score: ", this.player1.score);
            }
            if (this.player2.isLAUNCHING && this.player2.body.velocity.length() >= 2*this.player2.SPEED) {
                this.player1.explode(this.player2, this.player1);
                console.log("Player2 score: ", this.player2.score);

            }
        });

        // Game timer
        let textConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#000000',
            color: '#FFFFAA',
            align: 'right',
            padding: {
                top: 5, 
                bottom: 5,
            },
            fixedWidth: 0
        }
        // End screen
        this.endGameTimer = this.time.delayedCall(45000, () => {
            this.physics.pause();
            this.add.text(game.config.width/2, game.config.height*0.4, 'Game Over!', textConfig).setOrigin(0.5, 0.5);
            this.add.text(game.config.width*0.4, game.config.height*0.5, 
                'Player 1 Score:' + this.player1.score, textConfig).setOrigin(1, 0.5);
            this.add.text(game.config.width*0.6, game.config.height*0.5, 
                'Player 2 Score:' + this.player2.score, textConfig).setOrigin(0, 0.5);
            this.add.text(game.config.width*0.5, game.config.height*0.6, 
                'Press ENTER to restart!', textConfig).setOrigin(0.5, 0.5);

            this.gameOver = true;
        });

        // Map of walls
        const map = this.add.tilemap('wall_map');

        const tileset = map.addTilesetImage('Wall-Sheet', 'wall');
        const wallLayer = map.createLayer("Tile Layer 1", tileset, 0, 0);
        // const supercoollayer = map.createLayer("Tile Layer 2", tileset, 0, 0);

        wallLayer.setCollisionByProperty({
            collides: true,
        });
        this.walls = this.add.group();

        // When a player hits a wall -> bounce off
        this.physics.add.overlap(this.players, wallLayer, (player, wall) => {
            if (wall.canCollide) {
                let wallx = wall.pixelX + 0.5 * wall.width;
                let wally = wall.pixelY + 0.5 * wall.height;
                
                let playerx = player.x;
                let playery = player.y;

                // Distance from center of wall
                let distance = new Phaser.Math.Vector2(playerx - wallx, playery - wally);

                // Do the smallest move
                // The closest one is the greater distance
                if (abs(distance.x) > abs(distance.y)) {
                    if (distance.x < 0) {
                        player.x -= wall.width + distance.x + 5;
                    } else {
                        player.x += wall.width - distance.x + 5;
                    }
                    player.body.velocity.x = -0.5 * player.body.velocity.x; // bounce x
                } else {
                    if (distance.y < 0) {
                        player.y -= wall.height + distance.y + 5;
                    } else {
                        player.y += wall.height - distance.y + 5;
                    }
                    player.body.velocity.y = -0.5 * player.body.velocity.y; // bounce y
                }
            }
            
        });

    }

    update(time, delta) {
        delta /= 1000; // Turn into seconds

        this.player1.update(delta);
        this.player2.update(delta);

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(this.keyEnter)) {
            console.log("_RESS");
            this.scene.start('menuScene');
        }
    }
}