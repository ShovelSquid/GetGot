// arcade physics isn't working atm

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, keys) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        //scene.physics.add.existing(this);

        this.SPEED = 300;
        this.ACCELERATION = 10000;
        this.DRAG = 10 * this.ACCELERATION;

        this.speedx = 0;
        this.speedy = 0;

        //this.setMaxVelocity(this.SPEED);
        //this.setDrag(this.DRAG, this.DRAG);

        this.kUp = keys[0];
        this.kDown = keys[1];
        this.kLeft = keys[2];
        this.kRight = keys[3];
    }

    update(delta) {
        console.log(delta)
        let accelx = 0;
        let accely = 0;

        if (this.kUp.isDown) {
            accely -= this.ACCELERATION;
        }
        if (this.kDown.isDown) {
            accely += this.ACCELERATION;
        }
        if (this.kLeft.isDown) {
            accelx -= this.ACCELERATION;
        }
        if (this.kRight.isDown) {
            accelx += this.ACCELERATION;
        }

        //this.setAcceleration(accelx, accely);
        if (accelx == 0) {
            if (this.speedx > 0) {
                accelx -= delta*this.DRAG;
            }
            if (this.speedx < 0) {
                accelx += delta*this.DRAG;
            }
        }  
        if (accely == 0) {
            if (this.speedy > 0) {
                accely -= this.DRAG*delta;
            }
            if (this.speedy < 0) {
                accely += this.DRAG*delta;
            }
        }

        this.speedx += delta*accelx;
        this.speedy += delta*accely;

        if (this.speedx*this.speedx+this.speedy*this.speedy>this.SPEED*this.SPEED) {
            let mag = Math.sqrt(this.speedx*this.speedx+this.speedy*this.speedy);
            this.speedx = this.SPEED * this.speedx / mag;
            this.speedy = this.SPEED * this.speedy / mag;
        }

        if (Math.abs(this.speedx) < 10) {
            this.speedx = 0;
        }
        if (Math.abs(this.speedy) < 10) {
            this.speedy = 0;
        }

        this.x += delta*this.speedx;
        this.y += delta*this.speedy;
    }
}