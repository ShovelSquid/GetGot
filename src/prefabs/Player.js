class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, keys) {
        super(scene, x, y, texture, frame);

        // Add this player to the scene
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

        this.score = 0;

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


        // this.setCollideWorldBounds(true, 0, 0);
        // The keyyyz
        this.kUp = keys[0];
        this.kDown = keys[1];
        this.kLeft = keys[2];
        this.kRight = keys[3];
        // slash and charge boyos
        this.kSlash = keys[4];
        this.kCharge = keys[5];

        this.charge = 0;
        this.stunTime = 1000
        ;   // in milliseconds
        // states
        this.isCHARGING = false;
        this.isLAUNCHING = false;
        this.isEXPLODING = false;
        this.isSLASHING = false;
        this.STUNNED = false;

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

        // Save the direction the player is facing
        this.facingx = 0;
        this.facingy = 0;

        // Think smash percentage
        this.health = 0;
    }

    update(delta) {
        let accelx = 0;
        let accely = 0;

        let newBlood = false;
        if (this.color === 'RED') {
            this.scene.bgctx.fillStyle = '#fe0144';
        } else if (this.color === 'BLUE') {
            this.scene.bgctx.fillStyle = '#01febb';
        } else {
            this.scene.bgctx.fillStyle = 'black';
        }
        this.bloodVFXSplurtEffect.forEachAlive((part) => {
            newBlood = true;
            
            part.maxVelocityX /= this.bloodDrag * delta;
            part.maxVelocityY /= this.bloodDrag * delta;
            this.scene.bgctx.fillRect(part.x, part.y, 10, 10);
        });
        if (newBlood) {
            // only refresh the background if something changed
            this.scene.canvasbg.refresh();
        }
       
        if (this.charge > 0 && !this.isCHARGING) {
            //this.scene.charging.play();
            this.setDrag(0, 0);
            this.charge -= delta;
        }
            
            
        // this.setCollideWorldBounds(true, 0, 0);
        if (this.body.speed < this.SPEED ) {
            this.isLAUNCHING = false;
        }
        if (!this.isSLASHING && !this.STUNNED) {
            this.setDrag(this.DRAG, this.DRAG);
            // this.setMaxVelocity(this.SPEED, this.SPEED);

            // Need to have a state machine:
            // If launching, cannot move. Launching ends when speed is 0 during launch.
            // Once done launching, can move.
            // During launching, cannot alter speed, but can minisculely alter direction.
            // Need a direction variable that can be persistent
            // Direction can be used to retain previous direction from moving,
            // That way players that release both charge and move don't get jiffied.

            if (this.kUp.isDown) {
                accely -= this.ACCELERATION;
                if (!this.kCharge.isDown && this.anims.currentAnim.key !== this.color+'player_triangle_run') {
                    this.anims.play(this.color+'player_triangle_run');
                    //this.scene.walking.play();
                }
            }
            if (this.kDown.isDown) {
                accely += this.ACCELERATION;
                if (!this.kCharge.isDown && this.anims.currentAnim.key !== this.color+'player_triangle_run') {
                    this.anims.play(this.color+'player_triangle_run');
                    //this.scene.walking.play();
                }
            }
            if (this.kLeft.isDown) {
                accelx -= this.ACCELERATION;
                if (!this.kCharge.isDown && this.anims.currentAnim.key !== this.color+'player_triangle_run') {
                    this.anims.play(this.color+'player_triangle_run');
                    //this.scene.walking.play();
                }
            }
            if (this.kRight.isDown) {
                accelx += this.ACCELERATION;
                if (!this.kCharge.isDown && this.anims.currentAnim.key !== this.color+'player_triangle_run') {
                    this.anims.play(this.color+'player_triangle_run');
                    //this.scene.walking.play();
                }
            }

            if (Phaser.Input.Keyboard.JustUp(this.kCharge)) {
                // If the player is currently inputting...
                if (accelx != 0 || accely != 0) {
                    if (this.charge < 0.2) {
                        this.slash(accelx, accely);         // SLASH!
                        // this.isCHARGING = false;
                        // this.setMaxVelocity(this.SPEED, this.SPEED);        
                    }
                    else if (this.charge >= 0.2) {  
                        this.launch(accelx, accely);        // LAUNCH!
                    }
                } else {
                    // Use previous direction information
                    if (this.charge < 0.2) {
                        console.log(this.facingx, this.facingy);
                        this.slash(this.facingx, this.facingy);         // SLASH!
                        // this.isCHARGING = false;
                        // this.setMaxVelocity(this.SPEED, this.SPEED);        
                    }
                    else if (this.charge >= 0.2) {  
                        this.launch(this.facingx, this.facingy);        // LAUNCH!
                    }
                }
                // console.log('Just UP charge button!!');
            }
        }

        // Only launch if sufficient charge
        if (this.charge >= 1.5) {
            this.launch(accelx, accely);
        }

        if (this.isLAUNCHING) {
            console.log("LAUNCHINNNNNNGGGGGGGGG");
        }

        if (!this.isLAUNCHING && this.kCharge.isDown && this.charge < 1.5) {
            console.log("CURRENT CHARGE: " + this.charge);
            this.setMaxVelocity(this.SPEED / 30);
            this.isCHARGING = true;
            this.charge += delta;
            if (this.anims.currentAnim.key !== this.color+'player_triangle_charge') {
                this.anims.play(this.color+'player_triangle_charge');
            };
        } else {
            this.isCHARGING = false;
            this.charge = 0;
        }
        
        if (accelx == 0 && accely == 0) {
            // Make sure our animation is correct
            // TODO doesn't work while launching / slashing
            if (!this.kCharge.isDown && this.anims.currentAnim.key !== this.color+'player_triangle_idle') {
                this.anims.play(this.color+'player_triangle_idle');
            }
        } 

        // Save facing direction
        if (accelx < 0) {
            this.setFlipX(1); // have animation face correct dir
            this.facingx = -1;
        } else if (accelx > 0) {
            this.setFlipX(0);
            this.facingx = 1;
        } else if (accely != 0) {
            this.facingx = 0;
        }

        if (accely < 0) {
            this.facingy = -1;
        } else if (accely > 0) {
            this.facingy = 1;
        } else if (accelx != 0) {
            this.facingy = 0;
        }

        this.setAcceleration(accelx, accely);
        
        this.scene.physics.world.wrap(this, this.width*0.3, () => {
            console.log("wrap");
        });
    }
    

    slash(accelx, accely) {
        this.isSLASHING = true;
        this.setDrag(3 * this.DRAG, 3 * this.DRAG); // slow down player while slashing
        let vec = new Phaser.Math.Vector2(accelx, accely).normalize(); // facing direction
        
        // move out the slash
        const factor = 110; 
        vec.x *= factor;
        vec.y *= factor;
        
        // create slash object
        let slash = this.scene.add.sprite(this.x + vec.x, this.y + vec.y, 'slash');
        slash.anims.play('player_slash');
        slash.on('animationcomplete', () => {
            slash.destroy();
        })
        this.scene.physics.add.existing(slash);
        slash.body.immovable = true;
        slash.rotation = vec.angle()+Math.PI/2;

        // remove slash when done
        let destoryCall = this.scene.time.delayedCall(500, () => {
            this.isSLASHING = false;
        });

        // if player launches into slash, bounce them back
        let blocked = false;
        this.scene.physics.add.overlap(this.scene.players, slash, (player, sl) => {
            if (player != this && !blocked) {
                blocked = true;
                // Player will move in the direction of the slash
                // TODO: alter based off player speed
                player.body.velocity = new Phaser.Math.Vector2(100*vec.x, 100*vec.y);
                player.STUNNED = true;
                player.setTintFill(0xffffff); // Make player flash white
                player.body.enable = false;
                this.scene.cameras.main.shake(250, 0.01); // We love the screen shake
                this.stopcall = this.scene.time.delayedCall(250, () => {
                    // Remove the white flash after a bit
                    player.clearTint();
                    player.body.enable = true;
                })
                this.stuncall = this.scene.time.delayedCall(this.stunTime, () => {
                    player.clearTint();
                    player.STUNNED = false;
                })
                destoryCall.elapsed = destoryCall.delay;
            }
            
        });
        
        // stop player movement
        accelx = 0; accely = 0;
    }

    launch(accelx, accely) {
        this.isCHARGING = false;        // Set charge boolean to false
        console.log("calling launch function");
        const factor = 8 * this.charge;             // Get big factor number, scaled by time
        let velo = this.body.velocity.normalize();  // apply factor to velocity directions
        velo.x *= factor * this.SPEED;              
        velo.y *= factor * this.SPEED;
        if (accelx != 0 || accely != 0) {
            this.isLAUNCHING = true;                    // set launching to true
            this.setMaxVelocity(factor*this.SPEED);     // max velocity is now higher than beforee
            this.setVelocity(velo.x, velo.y)            // setcurrent velocity to previous values
            // there's a thingy when you launch it gets crazy
            // this.setCollideWorldBounds(true, 0.5, 0.5);
        } 
        else {
            this.charge = 0;        // Resets charge to 0 if you don't aim so that you don't get locked
        }
    }

    explode(playerExploder, playerExplodee) {
        if (this.isLAUNCHING) {
            // not die
        }
        else if (!this.isEXPLODING) {
            // die
            console.log("EPXLEOKDOEKFOJOSJIGJ");
            playerExploder.score += 1;
            //console.log(playerExploder.body.velocity);
            
            // ...body.velocity.distance() wasn't working
            let magnitude = playerExploder.body.velocity.x*playerExploder.body.velocity.x + playerExploder.body.velocity.y*playerExploder.body.velocity.y;
            magnitude = sqrt(magnitude);
            playerExplodee.health += 0.01 * magnitude;
            console.log(playerExplodee.health);

            this.scene.cameras.main.shake(450, 0.022); // we love the screen shake
            // play sounds
            this.scene.schmack.play();
            this.scene.bloodexplode.play();
            
            this.isEXPLODING = true;
            this.alpha = 0;
            this.body.enable = false;
            this.scene.physics.pause();
            
            // Make explosion
            let boom = this.scene.add.sprite(this.x, this.y, 'explosion').setScale(2);
            boom.anims.play('explode');
            this.bloodVFXSplurtEffect.explode();
            boom.on('animationcomplete', () => {
                boom.destroy();
                this.scene.physics.resume();
            })
            this.respawn = this.scene.time.delayedCall(2000, () => {
                // TODO: move the player to random location
                this.alpha = 1;
                this.body.enable = true;
                // boom.destroy();
                this.isEXPLODING = false;
            });
        }
    }
}