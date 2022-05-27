class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {

    }

    create() {
        //this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        let textConfig = {
          fontFamily: 'Courier',
          fontSize: '64px',
          backgroundColor: '#000000',
          color: '#FFFFAA',
          align: 'right',
          padding: {
              top: 5, 
              bottom: 5,
          },
          fixedWidth: 0,
      }

        this.add.text(10, 10, "Get Got!", textConfig);
        // Tutorial button
        let clickCount = 0;
        textConfig.fill = '#0f0';
        textConfig.fontSize = '48px';
        this.clickButton = this.add.text(100, 100, 'Click me 4 tutorial', textConfig)
          .setInteractive({ useHandCursor: true })
          .on('pointerover', () => this.enterButtonHoverState() )
          .on('pointerout', () => this.enterButtonRestState() )
          .on('pointerdown', () => this.enterButtonActiveState() )
          .on('pointerup', () => {
            this.update(++clickCount);
            this.enterButtonHoverState();
            if (clickCount == 1) {
                this.scene.start('tutorialScene');
            }
        });

      }
    
      enterButtonHoverState() {
        this.clickButton.setStyle({ fill: '#ff0'});
      }
    
      enterButtonRestState() {
        this.clickButton.setStyle({ fill: '#0f0' });
      }
    
      enterButtonActiveState() {
        this.clickButton.setStyle({ fill: '#0ff' });
      }
    }