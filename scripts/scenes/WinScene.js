class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScene' });
    }
    preload() {

        this.load.image('win', 'assets/images/win/win_bg.png');
        this.load.image('menuButton', 'assets/images/buttons/menu_button.png');
    }
    create() {
        if (this.scene.get('MainMenuScene').bgm && this.scene.get('MainMenuScene').bgm.isPlaying) {
            this.scene.get('MainMenuScene').bgm.stop();
        }
        // Add your win scene logic here
        const winbg = this.add.image(400, 300, 'win').setDisplaySize(800, 600);
        
        const menuButton = this.add.image(400, 200, 'menuButton').setInteractive();
        menuButton.setPosition(this.sys.game.config.width / 2, this.sys.game.config.height - 150);

        menuButton.on('pointerdown', () => {
        this.scene.start('MainMenuScene');
        });
    }
}

export default WinScene;
