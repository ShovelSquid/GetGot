class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, keys) {
        super(scene, x, y, texture, frame);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // Arcade Physics
        this.SPEED = 500;
        this.ACCELERATION = 5000;
        this.DRAG = this.ACCELERATION * 0.5;
        this.setMaxVelocity(this.SPEED);
        this.setDrag(this.DRAG, this.DRAG);

        this.speedx = 0;
        this.speedy = 0;

        // Visuals
        this.setScale(SCALE);
        this.color = texture.replace('player', '');
        let frameREF = 0;
        if (this.color == 'RED') {
            frameREF = 1;
        }
        else if (this.color == 'BLUE') {
            frameREF = 0;
        }


        this.setCollideWorldBounds(true, 0, 0);
        // The keyyyz
        this.kUp = keys[0];
        this.kDown = keys[1];
        this.kLeft = keys[2];
        this.kRight = keys[3];
        // slash and charge boyos
        this.kSlash = keys[4];
        this.kCharge = keys[5];

        this.charge = 0;
        // booleans
        this.isCHARGING = false;
        this.isLAUNCHING = false;
        this.isEXPLODING = false;
        // particles
        this.bloodVFXSplurtEffect = this.scene.bloodVFXManager.createEmitter({
            follow: this,
            quantity: {min: 30, max: 50},
            speed: {min: 200, max: 750},
            lifespan: {min: 700, max: 900},
            scale: {start: 1.0, end: 0.1},
            frame: frameREF,
            on: false,
        });
        this.walkPoofVFXEffect = this.scene.poofVFXManager.createEmitter({
            follow: this,
            followOffset: {
                y: this.height/3,
            },
            quantity: 5,
            speedY: {min: -150, max: -200},
            speedX: {min: -50, max: 50},
            accelerationY: 1000,
            lifespan: 250,
            scale: {start: 1.2, end: 0.1},
            on: false
        });

      
        this.anims.play(this.color + 'player_triangle_idle');
        this.on('animationrepeat', () => {
            if (this.anims.currentAnim.key == this.color+'player_triangle_run') {
                this.walkPoofVFXEffect.explode();
            }
        })
    }

    update(delta) {
        let accelx = 0;
        let accely = 0;
       
        if (this.charge > 0 && !this.isCHARGING) {
            this.setDrag(0, 0);
            
            this.charge -= delta;
        } else {
            this.setDrag(this.DRAG, this.DRAG);
            this.setMaxVelocity(this.SPEED, this.SPEED);
            this.setCollideWorldBounds(true, 0, 0);
            this.isLAUNCHING = false;

            if (this.kUp.isDown) {
                accely -= this.ACCELERATION;
                if (!this.kCharge.isDown && this.anims.currentAnim.key !== this.color+'player_triangle_run') {
                    this.anims.play(this.color+'player_triangle_run');
                }
            }
            if (this.kDown.isDown) {
                accely += this.ACCELERATION;
                if (!this.kCharge.isDown && this.anims.currentAnim.key !== this.color+'player_triangle_run') {
                    this.anims.play(this.color+'player_triangle_run');
                }
            }
            if (this.kLeft.isDown) {
                accelx -= this.ACCELERATION;
                if (!this.kCharge.isDown && this.anims.currentAnim.key !== this.color+'player_triangle_run') {
                    this.anims.play(this.color+'player_triangle_run');
                }
            }
            if (this.kRight.isDown) {
                accelx += this.ACCELERATION;
                if (!this.kCharge.isDown && this.anims.currentAnim.key !== this.color+'player_triangle_run') {
                    this.anims.play(this.color+'player_triangle_run');
                }
            }
    
            this.setAcceleration(accelx, accely);   
        }

        if (!this.isLAUNCHING && this.kCharge.isDown && this.charge < 1.5) {
            this.setMaxVelocity(this.SPEED / 30);
            this.isCHARGING = true;
            this.charge += delta;
            if (this.anims.currentAnim.key !== this.color+'player_triangle_charge') {
                this.anims.play(this.color+'player_triangle_charge');
            }
        }
        if (Phaser.Input.Keyboard.JustUp(this.kCharge) || this.charge >= 1.5) {
            const factor = 8 * this.charge;
            this.isCHARGING = false;
            this.isLAUNCHING = true;
            this.setMaxVelocity(factor * this.SPEED);
            let velo = this.body.velocity.normalize();
            velo.x *= factor * this.SPEED;
            velo.y *= factor * this.SPEED;
            this.setVelocity(velo.x, velo.y);
            // there's a thingy when you launch it gets crazy
            this.setCollideWorldBounds(true, 0.5, 0.5);
        }
        
        if (accelx == 0 && accely == 0) {
            if (!this.kCharge.isDown && this.anims.currentAnim.key !== this.color+'player_triangle_idle') {
                this.anims.play(this.color+'player_triangle_idle');
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

    explode() {
        if (this.isLAUNCHING) {
            // not die
        }
        else if (!this.isEXPLODING) {
            // die
            console.log("EPXLEOKDOEKFOJOSJIGJ");
            this.scene.cameras.main.shake(450, 0.022);
            this.isEXPLODING = true;
            this.alpha = 0;
            this.scene.physics.pause();
            let boom = this.scene.add.sprite(this.x, this.y, 'explosion').setScale(2);
            boom.anims.play('explode');
            this.bloodVFXSplurtEffect.explode();
            boom.on('animationcomplete', () => {
                boom.destroy();
                this.scene.physics.resume();
            })
            this.respawn = this.scene.time.delayedCall(2000, () => {
                this.alpha = 1;
                // boom.destroy();
                this.isEXPLODING = false;
            });
        }
    }
}