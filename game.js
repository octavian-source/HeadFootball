// ==================== SIMPLE HEAD FOOTBALL GAME ====================
// Clean, working version with core features only

// ==================== GAME CONSTANTS ====================
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 650;
const GROUND_Y = 620;
const GRAVITY = 900;
const MATCH_TIME = 90; // seconds

// Player settings
const PLAYER_SPEED = 350;
const JUMP_POWER = -500;
const PLAYER_SIZE = 40;

// Ball settings
const BALL_BOUNCE = 0.85;
const BALL_SIZE = 12;
const KICK_POWER = 600;
const HIGH_KICK_POWER = 500;

// Goal settings
const GOAL_WIDTH = 50;
const GOAL_HEIGHT = 120;
const GOAL_Y = 560;

// ==================== GAME CONFIGURATION ====================
const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: GRAVITY },
            debug: false
        }
    },
    scene: [MenuScene, GameScene, PauseScene, GameOverScene]
};

// ==================== MENU SCENE ====================
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Background
        this.add.rectangle(600, 325, 1200, 650, 0x87CEEB);

        // Title
        this.add.text(600, 150, 'HEAD FOOTBALL', {
            fontSize: '64px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Player vs Player button
        const pvpButton = this.add.rectangle(600, 300, 350, 70, 0x4CAF50);
        pvpButton.setInteractive({ useHandCursor: true });
        this.add.text(600, 300, 'Player vs Player', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        pvpButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        pvpButton.on('pointerover', () => {
            pvpButton.setScale(1.1);
        });

        pvpButton.on('pointerout', () => {
            pvpButton.setScale(1);
        });

        // Controls text
        this.add.text(600, 450, 'Player 1: WASD + S (low kick) + X (high kick)', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.add.text(600, 480, 'Player 2: Arrow Keys + Down (low kick) + Numpad 0 (high kick)', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.add.text(600, 520, 'Press ESC during game to pause', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
    }
}

// ==================== PAUSE SCENE ====================
class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {
        // Dark overlay
        this.add.rectangle(600, 325, 1200, 650, 0x000000, 0.7);

        // Paused text
        this.add.text(600, 200, 'PAUSED', {
            fontSize: '64px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Resume button
        const resumeButton = this.add.rectangle(600, 320, 300, 60, 0x4CAF50);
        resumeButton.setInteractive({ useHandCursor: true });
        this.add.text(600, 320, 'RESUME', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        resumeButton.on('pointerdown', () => {
            this.scene.resume('GameScene');
            this.scene.stop('PauseScene');
        });

        // Menu button
        const menuButton = this.add.rectangle(600, 400, 300, 60, 0xFF9800);
        menuButton.setInteractive({ useHandCursor: true });
        this.add.text(600, 400, 'MAIN MENU', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        menuButton.on('pointerdown', () => {
            this.scene.stop('GameScene');
            this.scene.stop('PauseScene');
            this.scene.start('MenuScene');
        });

        // ESC key handler
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.resume('GameScene');
            this.scene.stop('PauseScene');
        });
    }
}

// ==================== GAME OVER SCENE ====================
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.finalScore1 = data.score1 || 0;
        this.finalScore2 = data.score2 || 0;
    }

    create() {
        // Background
        this.add.rectangle(600, 325, 1200, 650, 0x222222);

        // Winner text
        let winnerText = 'DRAW!';
        let winnerColor = '#ffff00';

        if (this.finalScore1 > this.finalScore2) {
            winnerText = 'PLAYER 1 WINS!';
            winnerColor = '#ff0000';
        } else if (this.finalScore2 > this.finalScore1) {
            winnerText = 'PLAYER 2 WINS!';
            winnerColor = '#0000ff';
        }

        this.add.text(600, 200, winnerText, {
            fontSize: '64px',
            fontFamily: 'Arial Black',
            color: winnerColor
        }).setOrigin(0.5);

        // Final score
        this.add.text(600, 300, `Final Score: ${this.finalScore1} - ${this.finalScore2}`, {
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Play again button
        const playAgainButton = this.add.rectangle(600, 400, 300, 60, 0x4CAF50);
        playAgainButton.setInteractive({ useHandCursor: true });
        this.add.text(600, 400, 'PLAY AGAIN', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        playAgainButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Main menu button
        const menuButton = this.add.rectangle(600, 480, 300, 60, 0xFF9800);
        menuButton.setInteractive({ useHandCursor: true });
        this.add.text(600, 480, 'MAIN MENU', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        menuButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}

// ==================== MAIN GAME SCENE ====================
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Initialize game state
        this.score1 = 0;
        this.score2 = 0;
        this.goalScored = false;
        this.matchTime = MATCH_TIME;
        this.matchEnded = false;

        // Create field
        this.createField();

        // Create players
        this.createPlayers();

        // Create ball
        this.createBall();

        // Create UI
        this.createUI();

        // Setup controls
        this.setupControls();

        // Setup collisions
        this.setupCollisions();

        // Start match timer
        this.startMatchTimer();
    }

    createField() {
        // Background
        this.add.rectangle(600, 325, 1200, 650, 0x87CEEB);

        // Ground
        this.add.rectangle(600, 585, 1200, 130, 0x3a7d3a);
        this.ground = this.physics.add.staticImage(600, GROUND_Y, null);
        this.ground.setSize(1200, 20);
        this.ground.setVisible(false);

        // Walls (invisible)
        this.leftWall = this.physics.add.staticImage(-5, 325, null);
        this.leftWall.setSize(10, 650);
        this.leftWall.setVisible(false);

        this.rightWall = this.physics.add.staticImage(1205, 325, null);
        this.rightWall.setSize(10, 650);
        this.rightWall.setVisible(false);

        // Goals
        this.leftGoal = this.physics.add.staticImage(25, GOAL_Y, null);
        this.leftGoal.setSize(GOAL_WIDTH, GOAL_HEIGHT);
        this.leftGoal.setVisible(false);

        this.rightGoal = this.physics.add.staticImage(1175, GOAL_Y, null);
        this.rightGoal.setSize(GOAL_WIDTH, GOAL_HEIGHT);
        this.rightGoal.setVisible(false);

        // Goal graphics
        this.add.rectangle(25, GOAL_Y, GOAL_WIDTH, GOAL_HEIGHT, 0xffffff, 0.3);
        this.add.rectangle(25, GOAL_Y, GOAL_WIDTH, GOAL_HEIGHT).setStrokeStyle(4, 0xffffff);

        this.add.rectangle(1175, GOAL_Y, GOAL_WIDTH, GOAL_HEIGHT, 0xffffff, 0.3);
        this.add.rectangle(1175, GOAL_Y, GOAL_WIDTH, GOAL_HEIGHT).setStrokeStyle(4, 0xffffff);
    }

    createPlayers() {
        // Player 1 (Red)
        this.player1 = this.physics.add.container(200, 500);

        // Simple stick figure
        const p1Graphics = this.add.graphics();
        p1Graphics.lineStyle(4, 0xff0000);
        p1Graphics.strokeCircle(0, -30, 20); // Head
        p1Graphics.beginPath();
        p1Graphics.moveTo(0, -10);
        p1Graphics.lineTo(0, 20); // Body
        p1Graphics.moveTo(-15, 0);
        p1Graphics.lineTo(15, 0); // Arms
        p1Graphics.moveTo(0, 20);
        p1Graphics.lineTo(-10, 40); // Left leg
        p1Graphics.moveTo(0, 20);
        p1Graphics.lineTo(10, 40); // Right leg
        p1Graphics.strokePath();

        this.player1.add(p1Graphics);
        this.player1.setSize(PLAYER_SIZE, PLAYER_SIZE * 2);
        this.player1.body.setBounce(0.2);
        this.player1.body.setCollideWorldBounds(true);

        // Player 2 (Blue)
        this.player2 = this.physics.add.container(1000, 500);

        const p2Graphics = this.add.graphics();
        p2Graphics.lineStyle(4, 0x0000ff);
        p2Graphics.strokeCircle(0, -30, 20); // Head
        p2Graphics.beginPath();
        p2Graphics.moveTo(0, -10);
        p2Graphics.lineTo(0, 20); // Body
        p2Graphics.moveTo(-15, 0);
        p2Graphics.lineTo(15, 0); // Arms
        p2Graphics.moveTo(0, 20);
        p2Graphics.lineTo(-10, 40); // Left leg
        p2Graphics.moveTo(0, 20);
        p2Graphics.lineTo(10, 40); // Right leg
        p2Graphics.strokePath();

        this.player2.add(p2Graphics);
        this.player2.setSize(PLAYER_SIZE, PLAYER_SIZE * 2);
        this.player2.body.setBounce(0.2);
        this.player2.body.setCollideWorldBounds(true);
    }

    createBall() {
        this.ball = this.physics.add.sprite(600, 200, null);
        this.ball.setCircle(BALL_SIZE);
        this.ball.setBounce(BALL_BOUNCE);
        this.ball.setCollideWorldBounds(true);
        this.ball.body.setMaxVelocity(800);

        // Ball graphics
        const ballGraphics = this.add.graphics();
        ballGraphics.fillStyle(0xffffff);
        ballGraphics.fillCircle(600, 200, BALL_SIZE);
        ballGraphics.lineStyle(2, 0x000000);
        ballGraphics.strokeCircle(600, 200, BALL_SIZE);

        // Store graphics reference for position updates
        this.ballGraphics = ballGraphics;
    }

    createUI() {
        // Score display
        this.scoreText1 = this.add.text(500, 50, '0', {
            fontSize: '48px',
            fontFamily: 'Arial Black',
            color: '#ff0000'
        }).setOrigin(1, 0.5);

        this.add.text(600, 50, '-', {
            fontSize: '48px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.scoreText2 = this.add.text(700, 50, '0', {
            fontSize: '48px',
            fontFamily: 'Arial Black',
            color: '#0000ff'
        }).setOrigin(0, 0.5);

        // Timer
        this.timerText = this.add.text(600, 20, `Time: ${this.matchTime}`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Controls hint
        this.add.text(10, 10, 'P1: WASD + S/X', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#ffffff'
        });

        this.add.text(1190, 10, 'P2: Arrows + Down/Num0', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(1, 0);

        this.add.text(600, 100, 'ESC: Pause', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);
    }

    setupControls() {
        // Player 1 controls
        this.keys1 = {
            left: this.input.keyboard.addKey('A'),
            right: this.input.keyboard.addKey('D'),
            up: this.input.keyboard.addKey('W'),
            kickLow: this.input.keyboard.addKey('S'),
            kickHigh: this.input.keyboard.addKey('X')
        };

        // Player 2 controls
        this.keys2 = {
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            kickLow: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            kickHigh: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO)
        };

        // Pause key
        this.input.keyboard.on('keydown-ESC', () => {
            if (!this.matchEnded) {
                this.scene.pause();
                this.scene.launch('PauseScene');
            }
        });
    }

    setupCollisions() {
        // Ball collisions
        this.physics.add.collider(this.ball, this.ground);
        this.physics.add.collider(this.ball, this.leftWall);
        this.physics.add.collider(this.ball, this.rightWall);

        // Player collisions
        this.physics.add.collider(this.player1, this.ground);
        this.physics.add.collider(this.player2, this.ground);
        this.physics.add.collider(this.player1, this.leftWall);
        this.physics.add.collider(this.player1, this.rightWall);
        this.physics.add.collider(this.player2, this.leftWall);
        this.physics.add.collider(this.player2, this.rightWall);
        this.physics.add.collider(this.player1, this.player2);

        // Ball-player collisions
        this.physics.add.collider(this.ball, this.player1, () => {
            this.handleBallPlayerCollision(this.player1, 1);
        });

        this.physics.add.collider(this.ball, this.player2, () => {
            this.handleBallPlayerCollision(this.player2, 2);
        });

        // Goal detection
        this.physics.add.overlap(this.ball, this.leftGoal, () => {
            if (!this.goalScored) {
                this.scoreGoal(2);
            }
        });

        this.physics.add.overlap(this.ball, this.rightGoal, () => {
            if (!this.goalScored) {
                this.scoreGoal(1);
            }
        });
    }

    handleBallPlayerCollision(player, playerNum) {
        // Simple header if ball is above player center
        if (this.ball.y < player.y - 20) {
            const angle = Phaser.Math.Angle.Between(player.x, player.y, this.ball.x, this.ball.y);
            const speed = 400;
            this.ball.body.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
        }
    }

    startMatchTimer() {
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (!this.matchEnded && !this.goalScored) {
                    this.matchTime--;
                    this.timerText.setText(`Time: ${this.matchTime}`);

                    if (this.matchTime <= 0) {
                        this.endMatch();
                    }
                }
            },
            loop: true
        });
    }

    scoreGoal(playerNum) {
        if (this.goalScored) return;
        this.goalScored = true;

        // Update score
        if (playerNum === 1) {
            this.score1++;
            this.scoreText1.setText(this.score1);
        } else {
            this.score2++;
            this.scoreText2.setText(this.score2);
        }

        // Show goal text
        const goalText = this.add.text(600, 300, 'GOAL!', {
            fontSize: '80px',
            fontFamily: 'Arial Black',
            color: '#ffff00',
            stroke: '#ff0000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Reset after 1 second
        this.time.delayedCall(1000, () => {
            goalText.destroy();
            this.resetPositions();
            this.goalScored = false;
        });
    }

    resetPositions() {
        // Reset ball
        this.ball.setPosition(600, 200);
        this.ball.body.setVelocity(0, 0);

        // Reset players
        this.player1.setPosition(200, 500);
        this.player1.body.setVelocity(0, 0);

        this.player2.setPosition(1000, 500);
        this.player2.body.setVelocity(0, 0);
    }

    endMatch() {
        this.matchEnded = true;
        this.scene.start('GameOverScene', {
            score1: this.score1,
            score2: this.score2
        });
    }

    update() {
        if (this.matchEnded || this.goalScored) return;

        // Update ball graphics position
        if (this.ballGraphics) {
            this.ballGraphics.clear();
            this.ballGraphics.fillStyle(0xffffff);
            this.ballGraphics.fillCircle(this.ball.x, this.ball.y, BALL_SIZE);
            this.ballGraphics.lineStyle(2, 0x000000);
            this.ballGraphics.strokeCircle(this.ball.x, this.ball.y, BALL_SIZE);
        }

        // Player 1 controls
        this.handlePlayerControls(this.player1, this.keys1, 1);

        // Player 2 controls
        this.handlePlayerControls(this.player2, this.keys2, 2);
    }

    handlePlayerControls(player, keys, playerNum) {
        // Horizontal movement
        if (keys.left.isDown) {
            player.body.setVelocityX(-PLAYER_SPEED);
        } else if (keys.right.isDown) {
            player.body.setVelocityX(PLAYER_SPEED);
        } else {
            player.body.setVelocityX(0);
        }

        // Jump
        if (keys.up.isDown && player.body.touching.down) {
            player.body.setVelocityY(JUMP_POWER);
        }

        // Kick
        if (keys.kickLow.isDown || keys.kickHigh.isDown) {
            const dx = this.ball.x - player.x;
            const dy = this.ball.y - player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 60) {
                const angle = Math.atan2(dy, dx);
                const power = keys.kickHigh.isDown ? HIGH_KICK_POWER : KICK_POWER;

                if (keys.kickHigh.isDown) {
                    // High kick - more vertical
                    this.ball.body.setVelocity(
                        Math.cos(angle) * power * 0.7,
                        -Math.abs(Math.sin(angle) * power * 1.2)
                    );
                } else {
                    // Low kick - more horizontal
                    this.ball.body.setVelocity(
                        Math.cos(angle) * power,
                        Math.sin(angle) * power * 0.5
                    );
                }
            }
        }
    }
}

// ==================== START GAME ====================
const game = new Phaser.Game(config);