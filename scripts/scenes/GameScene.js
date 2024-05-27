class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        
        this.load.tilemapTiledJSON('map', 'assets/tilemap/tilemap1.json');

        this.load.image('tiles', 'assets/tilemap/tileset.png');
                
        
        this.load.spritesheet('dude', 'assets/images/dude.png', { frameWidth: 64, frameHeight: 73 });
        this.load.image('collect', 'assets/images/collect.png');
        
        this.load.audio('jump_sfx', 'assets/audio/sfx/jump_sfx.mp3');
        this.load.audio('win_sfx', 'assets/audio/sfx/win_sfx.mp3');
        this.load.audio('collect_sfx', 'assets/audio/sfx/collect_sfx.mp3');
        this.load.audio('gameover_sfx', 'assets/audio/sfx/gameover_sfx.mp3');
        this.load.audio('gameBgm', 'assets/audio/bgm/game2_bgm.mp3');
    }

    create() {
        
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('tileset', 'tiles');
    
        
        const groundLayer = map.createLayer('bg', tileset);
        const platformLayer = map.createLayer('platform', tileset, 0, 0);
        platformLayer.setCollisionByProperty({ collides: true });

        const waterLayer = map.createLayer('water', tileset);
        waterLayer.setCollisionByProperty({ collides: true });

        
        const collectiblesLayer = map.createLayer('collectibles', tileset);
        
        
        collectiblesLayer.setTileIndexCallback([4], this.collectCollectible, this);
        
        this.gameBgm = this.sound.add('gameBgm', { loop: true, volume: 0.3 });
        this.gameBgm.play();
        
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.player = this.physics.add.sprite(100, 900, 'dude');
        this.player.setScale(0.8);
        this.player.setCollideWorldBounds(true);
    
        
        this.physics.add.collider(this.player, platformLayer);
        this.physics.add.collider(this.player, waterLayer, this.playerCollideWater, null, this);

        
        this.physics.add.overlap(this.player, collectiblesLayer);
      
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.cursors = this.input.keyboard.createCursorKeys();

        this.score = 0;
        this.collectibleCount = 0;
   
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontFamily:'Butter',fontSize: '32px', fill: '#152238' }).setScrollFactor(0);
        this.collectibleImage = this.add.image(40, 80, 'collect').setScrollFactor(0);;
        this.collectibleText = this.add.text(70, 60, 'x 0', { fontFamily:'Butter',fontSize: '32px', fill: '#152238' }).setScrollFactor(0);
        
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setZoom(1);
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
        
        
        if (this.cursors.up.isDown && this.player.body.onFloor()) {
        const jumpSound = this.sound.add('jump_sfx');
        jumpSound.volume = 0.05;
        jumpSound.play();
    
    this.player.setVelocityY(-300);
        }
    }

    collectCollectible(player, tile) {
        console.log('Collectible touched');
    
        if (tile) {
            
            tile.tilemapLayer.removeTileAt(tile.x, tile.y);
    
            this.score += 10;
            this.scoreText.setText('Score: ' + this.score);

            this.collectibleCount += 1;
            this.collectibleText.setText('x ' + this.collectibleCount);
    
            const collectSound = this.sound.add('collect_sfx');
            collectSound.volume = 0.5; 
        
            collectSound.play();
    
            const totalCollectibles = 50; 
            if (this.score === totalCollectibles) {
                
                const winSound = this.sound.add('win_sfx');
                winSound.volume = 0.5; 
        
                
                this.gameBgm.stop();
                winSound.play();
    
                this.scene.start('WinScene');
            }

        }
    }

    playerCollideWater(player, water) {
        
        const gameOverSound = this.sound.add('gameover_sfx');
        gameOverSound.volume = 0.2; 
    
        this.gameBgm.stop();
        gameOverSound.play();
    
        this.scene.start('GameOverScene', { score: this.score });
    }
}

export default GameScene;