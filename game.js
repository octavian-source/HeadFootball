// ==================== SIMPLE HEAD FOOTBALL GAME ====================
// Clean, working version with AI bot

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

// AI Settings
const AI_CONFIG = {
    easy: {
        reactionTime: 400,
        accuracy: 0.6,
        speed: 0.7,
        jumpChance: 0.3,
        kickRange: 70
    },
    medium: {
        reactionTime: 250,
        accuracy: 0.8,
        speed: 0.85,
        jumpChance: 0.5,
        kickRange: 80
    },
    hard: {
        reactionTime: 100,
        accuracy: 0.95,
        speed: 1.0,
        jumpChance: 0.7,
        kickRange: 90
    }
};

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

// ==================== MENU SCENE ====================
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        this.add.rectangle(600, 325, 1200, 650, 0x87CEEB);

        this.add.text(600, 120, 'HEAD FOOTBALL', {
            fontSize: '64px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Player vs Player button
        const pvpButton = this.add.rectangle(600, 280, 350, 70, 0x4CAF50);
        pvpButton.setInteractive({ useHandCursor: true });
        this.add.text(600, 280, 'Player vs Player', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        pvpButton.on('pointerdown', () => {
            this.scene.start('GameScene', { mode: 'pvp' });
        });
        pvpButton.on('pointerover', () => pvpButton.setFillStyle(0x66BB6A));
        pvpButton.on('pointerout', () => pvpButton.setFillStyle(0x4CAF50));

        // Player vs Bot button
        const botButton = this.add.rectangle(600, 370, 350, 70, 0x2196F3);
        botButton.setInteractive({ useHandCursor: true });
        this.add.text(600, 370, 'Player vs Bot', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        botButton.on('pointerdown', () => {
            this.scene.start('DifficultyScene');
        });
        botButton.on('pointerover', () => botButton.setFillStyle(0x42A5F5));
        botButton.on('pointerout', () => botButton.setFillStyle(0x2196F3));

        // Controls info
        this.add.text(600, 480, 'Player 1: WASD + S (kick) + X (high kick)', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.add.text(600, 510, 'Player 2: Arrows + Down (kick) + NumPad0 (high kick)', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.add.text(600, 550, 'ESC: Pause', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
    }
}

// ==================== DIFFICULTY SCENE ====================
class DifficultyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DifficultyScene' });
    }

    create() {
        this.add.rectangle(600, 325, 1200, 650, 0x87CEEB);

        this.add.text(600, 150, 'SELECT DIFFICULTY', {
            fontSize: '48px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Easy
        const easyBtn = this.add.rectangle(600, 280, 300, 60, 0x4CAF50);
        easyBtn.setInteractive({ useHandCursor: true });
        this.add.text(600, 280, 'EASY', { fontSize: '28px', fontFamily: 'Arial', color: '#ffffff' }).setOrigin(0.5);
        easyBtn.on('pointerdown', () => this.scene.start('GameScene', { mode: 'bot', difficulty: 'easy' }));
        easyBtn.on('pointerover', () => easyBtn.setFillStyle(0x66BB6A));
        easyBtn.on('pointerout', () => easyBtn.setFillStyle(0x4CAF50));

        // Medium
        const mediumBtn = this.add.rectangle(600, 360, 300, 60, 0xFF9800);
        mediumBtn.setInteractive({ useHandCursor: true });
        this.add.text(600, 360, 'MEDIUM', { fontSize: '28px', fontFamily: 'Arial', color: '#ffffff' }).setOrigin(0.5);
        mediumBtn.on('pointerdown', () => this.scene.start('GameScene', { mode: 'bot', difficulty: 'medium' }));
        mediumBtn.on('pointerover', () => mediumBtn.setFillStyle(0xFFB74D));
        mediumBtn.on('pointerout', () => mediumBtn.setFillStyle(0xFF9800));

        // Hard
        const hardBtn = this.add.rectangle(600, 440, 300, 60, 0xf44336);
        hardBtn.setInteractive({ useHandCursor: true });
        this.add.text(600, 440, 'HARD', { fontSize: '28px', fontFamily: 'Arial', color: '#ffffff' }).setOrigin(0.5);
        hardBtn.on('pointerdown', () => this.scene.start('GameScene', { mode: 'bot', difficulty: 'hard' }));
        hardBtn.on('pointerover', () => hardBtn.setFillStyle(0xE57373));
        hardBtn.on('pointerout', () => hardBtn.setFillStyle(0xf44336));

        // Back button
        const backBtn = this.add.rectangle(600, 530, 200, 50, 0x666666);
        backBtn.setInteractive({ useHandCursor: true });
        this.add.text(600, 530, 'BACK', { fontSize: '24px', fontFamily: 'Arial', color: '#ffffff' }).setOrigin(0.5);
        backBtn.on('pointerdown', () => this.scene.start('MenuScene'));
        backBtn.on('pointerover', () => backBtn.setFillStyle(0x888888));
        backBtn.on('pointerout', () => backBtn.setFillStyle(0x666666));
    }
}

// ==================== PAUSE SCENE ====================
class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {
        this.add.rectangle(600, 325, 1200, 650, 0x000000, 0.7);

        this.add.text(600, 200, 'PAUSED', {
            fontSize: '64px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Resume
        const resumeBtn = this.add.rectangle(600, 320, 300, 60, 0x4CAF50);
        resumeBtn.setInteractive({ useHandCursor: true });
        this.add.text(600, 320, 'RESUME', { fontSize: '28px', fontFamily: 'Arial', color: '#ffffff' }).setOrigin(0.5);
        resumeBtn.on('pointerdown', () => {
            this.scene.resume('GameScene');
            this.scene.stop();
        });

        // Menu
        const menuBtn = this.add.rectangle(600, 400, 300, 60, 0xFF9800);
        menuBtn.setInteractive({ useHandCursor: true });
        this.add.text(600, 400, 'MAIN MENU', { fontSize: '28px', fontFamily: 'Arial', color: '#ffffff' }).setOrigin(0.5);
        menuBtn.on('pointerdown', () => {
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
        this.add.rectangle(600, 325, 1200, 650, 0x222222);

        let winnerText = 'DRAW!';
        let winnerColor = '#ffff00';

        if (this.finalScore1 > this.finalScore2) {
            winnerText = this.gameMode === 'bot' ? 'YOU WIN!' : 'PLAYER 1 WINS!';
            winnerColor = '#ff0000';
        } else if (this.finalScore2 > this.finalScore1) {
            winnerText = this.gameMode === 'bot' ? 'BOT WINS!' : 'PLAYER 2 WINS!';
            winnerColor = '#0000ff';
        }

        this.add.text(600, 200, winnerText, {
            fontSize: '64px',
            fontFamily: 'Arial Black',
            color: winnerColor
        }).setOrigin(0.5);

        this.add.text(600, 300, `Final Score: ${this.finalScore1} - ${this.finalScore2}`, {
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Play Again
        const playBtn = this.add.rectangle(600, 400, 300, 60, 0x4CAF50);
        playBtn.setInteractive({ useHandCursor: true });
        this.add.text(600, 400, 'PLAY AGAIN', { fontSize: '28px', fontFamily: 'Arial', color: '#ffffff' }).setOrigin(0.5);
        playBtn.on('pointerdown', () => this.scene.start('MenuScene'));

        // Menu
        const menuBtn = this.add.rectangle(600, 480, 300, 60, 0xFF9800);
        menuBtn.setInteractive({ useHandCursor: true });
        this.add.text(600, 480, 'MAIN MENU', { fontSize: '28px', fontFamily: 'Arial', color: '#ffffff' }).setOrigin(0.5);
        menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));
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
        this.aiAction = null;
    }

    create() {
        this.score1 = 0;
        this.score2 = 0;
        this.goalScored = false;
        this.matchTime = MATCH_TIME;
        this.matchEnded = false;

        this.createField();
        this.createPlayers();
        this.createBall();
        this.createUI();
        this.setupControls();
        this.setupCollisions();
        this.startMatchTimer();
    }

    createField() {
        this.add.rectangle(600, 325, 1200, 650, 0x87CEEB);
        this.add.rectangle(600, 585, 1200, 130, 0x3a7d3a);

        this.ground = this.physics.add.staticImage(600, GROUND_Y, null);
        this.ground.setSize(1200, 20);
        this.ground.setVisible(false);

        this.leftWall = this.physics.add.staticImage(-5, 325, null);
        this.leftWall.setSize(10, 650);
        this.leftWall.setVisible(false);

        this.rightWall = this.physics.add.staticImage(1205, 325, null);
        this.rightWall.setSize(10, 650);
        this.rightWall.setVisible(false);

        this.leftGoal = this.physics.add.staticImage(25, GOAL_Y, null);
        this.leftGoal.setSize(GOAL_WIDTH, GOAL_HEIGHT);
        this.leftGoal.setVisible(false);

        this.rightGoal = this.physics.add.staticImage(1175, GOAL_Y, null);
        this.rightGoal.setSize(GOAL_WIDTH, GOAL_HEIGHT);
        this.rightGoal.setVisible(false);

        // Goal visuals
        this.add.rectangle(25, GOAL_Y, GOAL_WIDTH, GOAL_HEIGHT, 0xffffff, 0.3);
        this.add.rectangle(25, GOAL_Y, GOAL_WIDTH, GOAL_HEIGHT).setStrokeStyle(4, 0xffffff);
        this.add.rectangle(1175, GOAL_Y, GOAL_WIDTH, GOAL_HEIGHT, 0xffffff, 0.3);
        this.add.rectangle(1175, GOAL_Y, GOAL_WIDTH, GOAL_HEIGHT).setStrokeStyle(4, 0xffffff);
    }

    createPlayers() {
        // Player 1 (Red - left side)
        this.player1 = this.physics.add.container(200, 500);
        const p1Graphics = this.add.graphics();
        p1Graphics.lineStyle(4, 0xff0000);
        p1Graphics.strokeCircle(0, -30, 20);
        p1Graphics.beginPath();
        p1Graphics.moveTo(0, -10);
        p1Graphics.lineTo(0, 20);
        p1Graphics.moveTo(-15, 0);
        p1Graphics.lineTo(15, 0);
        p1Graphics.moveTo(0, 20);
        p1Graphics.lineTo(-10, 40);
        p1Graphics.moveTo(0, 20);
        p1Graphics.lineTo(10, 40);
        p1Graphics.strokePath();
        this.player1.add(p1Graphics);
        this.player1.setSize(PLAYER_SIZE, PLAYER_SIZE * 2);
        this.player1.body.setBounce(0.2);
        this.player1.body.setCollideWorldBounds(true);

        // Player 2 / Bot (Blue - right side)
        this.player2 = this.physics.add.container(1000, 500);
        const p2Graphics = this.add.graphics();
        p2Graphics.lineStyle(4, 0x0000ff);
        p2Graphics.strokeCircle(0, -30, 20);
        p2Graphics.beginPath();
        p2Graphics.moveTo(0, -10);
        p2Graphics.lineTo(0, 20);
        p2Graphics.moveTo(-15, 0);
        p2Graphics.lineTo(15, 0);
        p2Graphics.moveTo(0, 20);
        p2Graphics.lineTo(-10, 40);
        p2Graphics.moveTo(0, 20);
        p2Graphics.lineTo(10, 40);
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

        this.ballGraphics = this.add.graphics();
    }

    createUI() {
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

        this.timerText = this.add.text(600, 20, `Time: ${this.matchTime}`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Mode indicator
        const modeText = this.gameMode === 'bot' ? `vs BOT (${this.difficulty.toUpperCase()})` : 'PvP';
        this.add.text(600, 100, modeText, {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.add.text(10, 10, 'P1: WASD + S/X', {
            fontSize: '14px',
            color: '#ffffff'
        });

        this.add.text(600, 630, 'ESC: Pause', {
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }

    setupControls() {
        this.keys1 = {
            left: this.input.keyboard.addKey('A'),
            right: this.input.keyboard.addKey('D'),
            up: this.input.keyboard.addKey('W'),
            kickLow: this.input.keyboard.addKey('S'),
            kickHigh: this.input.keyboard.addKey('X')
        };

        this.keys2 = {
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            kickLow: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            kickHigh: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO)
        };

        this.input.keyboard.on('keydown-ESC', () => {
            if (!this.matchEnded) {
                this.scene.pause();
                this.scene.launch('PauseScene');
            }
        });
    }

    setupCollisions() {
        this.physics.add.collider(this.ball, this.ground);
        this.physics.add.collider(this.ball, this.leftWall);
        this.physics.add.collider(this.ball, this.rightWall);
        this.physics.add.collider(this.player1, this.ground);
        this.physics.add.collider(this.player2, this.ground);
        this.physics.add.collider(this.player1, this.leftWall);
        this.physics.add.collider(this.player1, this.rightWall);
        this.physics.add.collider(this.player2, this.leftWall);
        this.physics.add.collider(this.player2, this.rightWall);
        this.physics.add.collider(this.player1, this.player2);

        this.physics.add.collider(this.ball, this.player1, () => {
            this.handleBallHit(this.player1);
        });

        this.physics.add.collider(this.ball, this.player2, () => {
            this.handleBallHit(this.player2);
        });

        this.physics.add.overlap(this.ball, this.leftGoal, () => {
            if (!this.goalScored) this.scoreGoal(2);
        });

        this.physics.add.overlap(this.ball, this.rightGoal, () => {
            if (!this.goalScored) this.scoreGoal(1);
        });
    }

    handleBallHit(player) {
        if (this.ball.y < player.y - 20) {
            const angle = Phaser.Math.Angle.Between(player.x, player.y, this.ball.x, this.ball.y);
            this.ball.body.setVelocity(Math.cos(angle) * 400, Math.sin(angle) * 400);
        }
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
        if (this.goalScored) return;
        this.goalScored = true;

        if (playerNum === 1) {
            this.score1++;
            this.scoreText1.setText(this.score1);
        } else {
            this.score2++;
            this.scoreText2.setText(this.score2);
        }

        const goalText = this.add.text(600, 300, 'GOAL!', {
            fontSize: '80px',
            fontFamily: 'Arial Black',
            color: '#ffff00',
            stroke: '#ff0000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.time.delayedCall(1000, () => {
            goalText.destroy();
            this.resetPositions();
            this.goalScored = false;
        });
    }

    resetPositions() {
        this.ball.setPosition(600, 200);
        this.ball.body.setVelocity(0, 0);
        this.player1.setPosition(200, 500);
        this.player1.body.setVelocity(0, 0);
        this.player2.setPosition(1000, 500);
        this.player2.body.setVelocity(0, 0);
    }

    endMatch() {
        this.matchEnded = true;
        this.scene.start('GameOverScene', {
            score1: this.score1,
            score2: this.score2,
            mode: this.gameMode
        });
    }

    // ==================== AI BOT LOGIC ====================
    updateBot(delta) {
        if (this.gameMode !== 'bot') return;

        this.aiTimer += delta;
        if (this.aiTimer < this.aiConfig.reactionTime) return;
        this.aiTimer = 0;

        const bot = this.player2;
        const ball = this.ball;
        const ai = this.aiConfig;

        // Calculate distances
        const distToBall = Phaser.Math.Distance.Between(bot.x, bot.y, ball.x, ball.y);
        const ballVelX = ball.body.velocity.x;
        const ballVelY = ball.body.velocity.y;

        // Predict ball position
        const predictionTime = 0.3;
        const predictedBallX = ball.x + ballVelX * predictionTime;
        const predictedBallY = ball.y + ballVelY * predictionTime;

        // Target position: between ball and own goal, with some intelligence
        let targetX;

        // If ball is coming towards bot's side
        if (ball.x > 600 || ballVelX > 100) {
            // Defensive: stay between ball and goal
            targetX = Math.max(ball.x + 50, 900);
        } else {
            // Ball is on opponent's side - stay back but ready
            targetX = 950;
        }

        // Move towards target with accuracy factor
        const moveThreshold = 30;
        const speedMultiplier = PLAYER_SPEED * ai.speed;

        if (Math.random() < ai.accuracy) {
            if (bot.x < targetX - moveThreshold) {
                bot.body.setVelocityX(speedMultiplier);
            } else if (bot.x > targetX + moveThreshold) {
                bot.body.setVelocityX(-speedMultiplier);
            } else {
                bot.body.setVelocityX(0);
            }
        }

        // Jump logic - jump when ball is high and nearby
        const shouldJump = (
            ball.y < bot.y - 50 &&
            distToBall < 200 &&
            bot.body.touching.down &&
            Math.random() < ai.jumpChance
        );

        if (shouldJump) {
            bot.body.setVelocityY(JUMP_POWER);
        }

        // Kick logic - kick when ball is close
        if (distToBall < ai.kickRange && Math.random() < ai.accuracy) {
            const angle = Math.atan2(ball.y - bot.y, ball.x - bot.x);

            // Decide kick type based on ball position
            if (ball.y < bot.y - 30) {
                // Ball is high - header
                this.ball.body.setVelocity(
                    Math.cos(angle) * KICK_POWER * 0.8,
                    -300
                );
            } else {
                // Normal kick towards opponent's goal
                const kickAngle = Math.atan2(GOAL_Y - ball.y, 25 - ball.x);
                this.ball.body.setVelocity(
                    Math.cos(kickAngle) * KICK_POWER,
                    Math.sin(kickAngle) * KICK_POWER * 0.5
                );
            }
        }
    }

    update(time, delta) {
        if (this.matchEnded || this.goalScored) return;

        // Update ball graphics
        this.ballGraphics.clear();
        this.ballGraphics.fillStyle(0xffffff);
        this.ballGraphics.fillCircle(this.ball.x, this.ball.y, BALL_SIZE);
        this.ballGraphics.lineStyle(2, 0x000000);
        this.ballGraphics.strokeCircle(this.ball.x, this.ball.y, BALL_SIZE);

        // Player 1 controls (always human)
        this.handlePlayerControls(this.player1, this.keys1);

        // Player 2: human or bot
        if (this.gameMode === 'pvp') {
            this.handlePlayerControls(this.player2, this.keys2);
        } else {
            this.updateBot(delta);
        }
    }

    handlePlayerControls(player, keys) {
        // Movement
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
        if (Phaser.Input.Keyboard.JustDown(keys.kickLow) || Phaser.Input.Keyboard.JustDown(keys.kickHigh)) {
            const dx = this.ball.x - player.x;
            const dy = this.ball.y - player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 60) {
                const angle = Math.atan2(dy, dx);
                const isHigh = keys.kickHigh.isDown;
                const power = isHigh ? HIGH_KICK_POWER : KICK_POWER;

                if (isHigh) {
                    this.ball.body.setVelocity(
                        Math.cos(angle) * power * 0.7,
                        -Math.abs(Math.sin(angle) * power * 1.2)
                    );
                } else {
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
