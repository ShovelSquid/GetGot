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

        this.bloodGroup = this.scene.add.group();
        this.score = 0;

        this.setDepth(5);

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
        this.stunTime = 1000;
        this.MAXCHARGE = 1.5;
        this.LAUNCHFACTOR = 10;   // in milliseconds
        // booleans
        // this.isCHARGING = false;
        // this.isLAUNCHING = false;
        // this.isEXPLODING = false;
        // this.isSLASHING = false;
        // this.STUNNED = false;

        // State Machine
        this.IDLE = true;
        this.MOVING = false;
        this.CHARGING = false;
        this.LAUNCHING = false;
        this.SLASHING = false;
        this.STUNNED = false;
        this.DEAD = false;
      
      
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
                if (!this.LAUNCHING) {
                    this.walkPoofVFXEffect.explode();
                    this.scene.walking.play();    
                }
            }
        });

        // Save the direction the player is facing
        this.facingx = 0;
        this.facingy = 0;

        // Think smash percentage
        this.health = 0;
    }

    update(delta) {
        // console.log("IDLE: " + this.IDLE);
        // console.log("MOVING: " + this.MOVING);
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
       
        if (this.charge > 0 && !this.CHARGING && !this.LAUNCHING) {
            //this.scene.charging.play();
            this.setDrag(this.DRAG, this.DRAG);
            this.charge -= delta;
        }

        // Need to have a state machine:
        // If launching, cannot move. Launching ends when speed is 0 during launch.
        // Once done launching, can move.
        // During launching, cannot alter speed, but can minisculely alter direction.
        // Need a direction variable that can be persistent
        // Direction can be used to retain previous direction from moving,
        // That way players that release both charge and move don't get jiffied.

        // INPUTS:
        if (!this.MOVING &&
            !this.CHARGING &&
            !this.LAUNCHING &&
            !this.SLASHING &&
            !this.STUNNED &&
            !this.DEAD && 
            !this.IDLE) {
                this.IDLE = true;
            }

        if (!this.SLASHING && !this.CHARGING && !this.LAUNCHING) {
            this.setDrag(this.DRAG, this.DRAG);
            this.setMaxVelocity(this.SPEED, this.SPEED);
        }
        if (this.kUp.isDown || this.kDown.isDown || this.kLeft.isDown || this.kRight.isDown) {
            if (this.IDLE) {                    // If you are stationary and start moving, set moving to true
                this.MOVING = true;
                this.IDLE = false;
            }
        }
        else {
            if (this.MOVING) {
                this.MOVING = false;
            }
        }
        if (this.IDLE && !this.MOVING) {
            // Play idle animation if idle
            if (!this.kCharge.isDown && this.anims.currentAnim.key !== this.color+'player_triangle_idle') {
                this.anims.play(this.color+'player_triangle_idle');
            }
        }
        if (this.MOVING || this.CHARGING) {
            // Play moving animation if moving
            if (this.MOVING) {
                if (this.anims.currentAnim.key !== this.color+'player_triangle_run') {
                    this.anims.play(this.color+'player_triangle_run');
                    //this.scene.walking.play();
                }
            }
            if (this.kUp.isDown) {
                accely -= this.ACCELERATION;    // Increase up acceleration
            }
            if (this.kDown.isDown) {
                accely += this.ACCELERATION;    // Increase down acceleration
            }
            if (this.kLeft.isDown) {
                accelx -= this.ACCELERATION;    // Increase left acceleration
            }
            if (this.kRight.isDown) {
                accelx += this.ACCELERATION;    // Increase right acceleration
            }
        }
        this.setAcceleration(accelx, accely);   // set acceleration to previous accel values

        if (Phaser.Input.Keyboard.JustDown(this.kCharge)) {
            if (this.canCharge()) {
                console.log("We are now charging!");
                // if this.charge < 1.5
                // if (this.charge >= 0.2) {
                //     if (!this.isCHARGING) {
                //         this.isCHARGING = true;
                //     }
                // };
                this.setMaxVelocity(this.SPEED / 30);
                this.CHARGING = true;
                this.IDLE = false;
                this.MOVING = false;
                this.scene.charging.play();
                this.flashTimer = this.scene.time.addEvent({
                    delay: 250,
                    callback: () => {
                        this.setTintFill(0xffffff); // Make player flash white
                        this.stopcall = this.scene.time.delayedCall(100, () => {
                            // Remove the white flash after a bit
                            this.clearTint();
                        });
                    },
                    loop: true,
                    paused: false,
                    startAt: 15
                });
                this.chargeTimer = this.scene.time.addEvent({
                    delay: 1,         // 0 for laser!!
                    callback: () => {
                        this.charge += delta;
                        this.scene.cameras.main.shake(250, 0.001 + this.charge / 1000); // We love the screen shake
                        // this.chargesound.play();
                    },
                    loop: true,
                    paused: false,
                    startAt: 250
                });
                if (this.anims.currentAnim.key !== this.color+'player_triangle_charge') {
                    this.anims.play(this.color+'player_triangle_charge');
                };
            }
        }
        if (Phaser.Input.Keyboard.JustUp(this.kCharge) || this.charge >= 1.5) {
            if (this.CHARGING) {
                // If the player is currently inputting...
                console.log('CHARGE: ', this.charge);
                if (this.charge < 0.2) {
                    console.log("SLASHING!!");
                    this.scene.slashing.play();
                    this.slash(this.facingx, this.facingy);     // SLASH!
                }
                else if (this.charge >= 0.5) {
                    console.log("CHARGING!!");
                    this.launch();                              // LAUNCH!
                }
                this.resetCharge();
            }
            console.log('Just UP charge button!!');
        }
        if (this.LAUNCHING) {
            if (this.body.speed == 0) {
                this.resetIdle();
            }
            this.charge -= delta;
            let velo = this.body.velocity.normalize();  // apply factor to velocity directions
            velo.x *= this.LAUNCHFACTOR * this.charge * this.SPEED;              
            velo.y *= this.LAUNCHFACTOR * this.charge * this.SPEED;
            this.setMaxVelocity(this.LAUNCHFACTOR*this.SPEED);     // max velocity is now higher than beforee
            this.setVelocity(velo.x, velo.y)            // setcurrent velocity to previous values
            this.setDrag(this.DRAG*0.6, this.DRAG*0.6);
            if (this.charge <= 0) {
                this.LAUNCHING = false;
            }
            
            
        }

        if (this.body.acceleration.x < 0) {
            this.setFlipX(1);
            this.facingx = -1;
        } else if (this.body.acceleration.x > 0) {
            this.setFlipX(0);
            this.facingx = 1;
        } else if (this.body.acceleration.y != 0) {
            this.facingx = 0;
        }

        if (this.body.acceleration.y < 0) {
            this.facingy = -1;
        } else if (this.body.acceleration.y > 0) {
            this.facingy = 1;
        } else if (this.body.acceleration.x != 0) {
            this.facingy = 0;
        }

        
        this.scene.physics.world.wrap(this, this.width*0.3)
    }
    

    slash(accelx, accely) {
        this.SLASHING = true;
        this.CHARGING = false;
        this.setDrag(3 * this.DRAG, 3 * this.DRAG);   // slow down player while slashing
        let vec = new Phaser.Math.Vector2(accelx, accely).normalize();    // facing direction
        // move out of the slash
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
            this.IDLE = true;
            this.SLASHING = false;
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
                });
                this.stuncall = this.scene.time.delayedCall(this.stunTime, () => {
                    player.clearTint();
                    player.STUNNED = false;
                });
                destoryCall.elapsed = destoryCall.delay;
            }
            
        });
        
        // stop player movement
        accelx = 0; accely = 0;
    }

    launch() {
        this.resetCharge();
        this.CHARGING = false;        // Set charge boolean to false
        console.log("calling launch function");         // Get big factor number, scaled by time
        const factor = 8 * this.charge;             // Get big factor number, scaled by time
        let velo = this.body.velocity.normalize();  // apply factor to velocity directions
        velo.x *= this.LAUNCHFACTOR * this.charge * this.SPEED;              
        velo.y *= this.LAUNCHFACTOR * this.charge * this.SPEED;
        if (this.body.acceleration.x != 0 || this.body.acceleration.y != 0) {
            this.LAUNCHING = true;                    // set launching to true
            this.scene.schmack.play();
            this.setMaxVelocity(this.LAUNCHFACTOR*this.SPEED);     // max velocity is now higher than beforee
            this.setVelocity(velo.x, velo.y)            // setcurrent velocity to previous values
            this.setDrag(this.DRAG*0.6, this.DRAG*0.6);
            // there's a thingy when you launch it gets crazy
            // this.setCollideWorldBounds(true, 0.5, 0.5);
        } 
        else {
            this.charge = 0;        // Resets charge to 0 if you don't aim so that you don't get locked
        }
    }

    explode(playerExploder, playerExplodee) {
        if (this.LAUNCHING) {
            // not die
        }
        else if (!this.DEAD) {
            // die
            console.log("EPXLEOKDOEKFOJOSJIGJ");
            // playerExploder.score += 1;
            this.addBlood(Math.random() * 4 + 5);
            //console.log(playerExploder.body.velocity);
            
            // ...body.velocity.distance() wasn't working
            let magnitude = playerExploder.body.velocity.x*playerExploder.body.velocity.x + playerExploder.body.velocity.y*playerExploder.body.velocity.y;
            magnitude = sqrt(magnitude);
            playerExplodee.health += 0.01 * magnitude;
            console.log('Player health: ' + playerExplodee.health);

            this.scene.cameras.main.shake(450, 0.022); // we love the screen shake
            // play sounds
            this.scene.schmack.play();
            this.scene.bloodexplode.play();
            this.DEAD = true;
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
                this.DEAD = false;
            });
        }
    }

    addBlood(amt) {
        let bloodZone = new Phaser.Geom.Circle(this.x, this.y, this.width/2);
        // this.scene.add.sprite(this.x, this.y, 'blood')
        let splatter = new Blood(this.scene, this.x, this.y, this.color + '-bloodsplatter');
        splatter.score = 15;
        this.bloodGroup.add(splatter);
        for (let i = 0; i < amt; i++) {
            let point = bloodZone.getRandomPoint();
            let blud = new Blood(this.scene, point.x, point.y, this.color + '-blood');
            let randomX = ((Math.random() * 500) + 700) * (Math.round(Math.random()) * 2 - 1);
            let randomY = ((Math.random() * 500) + 700) * (Math.round(Math.random()) * 2 - 1);
            blud.setVelocity(randomX, randomY);
            blud.score = 5;
            this.bloodGroup.add(blud);
            // let blud = this.scene.add.sprite(point.x, point.y, this.color + '-blood');
        }
        // console.log('blood Group: ', this.bloodGroup);
    }

    getScore() {
        let score = 0;
        for (let i = 0; i < this.bloodGroup.getLength(); i++) {
            let blud = this.bloodGroup.getChildren();
            score += blud[i].score;
        }
        this.score = score;
        return score;
    }

    resetCharge() {
        if (!this.LAUNCHING && !this.SLASHING) {
            this.IDLE = true;
        }
        this.CHARGING = false;
        this.scene.time.removeEvent(this.chargeTimer);
        this.scene.time.removeEvent(this.flashTimer);
        //this.charge = 0;
    }

    resetIdle() {
        this.IDLE = true;
        this.LAUNCHING = false;
        this.CHARGING = false;
        this.DEAD = false;
        this.STUNNED = false;
        this.setDrag(this.DRAG, this.DRAG);
        this.setAcceleration(0, 0);
    }


    // BOOLEANS
    canCharge() {
        console.log("Can we charge??");
        if (!this.CHARGING && !this.DEAD && !this.LAUNCHING && !this.STUNNED) {
            console.log("Yes we can!!");
            return true;
        }
        console.log("No we can't :(");
        return false;
    }
}
