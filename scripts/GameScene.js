class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Preload tilemap and its associated tileset
        this.load.tilemapTiledJSON('map', 'assets/tilemap/tilemap1.json');
        this.load.image('tiles', 'assets/tilemap/tileset.png');
        
        // Preload player sprite
        this.load.spritesheet('dude', 'assets/images/dude.png', { frameWidth: 64, frameHeight: 73 });
    }

    create() {
        // Load the tilemap
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('tileset', 'tiles');
    
        //LAYERS
        const groundLayer = map.createLayer('bg', tileset);
        const platformLayer = map.createLayer('platform', tileset, 0,0);
        platformLayer.setCollisionByProperty({ collides: true });

        const waterLayer = map.createLayer('water', tileset);
        waterLayer.setCollisionByProperty({ collides: true });

        // Collectibles setup
        const collectibles = map.createFromObjects('collectibles', { name: 'collectibles', key: 'tileset', frame: 4 });
        this.collectiblesGroup = this.physics.add.staticGroup(collectibles);
        
        //PLAYER
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.player = this.physics.add.sprite(100, 900, 'dude');
        this.player.setScale(0.8)
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
    
        // Enable collisions between the player and the platforms
        this.physics.add.collider(this.player, platformLayer);
        this.physics.add.collider(this.player, waterLayer);

        // Enable overlap between the player and collectibles
        this.physics.add.overlap(this.player, this.collectiblesGroup, this.collectCollectible, null, this);

        // Set up animations and input
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

        // Initialize score
        this.score = 0;

        // Display score
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' }).setScrollFactor(0);

        // Set camera properties
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
        
        // Allow the player to jump if touching the ground
        if (this.cursors.up.isDown && this.player.body.onFloor()) {
            this.player.setVelocityY(-330);
        }
    }

    // Function to handle collectible collection
    collectCollectible(player, collectible) {
        // Disable the collectible
        collectible.disableBody(true, true);
        
        // Update the score
        this.score += 1;
        this.scoreText.setText('Score: ' + this.score);

        // Check if all collectibles are collected
        const totalCollectibles = 5; // Adjust this number based on the total number of collectibles in your game
        if (this.score === totalCollectibles) {
            // Handle what happens when all collectibles are collected (e.g., victory)
            console.log('All collectibles collected!');
        }
    }
}

export default GameScene;
