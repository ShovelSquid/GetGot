class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
      this.load.spritesheet('menu-sheet', './assets/menusheet.png', {
        frameWidth: 1602, //wotf
        frameHeight: 1000,
        startFrame: 0,
        endFrame: 6
      });

      this.load.audio('select', './assets/select.wav');

      this.load.image('startbutton', './assets/select.png');
      this.load.image('tutorialbutton', './assets/tutorial.png');

      this.load.spritesheet('wall', './assets/Wall-Sheet.png', {
          frameHeight: 100,
          frameWidth: 100
      });

    }
    
    create() {

      this.select = this.sound.add('select');

      this.anims.create({
        key: 'menu',
        frames: this.anims.generateFrameNames('menu-sheet', {start: 0, end: 6}),
        frameRate: 5,
        loop: true,
        repeat: -1,
      });

      let background = this.add.sprite(0, game.config.height / 2, 'menu', 0).setOrigin(0, 0.5).setDepth(1);
      background.anims.play('menu');        
      
      background.displayWidth = game.config.width;
      background.displayHeight = background.displayWidth * background.height / background.width;

      let startButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 1.5, "startbutton").setDepth(1);
      let tutorialButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 1.35, "tutorialbutton").setDepth(1);

      let hoverSprite = this.add.sprite(100, 100, 'wall').setDepth(1);
      hoverSprite.setScale(.6);
      hoverSprite.setVisible(false);

      
      //wall anim for buttons
      this.anims.create({
          key: "wall",
          frameRate: 7,
          repeat: -1,
          frames: this.anims.generateFrameNumbers('wall', {start: 0, end: 9})
      });
      
      //button machine go brr
      startButton.setInteractive();

      startButton.on("pointerover", () => {
          hoverSprite.setVisible(true);
          hoverSprite.play("wall");
          hoverSprite.x = startButton.x - startButton.width + 115;
          hoverSprite.y = startButton.y;
          this.select.play();
      })

      startButton.on("pointerout", () => {
          hoverSprite.setVisible(false);
      })

      startButton.on("pointerup", () => {
          this.scene.start('playScene');
      })

      tutorialButton.setInteractive();

      tutorialButton.on("pointerover", () => {
          hoverSprite.setVisible(true);
          hoverSprite.play("wall");
          hoverSprite.x = tutorialButton.x - tutorialButton.width + 185;
          hoverSprite.y = tutorialButton.y;
          this.select.play();
      })

      tutorialButton.on("pointerout", () => {
          hoverSprite.setVisible(false);
      })

      tutorialButton.on("pointerup", () => {
          this.scene.start('tutorialScene');
      })
    }
}