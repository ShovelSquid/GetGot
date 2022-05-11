class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {

    }

    create() {
        this.add.text(10, 10, "Get Got!");
        this.add.text(10, 30, "Press Enter to Continue");
    }

    update() {
        
    }
}