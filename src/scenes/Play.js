let loaded = false;
let canvasbgelement;
let bgctx;
let canvasbg;

class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.path = './assets/';

        this.load.audio('music', 'quirkymusic.mp3');

        this.load.audio('bloodexplode', 'bloodexplode.wav');
        this.load.audio('hitwall', 'hitwall.wav');
        this.load.audio('schmack', 'schmack.wav');
        this.load.audio('walking', 'walking.wav');
        this.load.audio('charging', 'charging.wav');

        this.load.spritesheet('REDplayer', 'Player_Triangle-Sheet.png', {
            frameWidth: 100,
            frameHeight: 100,
            startFrame: 0,
            endFrame: 11,
        });
        this.load.spritesheet('BLUEplayer', 'Player-Triangle-Sheet-Blue.png', {
            frameWidth: 100,
            frameHeight: 100,
            startFrame: 0,
            endFrame: 11
        });
        this.load.spritesheet('explosion', 'explosionado-Sheet.png', {
            frameWidth: 32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 4
        });
        this.load.spritesheet('splurt', 'splurt-sheet.png', {
            frameWidth: 100,
            frameHeight: 100,
            startFrame: 0,
            endFrame: 1
        });
        this.load.spritesheet('slash', 'Slash-Sheet.png', {
            frameWidth: 100,
            frameHeight: 100,
            startFrame: 0,
            endFrame: 2
        });
        this.load.spritesheet('wall', 'Wall-Sheet.png', {      // Tiled tilesheet
            frameWidth: 100,
            frameHeight: 100,
            startFrame: 0,
            endFrame: 9,
        });
        this.load.tilemapTiledJSON('wall_map', 'tilemap01.json');       // Adds Tiled tilemap 
        this.load.image('frog', 'FROG-200.png');
        this.load.image('background', 'background.png');
        this.load.image('poof', 'poof.png');
        this.load.image('BLUE-blood', 'BLU-BLUD.png');
        this.load.image('RED-blood', 'RED-BLUD.png');
        this.load.image('BLUE-bloodsplatter', 'BLUE-Blud-Splatter.png');
        this.load.image('RED-bloodsplatter', 'RED-Blud-Splatter.png');
    }

    create() {

        this.music = this.sound.add('music');
        this.music.setLoop(true);
        this.music.play();

        this.gameOver = false;
        this.clock = 90;
        
        // Set up sounds
        this.bloodexplode = this.sound.add('bloodexplode');
        this.hitwall = this.sound.add('hitwall');
        this.schmack = this.sound.add('schmack');
        this.walking = this.sound.add('walking');
        this.charging = this.sound.add('charging');

        this.redText = '#FF6622';
        this.blueText = '#22AAFF';
        this.baseText = '#FFFFAA';


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
        keyEnter = this.input.keyboard.addKey(KeyCodes.ENTER);
        keyEscape = this.input.keyboard.addKey(KeyCodes.ESC);

        this.bloodVFXManager = this.add.particles('splurt');
        this.poofVFXManager = this.add.particles('poof');

        // const borderWidth = 10;
        // this.add.rectangle(0, 0, game.config.width, borderWidth, 0x63452b).setOrigin(0,0);
        // this.add.rectangle(0, 0, borderWidth, game.config.height, 0x63452b).setOrigin(0, 0);
        // this.add.rectangle(0, game.config.height - borderWidth, game.config.width, borderWidth, 0x63452b).setOrigin(0,0);
        // this.add.rectangle(game.config.width - borderWidth, 0, borderWidth, game.config.height, 0x63452b).setOrigin(0,0);
      
      
        // Map of Walls
        const map = this.add.tilemap('wall_map');
        const spawns = map.findObject("Objects", obj => obj.type === "spawn");
        const redSpawn = map.findObject("Objects", obj => obj.name == "Player Spawn 1");
        const blueSpawn = map.findObject("Objects", obj => obj.name == "Player Spawn 2");


        // Add our player characters
        this.players = this.add.group();
        
        this.player1 = new Player(this, redSpawn.x, redSpawn.y, 'REDplayer', 0, [keyW, keyS, keyA, keyD, keyF, keyG]);
        this.player2 = new Player(this, blueSpawn.x, blueSpawn.y, 'BLUEplayer', 0, [keyUp, keyDown, keyLeft, keyRight, keyComma, keyPeriod]);
        
        this.players.add(this.player1);
        this.players.add(this.player2);

        this.physics.world.setBounds(0, 0, game.config.width, game.config.height);
        // console.log(this.physics.world.bounds);

        // Explode when launching into each other
        this.physics.add.collider(this.players, this.players, () => {
            if (this.player1.LAUNCHING && this.player1.body.velocity.length() >= 2*this.player1.SPEED) {
                this.player2.explode(this.player1, this.player2);
            }
            if (this.player2.LAUNCHING && this.player2.body.velocity.length() >= 2*this.player2.SPEED) {
                this.player1.explode(this.player2, this.player1);
            }
        });

        const tileset = map.addTilesetImage('Wall-Sheet', 'wall');
        const wallLayer = map.createLayer("WallLayer", tileset, 0, 0);
        wallLayer.setDepth(3);
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
                this.hitwall.play();

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
        this.walls.canCollide = true;


        let textConfig = {
            fontFamily: 'Courier',
            fontSize: '48px',
            backgroundColor: '#000000',
            color: this.baseText,
            align: 'right',
            padding: {
                top: 5, 
                bottom: 5,
            },
            fixedWidth: 0,
            depth: 100,
        }
        this.clockText = this.add.text(game.config.width/2, game.config.height*0.1, 
            'TIME: ' + this.clock, textConfig).setOrigin(0.5, 0.5);
        this.clockcountdown = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.clock -= 1;
                this.clockText.text = 'TIME: ' + this.clock;
                if (this.clock <= 0) {
                    this.endGame(textConfig);
                }
            },
            loop: true,
            paused: false,
            startAt: 1000,
        });
    }

    decideWinner(textConfig) {
        let winner = '';
        if (this.player1.score < this.player2.score) {
            winner = 'Red';
            textConfig.color = this.redText;
        }
        else if (this.player2.score < this.player1.score) {
            winner = 'Blue';
            textConfig.color = this.blueText;
        }
        else {
            winner = 'Nobody';
            textConfig.color = this.baseText;
        }
        return winner;
    }

    endGame(textConfig) {
        this.physics.pause();
        for (let i = 0; i < this.players.getLength(); i++) {
            // let meg = this.players.getChildren();
            let player = this.players.getChildren();
            console.log(player[i]);
            // player[i].addBlood(6);
            player[i].getScore();
        };
        this.time.removeEvent(this.clockcountdown);
        // End Screen
        this.add.text(game.config.width/2, game.config.height*0.3, 'Game Over!', textConfig).setOrigin(0.5, 0.5);
        textConfig.color = this.redText;
        this.add.text(game.config.width*0.45, game.config.height*0.4, 
            'Red Blood: ' + this.player1.score + ' mL', textConfig).setOrigin(1, 0.5);
        textConfig.color = this.blueText;
        this.add.text(game.config.width*0.55, game.config.height*0.4, 
            'Blue Blood: ' + this.player2.score + ' mL', textConfig).setOrigin(0, 0.5);
        
        let winner = this.decideWinner(textConfig);
        console.log('scores: ' + this.players.score);
        this.add.text(game.config.width*0.5, game.config.height*0.5, 
            winner + ' wins!', textConfig).setOrigin(0.5, 0.5);
        textConfig.color = this.baseText;
        this.add.text(game.config.width*0.5, game.config.height*0.7,
            'Press ENTER to restart!', textConfig).setOrigin(0.5, 0.5);
        this.add.text(game.config.width*0.5, game.config.height*0.75,
            'Press ESC to return to main menu!', textConfig).setOrigin(0.5, 0.5);

        this.gameOver = true;

    }


    update(time, delta) {
        delta /= 1000; // Turn into seconds

        this.player1.update(delta);
        this.player2.update(delta);

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyEnter)) {
            console.log("_RESS");
            this.scene.restart();
            this.music.stop();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyEscape)) {
            console.log("_ESCC");
            this.scene.start('menuScene');
            this.music.stop();
        }
    }

}