class Blood extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)

        this.setTexture(texture);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);


        this.bloodSize = 0;
        this.score = 0;
        this.setDrag(5000);
    }
}