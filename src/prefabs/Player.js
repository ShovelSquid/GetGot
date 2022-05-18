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
        this.isSLASHING = false;
        // particles
        this.bloodVFXSplurtEffect = this.scene.bloodVFXManager.createEmitter({
            follow: this,
            quantity: {min: 30, max: 50},
            speed: {min: 200, max: 750},
            lifespan: {min: 700, max: 900},
            scale: {start: 1.0, end: 0.1},
            frame: frameREF,
            on: false
        });
        this.bloodDrag = 85;

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
        });
    }

    update(delta) {
        let accelx = 0;
        let accely = 0;

        let newBlood = false;
        if (this.color === 'RED') {
            this.scene.ctx.fillStyle = '#fe0144';
        } else if (this.color === 'BLUE') {
            this.scene.ctx.fillStyle = '#01febb';
        } else {
            this.scene.ctx.fillStyle = 'black';
        }
        this.bloodVFXSplurtEffect.forEachAlive((part) => {
            newBlood = true;
            
            part.maxVelocityX /= this.bloodDrag * delta;
            part.maxVelocityY /= this.bloodDrag * delta;
            this.scene.ctx.fillRect(part.x, part.y, 10, 10);
        });
        if (newBlood) {
            this.scene.backg.refresh();
        }
       
        if (this.charge > 0 && !this.isCHARGING) {
            this.setDrag(0, 0);

            this.charge -= delta;
        } else {
            
            
        this.setCollideWorldBounds(true, 0, 0);
        this.isLAUNCHING = false;

        if (!this.isSLASHING) {
            this.setDrag(this.DRAG, this.DRAG);
            this.setMaxVelocity(this.SPEED, this.SPEED);

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

            if (Phaser.Input.Keyboard.JustDown(this.kSlash)) {
                if (accelx != 0 || accely != 0) {
                    this.isSLASHING = true;
                    this.setDrag(3 * this.DRAG, 3 * this.DRAG);
                    let vec = new Phaser.Math.Vector2(accelx, accely).normalize();
                    const factor = 110;
                    vec.x *= factor;
                    vec.y *= factor;
                    let slash = this.scene.add.sprite(this.x + vec.x, this.y + vec.y, 'slash');
                    slash.anims.play('player_slash');
                    slash.on('animationcomplete', () => {
                        slash.destroy();
                    })
                    this.scene.physics.add.existing(slash);
                    slash.body.immovable = true;
                    slash.rotation = vec.angle()+Math.PI/2;

                    let destoryCall = this.scene.time.delayedCall(500, () => {
                        this.isSLASHING = false;
                    });

                    let blocked = false;
                    this.scene.physics.add.overlap(this.scene.players, slash, (player, sl) => {
                        if (player != this && !blocked) {
                            blocked = true;
                            console.log("Get blocked!");
                            let vec = player.body.velocity;
                            player.body.velocity = new Phaser.Math.Vector2(-0.5 * vec.x, -0.5 * vec.y);
                            destoryCall.elapsed = destoryCall.delay;
                        }
                        
                    });
                    
                    accelx = 0; accely = 0;
                    
                }                
            }
        }
            
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
            this.isCHARGING = false;
            const factor = 8 * this.charge;
            let velo = this.body.velocity.normalize();
            velo.x *= factor * this.SPEED;
            velo.y *= factor * this.SPEED;

            if (accelx != 0 || accely != 0) {
                this.isLAUNCHING = true;
                this.setMaxVelocity(factor * this.SPEED);
                
                this.setVelocity(velo.x, velo.y);
                // there's a thingy when you launch it gets crazy
                this.setCollideWorldBounds(true, 0.5, 0.5);
            } else {
                this.charge = 0;
            }
            
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
            this.scene.schmack.play();
            this.scene.bloodexplode.play();
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