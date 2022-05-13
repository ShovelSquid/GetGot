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

        this.setMaxVelocity(this.SPEED);
        this.setDrag(this.DRAG, this.DRAG);

        this.setCollideWorldBounds(true, 0, 0);

        this.kUp = keys[0];
        this.kDown = keys[1];
        this.kLeft = keys[2];
        this.kRight = keys[3];

        this.kSlash = keys[4];
        this.kCharge = keys[5];

        this.charge = 0;
    }

    fire() {
        console.log("Pog");
    }

    update(delta) {
        let accelx = 0;
        let accely = 0;

        if (this.charge > 0 && !this.kCharge.isDown) {
            this.setDrag(0, 0);
            
            this.charge -= delta;
        } else {
            this.setDrag(this.DRAG, this.DRAG);
            this.setMaxVelocity(this.SPEED, this.SPEED);
            this.setCollideWorldBounds(true, 0, 0);

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
    
            this.setAcceleration(accelx, accely);   
        }

        if (this.kCharge.isDown) {
            this.setMaxVelocity(this.SPEED / 10);
            this.charge += delta;
        }
        if (Phaser.Input.Keyboard.JustUp(this.kCharge)) {
            const factor = 10;
            this.setMaxVelocity(factor * this.SPEED);
            let velo = this.body.velocity.normalize();
            velo.x *= factor * this.SPEED;
            velo.y *= factor * this.SPEED;
            this.setVelocity(velo.x, velo.y);
            this.setCollideWorldBounds(true, 1, 1);
        }
        

        
        // if (accelx == 0) {
        //     if (this.speedx > 0) {
        //         accelx -= delta*this.DRAG;
        //     }
        //     if (this.speedx < 0) {
        //         accelx += delta*this.DRAG;
        //     }
        // }  
        // if (accely == 0) {
        //     if (this.speedy > 0) {
        //         accely -= this.DRAG*delta;
        //     }
        //     if (this.speedy < 0) {
        //         accely += this.DRAG*delta;
        //     }
        // }

        // this.speedx += delta*accelx;
        // this.speedy += delta*accely;

        // if (this.speedx*this.speedx+this.speedy*this.speedy>this.SPEED*this.SPEED) {
        //     let mag = Math.sqrt(this.speedx*this.speedx+this.speedy*this.speedy);
        //     this.speedx = this.SPEED * this.speedx / mag;
        //     this.speedy = this.SPEED * this.speedy / mag;
        // }

        // if (Math.abs(this.speedx) < 10) {
        //     this.speedx = 0;
        // }
        // if (Math.abs(this.speedy) < 10) {
        //     this.speedy = 0;
        // }

        // this.x += delta*this.speedx;
        // this.y += delta*this.speedy;
    }
}