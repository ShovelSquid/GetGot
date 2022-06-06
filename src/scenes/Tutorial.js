class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");
    }

    preload(){
        this.load.audio('menumusic', './assets/menumusic.mp3');
        this.load.multiatlas('tutorial', './assets/tutorial-sheet-smaller/tutorial.json', '/assets/tutorial-sheet-smaller/');
    }

    create() {

        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.anims.create({
            key: 'tutorial',
            frames: this.anims.generateFrameNames('tutorial', {start: 0, end: 19, prefix: 'frames/tutorial-sheet-smaller-', suffix: '.png'}),
            frameRate: 9,
            loop: true,
            repeat: -1
        });
        
        let scale = 1.3681640625; // don't question it
        this.background = this.add.sprite(0, 0, 'tutorial', 0).setOrigin(0,0).setScale(scale, scale);
        this.background.anims.play('tutorial');               
    }

    update() {
        if (this.keyEnter.isDown) {
            this.scene.start('playScene');
        }
    }
}