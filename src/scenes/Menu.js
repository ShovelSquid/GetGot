class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {

    }

    create() {
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.add.text(10, 10, "Get Got!");
        this.add.text(10, 30, "Press Enter to Continue");
    }

    update() {
        if (this.keyEnter.isDown) {
            this.scene.start('playScene');
        }
    }
}