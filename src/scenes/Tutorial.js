class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");
    }

    preload(){

    }

    create() {
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.add.text(10, 10, "This is tutorial bleep bloop");
    }

    update() {
        if (this.keyEnter.isDown) {
            this.scene.start('playScene');
        }
    }
}