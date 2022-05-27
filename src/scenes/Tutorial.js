class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");
    }

    preload(){

    }

    create() {
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
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.add.text(game.config.width*0.2, game.config.height*0.1, "Tutorial: try not to get got", textConfig);
        this.add.text(game.config.width*0.2, game.config.height*0.3, "Press Enter to start", textConfig);
    }

    update() {
        if (this.keyEnter.isDown) {
            this.scene.start('playScene');
        }
    }
}