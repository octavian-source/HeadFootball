// ==================== HEAD FOOTBALL - COMPLETE REWRITE ====================
// Fixed version with proper textures and working physics

// ==================== GAME CONSTANTS ====================
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 650;
const GROUND_Y = 580;
const GRAVITY = 1000;
const MATCH_TIME = 90;

// Player settings
const PLAYER_SPEED = 300;
const JUMP_POWER = -550;
const PLAYER_SIZE = 40;

// Ball settings
const BALL_BOUNCE = 0.8;
const BALL_SIZE = 15;
const KICK_POWER = 500;
const HIGH_KICK_POWER = 400;

// Goal settings
const GOAL_WIDTH = 80;
const GOAL_HEIGHT = 150;
const GOAL_Y = GROUND_Y - GOAL_HEIGHT / 2;

// AI Settings
const AI_CONFIG = {
    easy: {
        reactionTime: 500,
        accuracy: 0.5,
        speed: 0.6,
        jumpChance: 0.2,
        kickRange: 80
    },
    medium: {
        reactionTime: 300,
        accuracy: 0.75,
        speed: 0.8,
        jumpChance: 0.4,
        kickRange: 90
    },
    hard: {
        reactionTime: 150,
        accuracy: 0.9,
        speed: 1.0,
        jumpChance: 0.6,
        kickRange: 100
    }
};

// ==================== MENU SCENE ====================
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        // We'll create all textures in create() to avoid loading issues
    }

    create() {
        // Sky background
        this.add.rectangle(600, 325, 1200, 650, 0x87CEEB);

        // Title
        this.add.text(600, 120, 'HEAD FOOTBALL', {
            fontSize: '64px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        // Create buttons with proper interactive areas
        this.createButton(600, 280, 350, 70, 0x4CAF50, 'PLAYER vs PLAYER', () => {
            console.log('Starting PvP mode');
            this.scene.start('GameScene', { mode: 'pvp' });
        });

        this.createButton(600, 370, 350, 70, 0x2196F3, 'PLAYER vs BOT', () => {
            console.log('Opening difficulty selection');
            this.scene.start('DifficultyScene');
        });

        // Controls info
        this.add.text(600, 480, 'Player 1: WASD + Space (kick)', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.add.text(600, 510, 'Player 2: Arrow Keys + Shift (kick)', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.add.text(600, 550, 'ESC: Pause Game', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
    }

    createButton(x, y, width, height, color, text, callback) {
        const button = this.add.rectangle(x, y, width, height, color);
        button.setInteractive({ useHandCursor: true });

        const buttonText = this.add.text(x, y, text, {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        button.on('pointerover', () => {
            button.setFillStyle(Phaser.Display.Color.GetColor32(
                (color >> 16) & 0xFF,
                ((color >> 8) & 0xFF) + 30,
                (color & 0xFF) + 30,
                255
            ));
        });

        button.on('pointerout', () => {
            button.setFillStyle(color);
        });

        button.on('pointerdown', callback);

        return { button, text: buttonText };
    }
}

// ==================== DIFFICULTY SCENE ====================
class DifficultyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DifficultyScene' });
    }

    create() {
        // Background
        this.add.rectangle(600, 325, 1200, 650, 0x87CEEB);

        // Title
        this.add.text(600, 150, 'SELECT DIFFICULTY', {
            fontSize: '48px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Difficulty buttons
        this.createButton(600, 280, 300, 60, 0x4CAF50, 'EASY', () => {
            console.log('Starting bot game - Easy');
            this.scene.start('GameScene', { mode: 'bot', difficulty: 'easy' });
        });

        this.createButton(600, 360, 300, 60, 0xFF9800, 'MEDIUM', () => {
            console.log('Starting bot game - Medium');
            this.scene.start('GameScene', { mode: 'bot', difficulty: 'medium' });
        });

        this.createButton(600, 440, 300, 60, 0xf44336, 'HARD', () => {
            console.log('Starting bot game - Hard');
            this.scene.start('GameScene', { mode: 'bot', difficulty: 'hard' });
        });

        // Back button
        this.createButton(600, 530, 200, 50, 0x666666, 'BACK', () => {
            this.scene.start('MenuScene');
        });
    }

    createButton(x, y, width, height, color, text, callback) {
        const button = this.add.rectangle(x, y, width, height, color);
        button.setInteractive({ useHandCursor: true });

        const buttonText = this.add.text(x, y, text, {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        button.on('pointerover', () => {
            button.setFillStyle(Phaser.Display.Color.GetColor32(
                Math.min(255, ((color >> 16) & 0xFF) + 30),
                Math.min(255, ((color >> 8) & 0xFF) + 30),
                Math.min(255, (color & 0xFF) + 30),
                255
            ));
        });

        button.on('pointerout', () => {
            button.setFillStyle(color);
        });

        button.on('pointerdown', callback);

        return { button, text: buttonText };
    }
}

// ==================== PAUSE SCENE ====================
class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {
        // Semi-transparent overlay
        this.add.rectangle(600, 325, 1200, 650, 0x000000, 0.7);

        // Pause text
        this.add.text(600, 200, 'GAME PAUSED', {
            fontSize: '64px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Resume button
        this.createButton(600, 320, 300, 60, 0x4CAF50, 'RESUME', () => {
            this.scene.resume('GameScene');
            this.scene.stop();
        });

        // Main menu button
        this.createButton(600, 400, 300, 60, 0xFF9800, 'MAIN MENU', () => {
            this.scene.stop('GameScene');
            this.scene.stop();
            this.scene.start('MenuScene');
        });

        // ESC to resume
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.resume('GameScene');
            this.scene.stop();
        });
    }

    createButton(x, y, width, height, color, text, callback) {
        const button = this.add.rectangle(x, y, width, height, color);
        button.setInteractive({ useHandCursor: true });

        const buttonText = this.add.text(x, y, text, {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        button.on('pointerdown', callback);

        return { button, text: buttonText };
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
        this.gameMode = data.mode || 'pvp';
    }

    create() {
        // Background
        this.add.rectangle(600, 325, 1200, 650, 0x222222);

        // Determine winner
        let winnerText = 'DRAW!';
        let winnerColor = '#ffff00';

        if (this.finalScore1 > this.finalScore2) {
            winnerText = this.gameMode === 'bot' ? 'YOU WIN!' : 'PLAYER 1 WINS!';
            winnerColor = '#00ff00';
        } else if (this.finalScore2 > this.finalScore1) {
            winnerText = this.gameMode === 'bot' ? 'BOT WINS!' : 'PLAYER 2 WINS!';
            winnerColor = '#ff0000';
        }

        // Winner text
        this.add.text(600, 200, winnerText, {
            fontSize: '64px',
            fontFamily: 'Arial Black',
            color: winnerColor,
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Final score
        this.add.text(600, 300, `Final Score: ${this.finalScore1} - ${this.finalScore2}`, {
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Play again button
        this.createButton(600, 400, 300, 60, 0x4CAF50, 'PLAY AGAIN', () => {
            this.scene.start('MenuScene');
        });

        // Main menu button
        this.createButton(600, 480, 300, 60, 0xFF9800, 'MAIN MENU', () => {
            this.scene.start('MenuScene');
        });
    }

    createButton(x, y, width, height, color, text, callback) {
        const button = this.add.rectangle(x, y, width, height, color);
        button.setInteractive({ useHandCursor: true });

        const buttonText = this.add.text(x, y, text, {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        button.on('pointerdown', callback);

        return { button, text: buttonText };
    }
}

// ==================== MAIN GAME SCENE ====================
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.gameMode = data.mode || 'pvp';
        this.difficulty = data.difficulty || 'medium';
        this.aiConfig = AI_CONFIG[this.difficulty];
        this.aiTimer = 0;
        console.log(`Game initialized: mode=${this.gameMode}, difficulty=${this.difficulty}`);
    }

    preload() {
        // Create textures programmatically
        this.load.on('complete', () => {
            console.log('Preload complete');
        });
    }

    create() {
        console.log('GameScene create() started');

        // Initialize game state
        this.score1 = 0;
        this.score2 = 0;
        this.goalScored = false;
        this.matchTime = MATCH_TIME;
        this.matchEnded = false;

        // Create game elements in order
        this.createTextures();
        this.createField();
        this.createPlayers();
        this.createBall();
        this.createUI();
        this.setupControls();
        this.setupCollisions();
        this.startMatchTimer();

        console.log('GameScene create() completed');
    }

    createTextures() {
        // Create player texture (red circle for head, lines for body)
        if (!this.textures.exists('player1')) {
            const graphics = this.make.graphics({ x: 0, y: 0 }, false);
            graphics.fillStyle(0xff0000, 1);
            graphics.fillCircle(20, 20, 20);
            graphics.lineStyle(4, 0xff0000);
            graphics.strokeCircle(20, 20, 20);
            graphics.generateTexture('player1', 40, 40);
            graphics.destroy();
        }

        // Create player 2 texture
        if (!this.textures.exists('player2')) {
            const graphics = this.make.graphics({ x: 0, y: 0 }, false);
            graphics.fillStyle(0x0000ff, 1);
            graphics.fillCircle(20, 20, 20);
            graphics.lineStyle(4, 0x0000ff);
            graphics.strokeCircle(20, 20, 20);
            graphics.generateTexture('player2', 40, 40);
            graphics.destroy();
        }

        // Create ball texture
        if (!this.textures.exists('ball')) {
            const graphics = this.make.graphics({ x: 0, y: 0 }, false);
            graphics.fillStyle(0xffffff, 1);
            graphics.fillCircle(15, 15, 15);
            graphics.lineStyle(2, 0x000000);
            graphics.strokeCircle(15, 15, 15);
            graphics.generateTexture('ball', 30, 30);
            graphics.destroy();
        }

        // Create ground texture
        if (!this.textures.exists('ground')) {
            const graphics = this.make.graphics({ x: 0, y: 0 }, false);
            graphics.fillStyle(0x3a7d3a, 1);
            graphics.fillRect(0, 0, 1200, 20);
            graphics.generateTexture('ground', 1200, 20);
            graphics.destroy();
        }

        // Create wall texture
        if (!this.textures.exists('wall')) {
            const graphics = this.make.graphics({ x: 0, y: 0 }, false);
            graphics.fillStyle(0x000000, 0);
            graphics.fillRect(0, 0, 10, 650);
            graphics.generateTexture('wall', 10, 650);
            graphics.destroy();
        }
    }

    createField() {
        // Sky background
        this.add.rectangle(600, 325, 1200, 650, 0x87CEEB);

        // Grass
        this.add.rectangle(600, GROUND_Y + 35, 1200, 140, 0x3a7d3a);

        // Create ground with physics
        this.ground = this.physics.add.sprite(600, GROUND_Y, 'ground');
        this.ground.setImmovable(true);
        this.ground.body.allowGravity = false;

        // Create walls
        this.leftWall = this.physics.add.sprite(-5, 325, 'wall');
        this.leftWall.setImmovable(true);
        this.leftWall.body.allowGravity = false;

        this.rightWall = this.physics.add.sprite(1205, 325, 'wall');
        this.rightWall.setImmovable(true);
        this.rightWall.body.allowGravity = false;

        // Goal areas (visual only)
        this.add.rectangle(40, GOAL_Y, GOAL_WIDTH, GOAL_HEIGHT, 0xffffff, 0.3);
        this.add.rectangle(40, GOAL_Y, GOAL_WIDTH, GOAL_HEIGHT).setStrokeStyle(4, 0xffffff);

        this.add.rectangle(1160, GOAL_Y, GOAL_WIDTH, GOAL_HEIGHT, 0xffffff, 0.3);
        this.add.rectangle(1160, GOAL_Y, GOAL_WIDTH, GOAL_HEIGHT).setStrokeStyle(4, 0xffffff);

        // Goal sensors (for scoring)
        this.leftGoal = this.add.rectangle(40, GOAL_Y, GOAL_WIDTH - 20, GOAL_HEIGHT - 10, 0x00ff00, 0);
        this.physics.add.existing(this.leftGoal, true);

        this.rightGoal = this.add.rectangle(1160, GOAL_Y, GOAL_WIDTH - 20, GOAL_HEIGHT - 10, 0x00ff00, 0);
        this.physics.add.existing(this.rightGoal, true);
    }

    createPlayers() {
        // Player 1 (Red - left side)
        this.player1 = this.physics.add.sprite(200, 450, 'player1');
        this.player1.setBounce(0.2);
        this.player1.setCollideWorldBounds(true);
        this.player1.setScale(1.5);

        // Player 2 / Bot (Blue - right side)
        this.player2 = this.physics.add.sprite(1000, 450, 'player2');
        this.player2.setBounce(0.2);
        this.player2.setCollideWorldBounds(true);
        this.player2.setScale(1.5);

        // Add name labels
        this.add.text(200, 400, 'P1', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ff0000'
        }).setOrigin(0.5);

        const p2Label = this.gameMode === 'bot' ? 'BOT' : 'P2';
        this.add.text(1000, 400, p2Label, {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#0000ff'
        }).setOrigin(0.5);
    }

    createBall() {
        this.ball = this.physics.add.sprite(600, 300, 'ball');
        this.ball.setBounce(BALL_BOUNCE);
        this.ball.setCollideWorldBounds(true);
        this.ball.body.setCircle(15);
        this.ball.setMaxVelocity(800, 800);
    }

    createUI() {
        // Score display
        this.scoreText1 = this.add.text(500, 50, '0', {
            fontSize: '48px',
            fontFamily: 'Arial Black',
            color: '#ff0000',
            stroke: '#ffffff',
            strokeThickness: 3
        }).setOrigin(1, 0.5);

        this.add.text(600, 50, '-', {
            fontSize: '48px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.scoreText2 = this.add.text(700, 50, '0', {
            fontSize: '48px',
            fontFamily: 'Arial Black',
            color: '#0000ff',
            stroke: '#ffffff',
            strokeThickness: 3
        }).setOrigin(0, 0.5);

        // Timer
        this.timerText = this.add.text(600, 20, `Time: ${this.matchTime}`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Mode indicator
        const modeText = this.gameMode === 'bot' ? `vs BOT (${this.difficulty.toUpperCase()})` : 'Player vs Player';
        this.add.text(600, 100, modeText, {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Controls reminder
        this.add.text(10, 10, 'P1: WASD + Space', {
            fontSize: '14px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });

        if (this.gameMode === 'pvp') {
            this.add.text(1190, 10, 'P2: Arrows + Shift', {
                fontSize: '14px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(1, 0);
        }

        this.add.text(600, 630, 'ESC: Pause', {
            fontSize: '14px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
    }

    setupControls() {
        // Player 1 controls
        this.keys1 = {
            left: this.input.keyboard.addKey('A'),
            right: this.input.keyboard.addKey('D'),
            up: this.input.keyboard.addKey('W'),
            kick: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        };

        // Player 2 controls (for PvP mode)
        this.keys2 = {
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            kick: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
        };

        // Pause control
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
            this.handleBallHit(this.player1);
        });

        this.physics.add.collider(this.ball, this.player2, () => {
            this.handleBallHit(this.player2);
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

    handleBallHit(player) {
        // Add some randomness to ball physics on contact
        const angle = Phaser.Math.Angle.Between(player.x, player.y, this.ball.x, this.ball.y);
        const force = 200;
        this.ball.body.velocity.x += Math.cos(angle) * force;
        this.ball.body.velocity.y += Math.sin(angle) * force;
    }

    startMatchTimer() {
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (!this.matchEnded && !this.goalScored) {
                    this.matchTime--;
                    this.timerText.setText(`Time: ${this.matchTime}`);

                    if (this.matchTime <= 10) {
                        this.timerText.setColor('#ff0000');
                    }

                    if (this.matchTime <= 0) {
                        this.endMatch();
                    }
                }
            },
            loop: true
        });
    }

    scoreGoal(playerNum) {
        if (this.goalScored || this.matchEnded) return;
        this.goalScored = true;

        // Update score
        if (playerNum === 1) {
            this.score1++;
            this.scoreText1.setText(this.score1.toString());
        } else {
            this.score2++;
            this.scoreText2.setText(this.score2.toString());
        }

        // Show goal text
        const goalText = this.add.text(600, 300, 'GOAL!!!', {
            fontSize: '80px',
            fontFamily: 'Arial Black',
            color: '#ffff00',
            stroke: '#ff0000',
            strokeThickness: 8
        }).setOrigin(0.5);

        // Reset after delay
        this.time.delayedCall(1500, () => {
            goalText.destroy();
            this.resetPositions();
            this.goalScored = false;
        });
    }

    resetPositions() {
        // Reset ball
        this.ball.setPosition(600, 300);
        this.ball.setVelocity(0, 0);

        // Reset players
        this.player1.setPosition(200, 450);
        this.player1.setVelocity(0, 0);

        this.player2.setPosition(1000, 450);
        this.player2.setVelocity(0, 0);
    }

    endMatch() {
        this.matchEnded = true;

        // Transition to game over scene
        this.time.delayedCall(1000, () => {
            this.scene.start('GameOverScene', {
                score1: this.score1,
                score2: this.score2,
                mode: this.gameMode
            });
        });
    }

    updateBot(delta) {
        if (this.gameMode !== 'bot' || this.matchEnded || this.goalScored) return;

        this.aiTimer += delta;
        if (this.aiTimer < this.aiConfig.reactionTime) return;
        this.aiTimer = 0;

        const bot = this.player2;
        const ball = this.ball;
        const ai = this.aiConfig;

        // Calculate distances
        const distToBall = Phaser.Math.Distance.Between(bot.x, bot.y, ball.x, ball.y);

        // Simple AI logic
        let targetX = ball.x;

        // Defensive positioning when ball is far
        if (ball.x < 600) {
            targetX = 900; // Stay back near goal
        }

        // Move towards target
        const moveSpeed = PLAYER_SPEED * ai.speed;

        if (Math.random() < ai.accuracy) {
            if (bot.x < targetX - 30) {
                bot.body.setVelocityX(moveSpeed);
            } else if (bot.x > targetX + 30) {
                bot.body.setVelocityX(-moveSpeed);
            } else {
                bot.body.setVelocityX(0);
            }
        }

        // Jump if ball is high
        if (ball.y < bot.y - 50 && distToBall < 150 && bot.body.touching.down) {
            if (Math.random() < ai.jumpChance) {
                bot.body.setVelocityY(JUMP_POWER);
            }
        }

        // Kick when close
        if (distToBall < ai.kickRange && Math.random() < ai.accuracy) {
            const kickAngle = Phaser.Math.Angle.Between(bot.x, bot.y, 40, GOAL_Y);
            this.ball.body.setVelocity(
                Math.cos(kickAngle) * KICK_POWER,
                Math.sin(kickAngle) * KICK_POWER * 0.7
            );
        }
    }

    update(time, delta) {
        if (this.matchEnded || this.goalScored) return;

        // Player 1 controls (always human)
        this.handlePlayerControls(this.player1, this.keys1);

        // Player 2: human or bot
        if (this.gameMode === 'pvp') {
            this.handlePlayerControls(this.player2, this.keys2);
        } else {
            this.updateBot(delta);
        }

        // Limit ball speed
        const ballSpeed = Math.sqrt(
            this.ball.body.velocity.x ** 2 +
            this.ball.body.velocity.y ** 2
        );
        if (ballSpeed > 800) {
            const scale = 800 / ballSpeed;
            this.ball.body.velocity.x *= scale;
            this.ball.body.velocity.y *= scale;
        }
    }

    handlePlayerControls(player, keys) {
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
        if (Phaser.Input.Keyboard.JustDown(keys.kick)) {
            const dx = this.ball.x - player.x;
            const dy = this.ball.y - player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 80) {
                const angle = Math.atan2(dy, dx);
                this.ball.body.setVelocity(
                    Math.cos(angle) * KICK_POWER,
                    Math.sin(angle) * KICK_POWER * 0.5
                );
            }
        }
    }
}

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
    scene: [MenuScene, DifficultyScene, GameScene, PauseScene, GameOverScene]
};

// ==================== START GAME ====================
console.log('Starting Head Football game...');
const game = new Phaser.Game(config);