// arcade physics isn't working atm

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, keys) {
        super(scene, x, y, texture, frame);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.SPEED = 500;
        this.ACCELERATION = 10000;
        this.DRAG = this.ACCELERATION / 2;

        this.speedx = 0;
        this.speedy = 0;

        this.setScale(SCALE);

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
      
        this.anims.play('player_triangle_idle');
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
                if (!this.kCharge.isDown && this.anims.currentAnim.key !== 'player_triangle_run') {
                    this.anims.play('player_triangle_run');
                }
            }
            if (this.kDown.isDown) {
                accely += this.ACCELERATION;
                if (!this.kCharge.isDown && this.anims.currentAnim.key !== 'player_triangle_run') {
                    this.anims.play('player_triangle_run');
                }
            }
            if (this.kLeft.isDown) {
                accelx -= this.ACCELERATION;
                if (!this.kCharge.isDown && this.anims.currentAnim.key !== 'player_triangle_run') {
                    this.anims.play('player_triangle_run');
                }
            }
            if (this.kRight.isDown) {
                accelx += this.ACCELERATION;
                if (!this.kCharge.isDown && this.anims.currentAnim.key !== 'player_triangle_run') {
                    this.anims.play('player_triangle_run');
                }
            }
    
            this.setAcceleration(accelx, accely);   
        }

        if (this.kCharge.isDown) {
            this.setMaxVelocity(this.SPEED / 10);
            this.charge += delta;
            if (this.anims.currentAnim.key !== 'player_triangle_charge') {
                this.anims.play('player_triangle_charge');
            }
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
        
        if (accelx == 0 && accely == 0) {
            if (!this.kCharge.isDown && this.anims.currentAnim.key !== 'player_triangle_idle') {
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