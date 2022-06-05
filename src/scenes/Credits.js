class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    preload(){
        this.load.image('background', './assets/background.png');
        this.load.image('credits', './assets/credits.png');
    }

    create() {

        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.add.tileSprite(0, 0, game.renderer.width, game.renderer.height, 'background').setOrigin(0, 0);
        this.add.sprite(game.renderer.width / 2, game.renderer.height / 2, 'credits').setOrigin(0.5, 0.5);
    
        this.add.text(game.config.width / 2, 3 * game.config.height / 4, 'Press Enter to Return', {
            fontFamily: 'Courier',
            fontSize: '48px',
            //backgroundColor: '#000000',
            color: '#000000',
            align: 'right',
            padding: {
                top: 5, 
                bottom: 5,
            },
            fixedWidth: 0,
            depth: 100,
        }).setOrigin(0.5, 0.5);
    }

    update() {
        if (this.keyEnter.isDown) {
            this.scene.start('menuScene');
        }
    }
}