class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");
    }

    preload(){
        this.load.spritesheet('tutorial-sheet', './assets/tutsheet.png', {
            frameWidth: 2197, //disgusting wotf
            frameHeight: 1255,
            startFrame: 0,
            endFrame: 10
        });
    }

    create() {

        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.anims.create({
            key: 'tutorial',
            frames: this.anims.generateFrameNames('tutorial-sheet', {start: 0, end: 10}),
            frameRate: 9,
            loop: true,
            repeat: -1
        });

        let background = this.add.sprite(0, game.config.height / 2, 'tutorial', 0).setOrigin(0, 0.5);
        background.anims.play('tutorial');        
        
        // background.displayWidth = game.config.width;
        // background.displayHeight = background.displayWidth * background.height / background.width;
       
    }

    update() {
        if (this.keyEnter.isDown) {
            this.scene.start('playScene');
        }
    }
}