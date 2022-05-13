// arcade physics isn't working atm

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, keys) {
        super(scene, x, y, texture, frame);

        this.scene.add.existing(this);
        console.log(this.scene);
        this.scene.physics.add.existing(this);

        this.SPEED = 500;
        this.ACCELERATION = 10000;
        this.DRAG = this.ACCELERATION / 2;

        this.speedx = 0;
        this.speedy = 0;

        this.setScale(SCALE);

        this.setMaxVelocity(this.SPEED);
        this.setDrag(this.DRAG, this.DRAG);

        this.kUp = keys[0];
        this.kDown = keys[1];
        this.kLeft = keys[2];
        this.kRight = keys[3];

        this.anims.play('player_triangle_idle');
    }

    update(delta) {
        let accelx = 0;
        let accely = 0;

        if (this.kUp.isDown) {
            accely -= this.ACCELERATION;
            if (this.anims.currentAnim.key !== 'player_triangle_run') {
                this.anims.play('player_triangle_run');
            }
        }
        if (this.kDown.isDown) {
            accely += this.ACCELERATION;
            if (this.anims.currentAnim.key !== 'player_triangle_run') {
                this.anims.play('player_triangle_run');
            }
        }
        if (this.kLeft.isDown) {
            accelx -= this.ACCELERATION;
            if (this.anims.currentAnim.key !== 'player_triangle_run') {
                this.anims.play('player_triangle_run');
            }
        }
        if (this.kRight.isDown) {
            accelx += this.ACCELERATION;
            if (this.anims.currentAnim.key !== 'player_triangle_run') {
                this.anims.play('player_triangle_run');
            }
        }

        if (accelx == 0 && accely == 0) {
            if (this.anims.currentAnim.key !== 'player_triangle_idle') {
                this.anims.play('player_triangle_idle');
            }
        }
        if (accelx < 0) {
            this.setFlipX(1);
        }

        if (accelx > 0) {
            this.setFlipX(0);
        }

        this.setAcceleration(accelx, accely);
    }

    playAnimation(key) {
        if (key == 'run') {
            if (!this.anims.isPlaying('player_triangle_run')) {
                this.anims.play('player_triangle_run');
            }
        }
        else if (key == 'idle') {
            if (!this.anims.isPlaying('player_triangle_idle')) {
                this.anims.play('player_triangle_idle');
            }
        }
    }
}