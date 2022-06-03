class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
      this.load.spritesheet('menu-sheet', './assets/menusheet.png', {
        frameWidth: 1602, // lmao what is this res
        frameHeight: 890,
        startFrame: 0,
        endFrame: 6
      });
    }

    create() {

      this.anims.create({
        key: 'menu',
        frames: this.anims.generateFrameNames('menu-sheet', {start: 0, end: 7}),
        frameRate: 5, // what was this?
        loop: true,
        //yoyo: true,
        repeat: -1,
      });

      let background = this.add.sprite(0, game.config.height / 2, 'menu', 0).setOrigin(0, 0.5);
      background.anims.play('menu');        
      
      background.displayWidth = game.config.width;
      background.displayHeight = background.displayWidth * background.height / background.width;

        //this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        let textConfig = {
          fontFamily: 'Courier',
          fontSize: '64px',
          backgroundColor: '#000000',
          color: '#FFFFAA',
          align: 'right',
          padding: {
              top: 5, 
              bottom: 5,
          },
          fixedWidth: 0,
        }

        this.add.text(10, 10, "Get Got!", textConfig);
        // Tutorial button
        let clickCount = 0;
        textConfig.fill = '#0f0';
        textConfig.fontSize = '48px';
        this.tutorialButton = this.add.text(100, 200, 'Click me 4 tutorial', textConfig)
          .setInteractive({ useHandCursor: true })
          .on('pointerover', function() { this.setStyle({ fill: '#ff0'}); })
          .on('pointerout', function() { this.setStyle({ fill: '#0f0' }); })
          .on('pointerdown', function() { this.setStyle({ fill: '#0ff' }); })
          .on('pointerup', () => { this.scene.start('tutorialScene'); });

        this.playButton = this.add.text(100, 100, 'Click me 4 game', textConfig)
          .setInteractive({ useHandCursor: true })
          .on('pointerover', function() { this.setStyle({ fill: '#ff0'}); })
          .on('pointerout', function() { this.setStyle({ fill: '#0f0' }); })
          .on('pointerdown', function() { this.setStyle({ fill: '#0ff' }); })
          .on('pointerup', () => { this.scene.start('playScene'); });
          
      }
    }