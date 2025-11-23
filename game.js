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
const KICK_POWER = 900;  // Increased kick power for better shooting
const HIGH_KICK_POWER = 700;  // Higher power for aerial kicks
const LEG_KICK_POWER = 1000;  // Special power for leg kicks
const LEG_REACH = 35;  // Leg reach distance
const KICK_ANIMATION_TIME = 200;  // Kick animation duration in ms

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

// ==================== CAREER DATA MANAGER ====================
const CareerManager = {
    getProgress() {
        const saved = localStorage.getItem('headFootballCareerProgress');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            completedLevels: [],
            currentLevel: 1,
            highestUnlockedLevel: 1
        };
    },

    saveProgress(progress) {
        localStorage.setItem('headFootballCareerProgress', JSON.stringify(progress));
    },

    completeLevel(level) {
        const progress = this.getProgress();
        if (!progress.completedLevels.includes(level)) {
            progress.completedLevels.push(level);
        }
        progress.currentLevel = Math.min(level + 1, 10);
        progress.highestUnlockedLevel = Math.max(progress.highestUnlockedLevel, level + 1);
        this.saveProgress(progress);
        return progress;
    },

    resetProgress() {
        const defaultProgress = {
            completedLevels: [],
            currentLevel: 1,
            highestUnlockedLevel: 1
        };
        this.saveProgress(defaultProgress);
        return defaultProgress;
    },

    isLevelUnlocked(level) {
        const progress = this.getProgress();
        return level <= progress.highestUnlockedLevel;
    },

    isLevelCompleted(level) {
        const progress = this.getProgress();
        return progress.completedLevels.includes(level);
    }
};

// Career level configurations
const CAREER_LEVELS = [
    { level: 1, opponents: 1, difficulty: 'belowEasy', description: '1 vs 1 Bot (Below Easy)' },
    { level: 2, opponents: 1, difficulty: 'easy', description: '1 vs 1 Bot (Easy)' },
    { level: 3, opponents: 1, difficulty: 'mediumEasy', description: '1 vs 1 Bot (Medium Easy)' },
    { level: 4, opponents: 2, difficulty: 'easy', description: '1 vs 2 Bots (Easy)' },
    { level: 5, opponents: 2, difficulty: 'medium', description: '1 vs 2 Bots (Medium)' },
    { level: 6, opponents: 2, difficulty: 'hard', description: '1 vs 2 Bots (Hard)' },
    { level: 7, opponents: 3, difficulty: 'easy', description: '1 vs 3 Bots (Easy)' },
    { level: 8, opponents: 3, difficulty: 'medium', description: '1 vs 3 Bots (Medium)' },
    { level: 9, opponents: 3, difficulty: 'hard', description: '1 vs 3 Bots (Hard)' },
    { level: 10, opponents: 4, difficulty: 'hard', description: 'BOSS: 1 vs 4 Bots (All Hard)' }
];

// Extended AI configs for career mode
const CAREER_AI_CONFIG = {
    belowEasy: {
        reactionTime: 700,
        accuracy: 0.35,
        speed: 0.5,
        jumpChance: 0.15,
        kickRange: 70
    },
    mediumEasy: {
        reactionTime: 400,
        accuracy: 0.6,
        speed: 0.7,
        jumpChance: 0.3,
        kickRange: 85
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
        this.add.text(600, 100, 'HEAD FOOTBALL', {
            fontSize: '64px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        // Subtitle - NOW WITH CAREER MODE!
        this.add.text(600, 160, '⚡ CAREER MODE & 2v2 AVAILABLE! ⚡', {
            fontSize: '24px',
            fontFamily: 'Arial Black',
            color: '#ffff00',
            stroke: '#ff0000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Create main menu buttons
        this.createButton(600, 250, 350, 70, 0x9C27B0, 'CAREER MODE', () => {
            console.log('Opening Career Mode');
            this.scene.start('CareerMenuScene');
        });

        this.createButton(600, 340, 350, 70, 0x4CAF50, '1v1 MODE', () => {
            console.log('Opening 1v1 mode selection');
            this.scene.start('Mode1v1Scene');
        });

        this.createButton(600, 430, 350, 70, 0xFF6B00, '2v2 MODE', () => {
            console.log('Opening 2v2 mode selection');
            this.scene.start('Mode2v2Scene');
        });

        // Controls info
        this.add.text(600, 460, '1v1 Controls:', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.add.text(600, 490, 'P1: WASD + Space | P2: Arrows + Shift', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.add.text(600, 520, '2v2 Controls:', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.add.text(600, 550, 'P3: TFGH + R | P4: IJKL + U', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.add.text(600, 590, 'ESC: Pause Game', {
            fontSize: '18px',
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

// ==================== 1v1 MODE SCENE ====================
class Mode1v1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Mode1v1Scene' });
    }

    create() {
        // Sky background
        this.add.rectangle(600, 325, 1200, 650, 0x87CEEB);

        // Title
        this.add.text(600, 120, '1v1 MODE', {
            fontSize: '48px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Mode buttons
        this.createButton(600, 280, 350, 70, 0x4CAF50, 'PLAYER vs PLAYER', () => {
            console.log('Starting PvP mode');
            this.scene.start('GameScene', { mode: 'pvp' });
        });

        this.createButton(600, 370, 350, 70, 0x2196F3, 'PLAYER vs BOT', () => {
            console.log('Opening difficulty selection');
            this.scene.start('DifficultyScene');
        });

        // Back button
        this.createButton(600, 480, 200, 50, 0x666666, 'BACK', () => {
            this.scene.start('MenuScene');
        });
    }

    createButton(x, y, width, height, color, text, callback) {
        const button = this.add.rectangle(x, y, width, height, color);
        button.setInteractive({ useHandCursor: true });

        const buttonText = this.add.text(x, y, text, {
            fontSize: '24px',
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

// ==================== 2v2 MODE SCENE ====================
class Mode2v2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Mode2v2Scene' });
    }

    create() {
        // Sky background
        this.add.rectangle(600, 325, 1200, 650, 0x87CEEB);

        // Title
        this.add.text(600, 100, '2v2 MODE', {
            fontSize: '48px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Team Info
        this.add.text(600, 160, 'Team 1: Red + Green | Team 2: Blue + Yellow', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Mode buttons
        this.createButton(600, 250, 350, 60, 0x4CAF50, '4 PLAYERS', () => {
            console.log('Starting 2v2 with 4 human players');
            this.scene.start('GameScene', { mode: '2v2', subMode: '4players' });
        });

        this.createButton(600, 330, 350, 60, 0x2196F3, '2v2 WITH BOTS', () => {
            console.log('Opening bot difficulty for 2v2');
            this.scene.start('Difficulty2v2Scene');
        });

        this.createButton(600, 410, 350, 60, 0xf44336, '1 vs 2 BOTS', () => {
            console.log('Opening hardcore mode difficulty');
            this.scene.start('DifficultyHardcoreScene');
        });

        // Back button
        this.createButton(600, 510, 200, 50, 0x666666, 'BACK', () => {
            this.scene.start('MenuScene');
        });
    }

    createButton(x, y, width, height, color, text, callback) {
        const button = this.add.rectangle(x, y, width, height, color);
        button.setInteractive({ useHandCursor: true });

        const buttonText = this.add.text(x, y, text, {
            fontSize: '24px',
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

// ==================== DIFFICULTY 2v2 SCENE ====================
class Difficulty2v2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Difficulty2v2Scene' });
    }

    create() {
        // Background
        this.add.rectangle(600, 325, 1200, 650, 0x87CEEB);

        // Title
        this.add.text(600, 120, '2v2 WITH BOTS', {
            fontSize: '48px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(600, 180, 'Select Bot Difficulty', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Difficulty buttons
        this.createButton(600, 280, 300, 60, 0x4CAF50, 'EASY', () => {
            console.log('Starting 2v2 with bots - Easy');
            this.scene.start('GameScene', { mode: '2v2', subMode: 'bots', difficulty: 'easy' });
        });

        this.createButton(600, 360, 300, 60, 0xFF9800, 'MEDIUM', () => {
            console.log('Starting 2v2 with bots - Medium');
            this.scene.start('GameScene', { mode: '2v2', subMode: 'bots', difficulty: 'medium' });
        });

        this.createButton(600, 440, 300, 60, 0xf44336, 'HARD', () => {
            console.log('Starting 2v2 with bots - Hard');
            this.scene.start('GameScene', { mode: '2v2', subMode: 'bots', difficulty: 'hard' });
        });

        // Back button
        this.createButton(600, 530, 200, 50, 0x666666, 'BACK', () => {
            this.scene.start('Mode2v2Scene');
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

// ==================== DIFFICULTY HARDCORE SCENE ====================
class DifficultyHardcoreScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DifficultyHardcoreScene' });
    }

    create() {
        // Background
        this.add.rectangle(600, 325, 1200, 650, 0x87CEEB);

        // Title
        this.add.text(600, 120, '1 vs 2 BOTS', {
            fontSize: '48px',
            fontFamily: 'Arial Black',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(600, 180, 'HARDCORE MODE - Select Difficulty', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Difficulty buttons
        this.createButton(600, 280, 300, 60, 0x4CAF50, 'EASY', () => {
            console.log('Starting 1v2 hardcore - Easy');
            this.scene.start('GameScene', { mode: '2v2', subMode: 'hardcore', difficulty: 'easy' });
        });

        this.createButton(600, 360, 300, 60, 0xFF9800, 'MEDIUM', () => {
            console.log('Starting 1v2 hardcore - Medium');
            this.scene.start('GameScene', { mode: '2v2', subMode: 'hardcore', difficulty: 'medium' });
        });

        this.createButton(600, 440, 300, 60, 0xf44336, 'HARD', () => {
            console.log('Starting 1v2 hardcore - Hard');
            this.scene.start('GameScene', { mode: '2v2', subMode: 'hardcore', difficulty: 'hard' });
        });

        // Back button
        this.createButton(600, 530, 200, 50, 0x666666, 'BACK', () => {
            this.scene.start('Mode2v2Scene');
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

// ==================== CAREER MENU SCENE ====================
class CareerMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CareerMenuScene' });
    }

    create() {
        // Background
        this.add.rectangle(600, 325, 1200, 650, 0x87CEEB);

        // Get career progress
        const progress = CareerManager.getProgress();

        // Title
        this.add.text(600, 50, 'CAREER MODE', {
            fontSize: '48px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Progress indicator
        const completedCount = progress.completedLevels.length;
        this.add.text(600, 100, `Progress: ${completedCount}/10 Levels Completed`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: completedCount === 10 ? '#00ff00' : '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Create level buttons in a grid
        let buttonIndex = 0;
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 5; col++) {
                buttonIndex++;
                const levelNum = buttonIndex;
                const levelConfig = CAREER_LEVELS[levelNum - 1];

                const x = 300 + col * 150;
                const y = 200 + row * 120;

                const isUnlocked = CareerManager.isLevelUnlocked(levelNum);
                const isCompleted = CareerManager.isLevelCompleted(levelNum);

                // Level button color
                let buttonColor;
                if (isCompleted) {
                    buttonColor = 0x4CAF50; // Green for completed
                } else if (isUnlocked) {
                    buttonColor = levelNum === 10 ? 0xFF0000 : 0x2196F3; // Red for boss, blue for unlocked
                } else {
                    buttonColor = 0x666666; // Gray for locked
                }

                const button = this.add.rectangle(x, y, 120, 80, buttonColor);

                // Level number
                this.add.text(x, y - 10, `LEVEL ${levelNum}`, {
                    fontSize: '18px',
                    fontFamily: 'Arial Black',
                    color: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 2
                }).setOrigin(0.5);

                // Level description (smaller text)
                const description = levelConfig.description.split('(')[1].replace(')', '');
                this.add.text(x, y + 15, description, {
                    fontSize: '11px',
                    fontFamily: 'Arial',
                    color: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 1
                }).setOrigin(0.5);

                // Status icon
                if (isCompleted) {
                    this.add.text(x, y - 30, '✓', {
                        fontSize: '24px',
                        fontFamily: 'Arial',
                        color: '#00ff00'
                    }).setOrigin(0.5);
                } else if (!isUnlocked) {
                    this.add.text(x, y - 30, '🔒', {
                        fontSize: '20px',
                        fontFamily: 'Arial'
                    }).setOrigin(0.5);
                }

                // Make button interactive only if unlocked
                if (isUnlocked) {
                    button.setInteractive({ useHandCursor: true });

                    button.on('pointerover', () => {
                        button.setFillStyle(Phaser.Display.Color.GetColor32(
                            Math.min(255, ((buttonColor >> 16) & 0xFF) + 30),
                            Math.min(255, ((buttonColor >> 8) & 0xFF) + 30),
                            Math.min(255, (buttonColor & 0xFF) + 30),
                            255
                        ));
                    });

                    button.on('pointerout', () => {
                        button.setFillStyle(buttonColor);
                    });

                    button.on('pointerdown', () => {
                        console.log(`Starting career level ${levelNum}`);
                        this.startCareerLevel(levelNum);
                    });
                }
            }
        }

        // Reset Progress button
        this.createButton(300, 520, 200, 50, 0xf44336, 'RESET PROGRESS', () => {
            if (confirm('Are you sure you want to reset all career progress?')) {
                CareerManager.resetProgress();
                this.scene.restart();
            }
        });

        // Back button
        this.createButton(900, 520, 200, 50, 0x666666, 'BACK', () => {
            this.scene.start('MenuScene');
        });

        // Legend
        this.add.text(600, 420, 'Legend:', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.add.text(600, 445, '🔒 Locked  |  Blue: Available  |  Green: Completed  |  Red: Boss Level', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);
    }

    startCareerLevel(levelNum) {
        const levelConfig = CAREER_LEVELS[levelNum - 1];

        // Determine difficulty based on level config
        let difficulty = levelConfig.difficulty;

        // Map custom difficulties to standard ones if needed
        if (difficulty === 'belowEasy') {
            difficulty = 'easy';
        } else if (difficulty === 'mediumEasy') {
            difficulty = 'medium';
        }

        // Start the game with career mode parameters
        this.scene.start('GameScene', {
            mode: 'career',
            careerLevel: levelNum,
            botCount: levelConfig.opponents,
            difficulty: difficulty,
            customAIConfig: CAREER_AI_CONFIG[levelConfig.difficulty] || AI_CONFIG[difficulty]
        });
    }

    createButton(x, y, width, height, color, text, callback) {
        const button = this.add.rectangle(x, y, width, height, color);
        button.setInteractive({ useHandCursor: true });

        const buttonText = this.add.text(x, y, text, {
            fontSize: '20px',
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

// ==================== VICTORY SCENE (Career Mode) ====================
class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    init(data) {
        this.careerLevel = data.careerLevel;
        this.playerScore = data.playerScore;
        this.botScore = data.botScore;
        this.victory = data.victory;
    }

    create() {
        // Background
        this.add.rectangle(600, 325, 1200, 650, this.victory ? 0x4CAF50 : 0xf44336);

        // Result title
        const resultText = this.victory ? 'VICTORY!' : 'DEFEAT';
        const resultColor = this.victory ? '#00ff00' : '#ff0000';

        this.add.text(600, 150, resultText, {
            fontSize: '72px',
            fontFamily: 'Arial Black',
            color: resultColor,
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        // Level info
        this.add.text(600, 230, `Level ${this.careerLevel}`, {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Score
        this.add.text(600, 280, `Final Score: ${this.playerScore} - ${this.botScore}`, {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        if (this.victory) {
            // Update progress
            const progress = CareerManager.completeLevel(this.careerLevel);

            // Show progress
            this.add.text(600, 340, `Career Progress: ${progress.completedLevels.length}/10`, {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5);

            if (this.careerLevel === 10) {
                // Beat the final boss!
                this.add.text(600, 390, '🏆 CONGRATULATIONS! YOU COMPLETED THE CAREER MODE! 🏆', {
                    fontSize: '24px',
                    fontFamily: 'Arial Black',
                    color: '#ffff00',
                    stroke: '#ff0000',
                    strokeThickness: 4
                }).setOrigin(0.5);

                this.createButton(600, 460, 250, 60, 0x2196F3, 'BACK TO MENU', () => {
                    this.scene.start('CareerMenuScene');
                });
            } else if (this.careerLevel < 10) {
                // Next level button
                this.createButton(400, 440, 200, 60, 0x4CAF50, 'NEXT LEVEL', () => {
                    const nextLevel = this.careerLevel + 1;
                    const levelConfig = CAREER_LEVELS[nextLevel - 1];
                    let difficulty = levelConfig.difficulty;

                    if (difficulty === 'belowEasy') {
                        difficulty = 'easy';
                    } else if (difficulty === 'mediumEasy') {
                        difficulty = 'medium';
                    }

                    this.scene.start('GameScene', {
                        mode: 'career',
                        careerLevel: nextLevel,
                        botCount: levelConfig.opponents,
                        difficulty: difficulty,
                        customAIConfig: CAREER_AI_CONFIG[levelConfig.difficulty] || AI_CONFIG[difficulty]
                    });
                });

                this.createButton(800, 440, 200, 60, 0x2196F3, 'LEVEL SELECT', () => {
                    this.scene.start('CareerMenuScene');
                });
            }
        } else {
            // Defeat - retry options
            this.createButton(400, 440, 200, 60, 0xFF9800, 'RETRY', () => {
                const levelConfig = CAREER_LEVELS[this.careerLevel - 1];
                let difficulty = levelConfig.difficulty;

                if (difficulty === 'belowEasy') {
                    difficulty = 'easy';
                } else if (difficulty === 'mediumEasy') {
                    difficulty = 'medium';
                }

                this.scene.start('GameScene', {
                    mode: 'career',
                    careerLevel: this.careerLevel,
                    botCount: levelConfig.opponents,
                    difficulty: difficulty,
                    customAIConfig: CAREER_AI_CONFIG[levelConfig.difficulty] || AI_CONFIG[difficulty]
                });
            });

            this.createButton(800, 440, 200, 60, 0x666666, 'LEVEL SELECT', () => {
                this.scene.start('CareerMenuScene');
            });
        }
    }

    createButton(x, y, width, height, color, text, callback) {
        const button = this.add.rectangle(x, y, width, height, color);
        button.setInteractive({ useHandCursor: true });

        const buttonText = this.add.text(x, y, text, {
            fontSize: '24px',
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
        this.subMode = data.subMode || '';  // 4players, bots, hardcore
        this.difficulty = data.difficulty || 'medium';

        // Career mode specific data
        this.careerLevel = data.careerLevel || null;
        this.botCount = data.botCount || 1;  // Number of bots for career mode

        // Use custom AI config if provided (for career mode special difficulties)
        this.aiConfig = data.customAIConfig || AI_CONFIG[this.difficulty];

        this.aiTimer = 0;
        // Initialize kick animation states for all players
        this.player1Kicking = false;
        this.player2Kicking = false;
        this.player3Kicking = false;
        this.player4Kicking = false;
        this.player5Kicking = false;  // For career mode boss level
        // AI timers for bots
        this.aiTimers = {
            player2: 0,
            player3: 0,
            player4: 0,
            player5: 0  // For career mode 1v4
        };
        console.log(`Game initialized: mode=${this.gameMode}, subMode=${this.subMode}, difficulty=${this.difficulty}, careerLevel=${this.careerLevel}, botCount=${this.botCount}`);
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
        this.score1 = 0;  // Team 1 score for 2v2
        this.score2 = 0;  // Team 2 score for 2v2
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
        // Create player 1 texture (RED - Team 1)
        if (!this.textures.exists('player1')) {
            const graphics = this.make.graphics({ x: 0, y: 0 }, false);
            graphics.fillStyle(0xff0000, 1);
            graphics.fillCircle(20, 20, 20);
            graphics.lineStyle(4, 0xff0000);
            graphics.strokeCircle(20, 20, 20);
            graphics.generateTexture('player1', 40, 40);
            graphics.destroy();
        }

        // Create player 2 texture (BLUE - Team 2)
        if (!this.textures.exists('player2')) {
            const graphics = this.make.graphics({ x: 0, y: 0 }, false);
            graphics.fillStyle(0x0000ff, 1);
            graphics.fillCircle(20, 20, 20);
            graphics.lineStyle(4, 0x0000ff);
            graphics.strokeCircle(20, 20, 20);
            graphics.generateTexture('player2', 40, 40);
            graphics.destroy();
        }

        // Create player 3 texture (GREEN - Team 1)
        if (!this.textures.exists('player3')) {
            const graphics = this.make.graphics({ x: 0, y: 0 }, false);
            graphics.fillStyle(0x00ff00, 1);
            graphics.fillCircle(20, 20, 20);
            graphics.lineStyle(4, 0x00ff00);
            graphics.strokeCircle(20, 20, 20);
            graphics.generateTexture('player3', 40, 40);
            graphics.destroy();
        }

        // Create player 4 texture (YELLOW - Team 2)
        if (!this.textures.exists('player4')) {
            const graphics = this.make.graphics({ x: 0, y: 0 }, false);
            graphics.fillStyle(0xffff00, 1);
            graphics.fillCircle(20, 20, 20);
            graphics.lineStyle(4, 0xffff00);
            graphics.strokeCircle(20, 20, 20);
            graphics.generateTexture('player4', 40, 40);
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

        // Create goalposts with physics
        this.createGoalposts();

        // Goal sensors (for scoring) - positioned inside the goal frame
        this.leftGoal = this.add.rectangle(40, GOAL_Y, GOAL_WIDTH - 30, GOAL_HEIGHT - 20, 0x00ff00, 0);
        this.physics.add.existing(this.leftGoal, true);

        this.rightGoal = this.add.rectangle(1160, GOAL_Y, GOAL_WIDTH - 30, GOAL_HEIGHT - 20, 0x00ff00, 0);
        this.physics.add.existing(this.rightGoal, true);
    }

    createGoalposts() {
        const postWidth = 8;
        const postColor = 0xffffff;

        // Left goal posts
        const leftGoalX = 40;
        const leftPostY = GOAL_Y;
        const topY = leftPostY - GOAL_HEIGHT / 2;
        const bottomY = GROUND_Y;

        // Left goal - left post (VISUAL ONLY - no hitbox)
        this.add.rectangle(leftGoalX - GOAL_WIDTH/2, (topY + bottomY)/2, postWidth, bottomY - topY, postColor);

        // Left goal - right post (VISUAL ONLY - no hitbox)
        this.add.rectangle(leftGoalX + GOAL_WIDTH/2, (topY + bottomY)/2, postWidth, bottomY - topY, postColor);

        // Left goal - crossbar (WITH HITBOX)
        this.leftGoalCrossbar = this.physics.add.staticGroup();
        const leftCrossbar = this.leftGoalCrossbar.create(leftGoalX, topY, null);
        leftCrossbar.setSize(GOAL_WIDTH + postWidth, postWidth);
        leftCrossbar.refreshBody();
        this.add.rectangle(leftGoalX, topY, GOAL_WIDTH + postWidth, postWidth, postColor);

        // Right goal posts
        const rightGoalX = 1160;

        // Right goal - left post (VISUAL ONLY - no hitbox)
        this.add.rectangle(rightGoalX - GOAL_WIDTH/2, (topY + bottomY)/2, postWidth, bottomY - topY, postColor);

        // Right goal - right post (VISUAL ONLY - no hitbox)
        this.add.rectangle(rightGoalX + GOAL_WIDTH/2, (topY + bottomY)/2, postWidth, bottomY - topY, postColor);

        // Right goal - crossbar (WITH HITBOX)
        this.rightGoalCrossbar = this.physics.add.staticGroup();
        const rightCrossbar = this.rightGoalCrossbar.create(rightGoalX, topY, null);
        rightCrossbar.setSize(GOAL_WIDTH + postWidth, postWidth);
        rightCrossbar.refreshBody();
        this.add.rectangle(rightGoalX, topY, GOAL_WIDTH + postWidth, postWidth, postColor);

        // Visual goal area (behind posts)
        this.add.rectangle(leftGoalX, leftPostY, GOAL_WIDTH, GOAL_HEIGHT, 0xffffff, 0.1);
        this.add.rectangle(rightGoalX, leftPostY, GOAL_WIDTH, GOAL_HEIGHT, 0xffffff, 0.1);
    }

    createPlayers() {
        if (this.gameMode === 'career') {
            // CAREER MODE - Variable number of bots
            // Player 1 is always the human player on the left
            this.player1 = this.physics.add.sprite(200, 450, 'player1');
            this.player1.setBounce(0.2);
            this.player1.setCollideWorldBounds(true);
            this.player1.setScale(1.5);

            // Player 1 leg (for kicking animation)
            this.player1Leg = this.add.rectangle(200, 470, 4, 25, 0xff0000);
            this.player1Leg.setOrigin(0.5, 0);
            this.player1LegFoot = this.physics.add.sprite(200, 495, null);
            this.player1LegFoot.setSize(10, 10);
            this.player1LegFoot.body.allowGravity = false;
            this.player1LegFoot.setVisible(false);

            // Add name labels
            this.add.text(200, 400, 'YOU', {
                fontSize: '16px',
                fontFamily: 'Arial Black',
                color: '#ff0000'
            }).setOrigin(0.5);

            // Create bots based on botCount
            this.bots = [];  // Array to store all bots for easier management

            if (this.botCount >= 1) {
                // Bot 1 (Blue - main opponent)
                this.player2 = this.physics.add.sprite(1000, 450, 'player2');
                this.player2.setBounce(0.2);
                this.player2.setCollideWorldBounds(true);
                this.player2.setScale(1.5);
                this.player2.isBot = true;
                this.bots.push(this.player2);

                this.player2Leg = this.add.rectangle(1000, 470, 4, 25, 0x0000ff);
                this.player2Leg.setOrigin(0.5, 0);
                this.player2LegFoot = this.physics.add.sprite(1000, 495, null);
                this.player2LegFoot.setSize(10, 10);
                this.player2LegFoot.body.allowGravity = false;
                this.player2LegFoot.setVisible(false);

                this.add.text(1000, 400, 'BOT 1', {
                    fontSize: '16px',
                    fontFamily: 'Arial',
                    color: '#0000ff'
                }).setOrigin(0.5);
            }

            if (this.botCount >= 2) {
                // Bot 2 (Green - secondary opponent)
                this.player3 = this.physics.add.sprite(850, 480, 'player3');
                this.player3.setBounce(0.2);
                this.player3.setCollideWorldBounds(true);
                this.player3.setScale(1.5);
                this.player3.isBot = true;
                this.bots.push(this.player3);

                this.player3Leg = this.add.rectangle(850, 500, 4, 25, 0x00ff00);
                this.player3Leg.setOrigin(0.5, 0);
                this.player3LegFoot = this.physics.add.sprite(850, 525, null);
                this.player3LegFoot.setSize(10, 10);
                this.player3LegFoot.body.allowGravity = false;
                this.player3LegFoot.setVisible(false);

                this.add.text(850, 440, 'BOT 2', {
                    fontSize: '16px',
                    fontFamily: 'Arial',
                    color: '#00ff00'
                }).setOrigin(0.5);
            }

            if (this.botCount >= 3) {
                // Bot 3 (Yellow - third opponent)
                this.player4 = this.physics.add.sprite(900, 420, 'player4');
                this.player4.setBounce(0.2);
                this.player4.setCollideWorldBounds(true);
                this.player4.setScale(1.5);
                this.player4.isBot = true;
                this.bots.push(this.player4);

                this.player4Leg = this.add.rectangle(900, 440, 4, 25, 0xffff00);
                this.player4Leg.setOrigin(0.5, 0);
                this.player4LegFoot = this.physics.add.sprite(900, 465, null);
                this.player4LegFoot.setSize(10, 10);
                this.player4LegFoot.body.allowGravity = false;
                this.player4LegFoot.setVisible(false);

                this.add.text(900, 380, 'BOT 3', {
                    fontSize: '16px',
                    fontFamily: 'Arial',
                    color: '#ffff00'
                }).setOrigin(0.5);
            }

            if (this.botCount >= 4) {
                // Bot 4 (Orange - fourth opponent for boss level)
                // Create orange texture if it doesn't exist
                if (!this.textures.exists('player5')) {
                    const graphics = this.make.graphics({ x: 0, y: 0 }, false);
                    graphics.fillStyle(0xff8800, 1);
                    graphics.fillCircle(20, 20, 20);
                    graphics.lineStyle(4, 0xff8800);
                    graphics.strokeCircle(20, 20, 20);
                    graphics.generateTexture('player5', 40, 40);
                    graphics.destroy();
                }

                this.player5 = this.physics.add.sprite(950, 500, 'player5');
                this.player5.setBounce(0.2);
                this.player5.setCollideWorldBounds(true);
                this.player5.setScale(1.5);
                this.player5.isBot = true;
                this.bots.push(this.player5);

                this.player5Leg = this.add.rectangle(950, 520, 4, 25, 0xff8800);
                this.player5Leg.setOrigin(0.5, 0);
                this.player5LegFoot = this.physics.add.sprite(950, 545, null);
                this.player5LegFoot.setSize(10, 10);
                this.player5LegFoot.body.allowGravity = false;
                this.player5LegFoot.setVisible(false);

                this.add.text(950, 460, 'BOSS', {
                    fontSize: '16px',
                    fontFamily: 'Arial Black',
                    color: '#ff8800'
                }).setOrigin(0.5);
            }

            // Add career level indicator
            this.add.text(600, 30, `CAREER - LEVEL ${this.careerLevel}`, {
                fontSize: '24px',
                fontFamily: 'Arial Black',
                color: '#ffff00',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5);

        } else if (this.gameMode === '2v2') {
            // 2v2 MODE - Create 4 players
            // Team 1 (Left side)
            // Player 1 (Red)
            this.player1 = this.physics.add.sprite(150, 420, 'player1');
            this.player1.setBounce(0.2);
            this.player1.setCollideWorldBounds(true);
            this.player1.setScale(1.5);
            this.player1.team = 1;
            this.player1.role = 'attacker';  // For bot AI

            // Player 1 leg
            this.player1Leg = this.add.rectangle(150, 440, 4, 25, 0xff0000);
            this.player1Leg.setOrigin(0.5, 0);
            this.player1LegFoot = this.physics.add.sprite(150, 465, null);
            this.player1LegFoot.setSize(10, 10);
            this.player1LegFoot.body.allowGravity = false;
            this.player1LegFoot.setVisible(false);

            // Player 3 (Green)
            this.player3 = this.physics.add.sprite(250, 480, 'player3');
            this.player3.setBounce(0.2);
            this.player3.setCollideWorldBounds(true);
            this.player3.setScale(1.5);
            this.player3.team = 1;
            this.player3.role = 'defender';  // For bot AI

            // Player 3 leg
            this.player3Leg = this.add.rectangle(250, 500, 4, 25, 0x00ff00);
            this.player3Leg.setOrigin(0.5, 0);
            this.player3LegFoot = this.physics.add.sprite(250, 525, null);
            this.player3LegFoot.setSize(10, 10);
            this.player3LegFoot.body.allowGravity = false;
            this.player3LegFoot.setVisible(false);

            // Team 2 (Right side)
            // Player 2 (Blue)
            this.player2 = this.physics.add.sprite(1050, 420, 'player2');
            this.player2.setBounce(0.2);
            this.player2.setCollideWorldBounds(true);
            this.player2.setScale(1.5);
            this.player2.team = 2;
            this.player2.role = 'attacker';  // For bot AI

            // Player 2 leg
            this.player2Leg = this.add.rectangle(1050, 440, 4, 25, 0x0000ff);
            this.player2Leg.setOrigin(0.5, 0);
            this.player2LegFoot = this.physics.add.sprite(1050, 465, null);
            this.player2LegFoot.setSize(10, 10);
            this.player2LegFoot.body.allowGravity = false;
            this.player2LegFoot.setVisible(false);

            // Player 4 (Yellow)
            this.player4 = this.physics.add.sprite(950, 480, 'player4');
            this.player4.setBounce(0.2);
            this.player4.setCollideWorldBounds(true);
            this.player4.setScale(1.5);
            this.player4.team = 2;
            this.player4.role = 'defender';  // For bot AI

            // Player 4 leg
            this.player4Leg = this.add.rectangle(950, 500, 4, 25, 0xffff00);
            this.player4Leg.setOrigin(0.5, 0);
            this.player4LegFoot = this.physics.add.sprite(950, 525, null);
            this.player4LegFoot.setSize(10, 10);
            this.player4LegFoot.body.allowGravity = false;
            this.player4LegFoot.setVisible(false);

            // Add labels for 2v2
            this.add.text(150, 380, 'P1', {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#ff0000'
            }).setOrigin(0.5);

            const p2Label = this.subMode === '4players' ? 'P2' : 'BOT';
            this.add.text(1050, 380, p2Label, {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#0000ff'
            }).setOrigin(0.5);

            const p3Label = (this.subMode === '4players' || this.subMode === 'hardcore') ? 'P3' : 'BOT';
            this.add.text(250, 440, p3Label, {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#00ff00'
            }).setOrigin(0.5);

            const p4Label = this.subMode === '4players' ? 'P4' : 'BOT';
            this.add.text(950, 440, p4Label, {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#ffff00'
            }).setOrigin(0.5);

        } else {
            // 1v1 MODE - Original setup
            // Player 1 (Red - left side)
            this.player1 = this.physics.add.sprite(200, 450, 'player1');
            this.player1.setBounce(0.2);
            this.player1.setCollideWorldBounds(true);
            this.player1.setScale(1.5);

            // Player 1 leg (for kicking animation)
            this.player1Leg = this.add.rectangle(200, 470, 4, 25, 0xff0000);
            this.player1Leg.setOrigin(0.5, 0);
            this.player1LegFoot = this.physics.add.sprite(200, 495, null);
            this.player1LegFoot.setSize(10, 10);
            this.player1LegFoot.body.allowGravity = false;
            this.player1LegFoot.setVisible(false);

            // Player 2 / Bot (Blue - right side)
            this.player2 = this.physics.add.sprite(1000, 450, 'player2');
            this.player2.setBounce(0.2);
            this.player2.setCollideWorldBounds(true);
            this.player2.setScale(1.5);

            // Player 2 leg (for kicking animation)
            this.player2Leg = this.add.rectangle(1000, 470, 4, 25, 0x0000ff);
            this.player2Leg.setOrigin(0.5, 0);
            this.player2LegFoot = this.physics.add.sprite(1000, 495, null);
            this.player2LegFoot.setSize(10, 10);
            this.player2LegFoot.body.allowGravity = false;
            this.player2LegFoot.setVisible(false);

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
    }

    createBall() {
        this.ball = this.physics.add.sprite(600, 300, 'ball');
        this.ball.setBounce(BALL_BOUNCE);
        this.ball.setCollideWorldBounds(true);
        this.ball.body.setCircle(15);
        this.ball.setMaxVelocity(800, 800);
    }

    createUI() {
        if (this.gameMode === '2v2') {
            // Team labels
            this.add.text(450, 30, 'TEAM 1', {
                fontSize: '20px',
                fontFamily: 'Arial Black',
                color: '#ffffff',
                stroke: '#ff0000',
                strokeThickness: 3
            }).setOrigin(1, 0.5);

            this.add.text(750, 30, 'TEAM 2', {
                fontSize: '20px',
                fontFamily: 'Arial Black',
                color: '#ffffff',
                stroke: '#0000ff',
                strokeThickness: 3
            }).setOrigin(0, 0.5);
        }

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
        let modeText = '';
        if (this.gameMode === '2v2') {
            if (this.subMode === '4players') {
                modeText = '2v2 - 4 Players';
            } else if (this.subMode === 'bots') {
                modeText = `2v2 with Bots (${this.difficulty.toUpperCase()})`;
            } else if (this.subMode === 'hardcore') {
                modeText = `1 vs 2 Bots (${this.difficulty.toUpperCase()})`;
            }
        } else {
            modeText = this.gameMode === 'bot' ? `vs BOT (${this.difficulty.toUpperCase()})` : 'Player vs Player';
        }

        this.add.text(600, 100, modeText, {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Controls reminder based on mode
        if (this.gameMode === '2v2') {
            // 2v2 controls
            this.add.text(10, 10, 'P1: WASD+Space', {
                fontSize: '12px',
                color: '#ff0000',
                stroke: '#000000',
                strokeThickness: 2
            });

            if (this.subMode === '4players') {
                this.add.text(10, 30, 'P3: TFGH+R', {
                    fontSize: '12px',
                    color: '#00ff00',
                    stroke: '#000000',
                    strokeThickness: 2
                });

                this.add.text(1190, 10, 'P2: Arrows+Shift', {
                    fontSize: '12px',
                    color: '#0000ff',
                    stroke: '#000000',
                    strokeThickness: 2
                }).setOrigin(1, 0);

                this.add.text(1190, 30, 'P4: IJKL+U', {
                    fontSize: '12px',
                    color: '#ffff00',
                    stroke: '#000000',
                    strokeThickness: 2
                }).setOrigin(1, 0);
            } else if (this.subMode === 'hardcore') {
                // Only P1 and P3 are human in hardcore mode
                this.add.text(10, 30, 'P3: TFGH+R', {
                    fontSize: '12px',
                    color: '#00ff00',
                    stroke: '#000000',
                    strokeThickness: 2
                });
            }
        } else {
            // 1v1 controls
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
        }

        this.add.text(600, 630, 'ESC: Pause', {
            fontSize: '14px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
    }

    setupControls() {
        // Player 1 controls (WASD + Space)
        this.keys1 = {
            left: this.input.keyboard.addKey('A'),
            right: this.input.keyboard.addKey('D'),
            up: this.input.keyboard.addKey('W'),
            kick: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        };

        // Player 2 controls (Arrow Keys + Shift)
        this.keys2 = {
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            kick: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
        };

        // Player 3 controls (TFGH + R) - for 2v2 mode
        if (this.gameMode === '2v2') {
            this.keys3 = {
                left: this.input.keyboard.addKey('F'),
                right: this.input.keyboard.addKey('H'),
                up: this.input.keyboard.addKey('T'),
                kick: this.input.keyboard.addKey('R')
            };

            // Player 4 controls (IJKL + U) - for 2v2 mode
            this.keys4 = {
                left: this.input.keyboard.addKey('J'),
                right: this.input.keyboard.addKey('L'),
                up: this.input.keyboard.addKey('I'),
                kick: this.input.keyboard.addKey('U')
            };
        }

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

        // Ball-goalpost collisions (only crossbars have hitbox)
        this.physics.add.collider(this.ball, this.leftGoalCrossbar);
        this.physics.add.collider(this.ball, this.rightGoalCrossbar);

        // Player-ground collisions
        this.physics.add.collider(this.player1, this.ground);
        this.physics.add.collider(this.player2, this.ground);

        // Player-wall collisions
        this.physics.add.collider(this.player1, this.leftWall);
        this.physics.add.collider(this.player1, this.rightWall);
        this.physics.add.collider(this.player2, this.leftWall);
        this.physics.add.collider(this.player2, this.rightWall);

        // Player-player collisions
        this.physics.add.collider(this.player1, this.player2, () => {
            this.handlePlayerCollision(this.player1, this.player2);
        });

        // Ball-player collisions
        this.physics.add.collider(this.ball, this.player1, () => {
            this.handleBallHit(this.player1);
        });

        this.physics.add.collider(this.ball, this.player2, () => {
            this.handleBallHit(this.player2);
        });

        // Ball-leg foot collisions (for kick detection)
        this.physics.add.overlap(this.ball, this.player1LegFoot, () => {
            if (this.player1Kicking) {
                this.performKick(this.player1, true);
            }
        });

        this.physics.add.overlap(this.ball, this.player2LegFoot, () => {
            if (this.player2Kicking) {
                this.performKick(this.player2, true);
            }
        });

        // Career mode additional collisions
        if (this.gameMode === 'career') {
            // Add collisions for all bots
            if (this.player3) {
                this.physics.add.collider(this.player3, this.ground);
                this.physics.add.collider(this.player3, this.leftWall);
                this.physics.add.collider(this.player3, this.rightWall);
                this.physics.add.collider(this.player1, this.player3, () => {
                    this.handlePlayerCollision(this.player1, this.player3);
                });
                this.physics.add.collider(this.player2, this.player3, () => {
                    this.handlePlayerCollision(this.player2, this.player3);
                });
                this.physics.add.collider(this.ball, this.player3, () => {
                    this.handleBallHit(this.player3);
                });
                this.physics.add.overlap(this.ball, this.player3LegFoot, () => {
                    if (this.player3Kicking) {
                        this.performKick(this.player3, true);
                    }
                });
            }

            if (this.player4) {
                this.physics.add.collider(this.player4, this.ground);
                this.physics.add.collider(this.player4, this.leftWall);
                this.physics.add.collider(this.player4, this.rightWall);
                this.physics.add.collider(this.player1, this.player4, () => {
                    this.handlePlayerCollision(this.player1, this.player4);
                });
                this.physics.add.collider(this.player2, this.player4, () => {
                    this.handlePlayerCollision(this.player2, this.player4);
                });
                if (this.player3) {
                    this.physics.add.collider(this.player3, this.player4, () => {
                        this.handlePlayerCollision(this.player3, this.player4);
                    });
                }
                this.physics.add.collider(this.ball, this.player4, () => {
                    this.handleBallHit(this.player4);
                });
                this.physics.add.overlap(this.ball, this.player4LegFoot, () => {
                    if (this.player4Kicking) {
                        this.performKick(this.player4, true);
                    }
                });
            }

            if (this.player5) {
                this.physics.add.collider(this.player5, this.ground);
                this.physics.add.collider(this.player5, this.leftWall);
                this.physics.add.collider(this.player5, this.rightWall);
                this.physics.add.collider(this.player1, this.player5, () => {
                    this.handlePlayerCollision(this.player1, this.player5);
                });
                this.physics.add.collider(this.player2, this.player5, () => {
                    this.handlePlayerCollision(this.player2, this.player5);
                });
                if (this.player3) {
                    this.physics.add.collider(this.player3, this.player5, () => {
                        this.handlePlayerCollision(this.player3, this.player5);
                    });
                }
                if (this.player4) {
                    this.physics.add.collider(this.player4, this.player5, () => {
                        this.handlePlayerCollision(this.player4, this.player5);
                    });
                }
                this.physics.add.collider(this.ball, this.player5, () => {
                    this.handleBallHit(this.player5);
                });
                this.physics.add.overlap(this.ball, this.player5LegFoot, () => {
                    if (this.player5Kicking) {
                        this.performKick(this.player5, true);
                    }
                });
            }
        }
        // 2v2 mode additional collisions
        else if (this.gameMode === '2v2') {
            // Player 3 collisions
            this.physics.add.collider(this.player3, this.ground);
            this.physics.add.collider(this.player3, this.leftWall);
            this.physics.add.collider(this.player3, this.rightWall);

            // Player 4 collisions
            this.physics.add.collider(this.player4, this.ground);
            this.physics.add.collider(this.player4, this.leftWall);
            this.physics.add.collider(this.player4, this.rightWall);

            // Inter-player collisions for 2v2
            this.physics.add.collider(this.player1, this.player3, () => {
                this.handlePlayerCollision(this.player1, this.player3);
            });
            this.physics.add.collider(this.player1, this.player4, () => {
                this.handlePlayerCollision(this.player1, this.player4);
            });
            this.physics.add.collider(this.player2, this.player3, () => {
                this.handlePlayerCollision(this.player2, this.player3);
            });
            this.physics.add.collider(this.player2, this.player4, () => {
                this.handlePlayerCollision(this.player2, this.player4);
            });
            this.physics.add.collider(this.player3, this.player4, () => {
                this.handlePlayerCollision(this.player3, this.player4);
            });

            // Ball-player collisions for players 3 and 4
            this.physics.add.collider(this.ball, this.player3, () => {
                this.handleBallHit(this.player3);
            });

            this.physics.add.collider(this.ball, this.player4, () => {
                this.handleBallHit(this.player4);
            });

            // Ball-leg foot collisions for players 3 and 4
            this.physics.add.overlap(this.ball, this.player3LegFoot, () => {
                if (this.player3Kicking) {
                    this.performKick(this.player3, true);
                }
            });

            this.physics.add.overlap(this.ball, this.player4LegFoot, () => {
                if (this.player4Kicking) {
                    this.performKick(this.player4, true);
                }
            });
        }

        // Goal detection - Team scoring for 2v2
        this.physics.add.overlap(this.ball, this.leftGoal, () => {
            if (!this.goalScored) {
                this.scoreGoal(2);  // Team 2 scores
            }
        });

        this.physics.add.overlap(this.ball, this.rightGoal, () => {
            if (!this.goalScored) {
                this.scoreGoal(1);  // Team 1 scores
            }
        });
    }

    handlePlayerCollision(player1, player2) {
        // When players collide with ball between them, bounce ball away
        const ballDist1 = Phaser.Math.Distance.Between(player1.x, player1.y, this.ball.x, this.ball.y);
        const ballDist2 = Phaser.Math.Distance.Between(player2.x, player2.y, this.ball.x, this.ball.y);

        if (ballDist1 < 100 && ballDist2 < 100) {
            // Ball is between players - bounce it up
            this.ball.body.velocity.y = -400;
            this.ball.body.velocity.x = Phaser.Math.Between(-200, 200);
        }
    }

    handleBallHit(player) {
        // Improved ball physics on contact - always make ball bounce
        const angle = Phaser.Math.Angle.Between(player.x, player.y, this.ball.x, this.ball.y);
        const force = 300;  // Increased force for better bounce
        this.ball.body.velocity.x = Math.cos(angle) * force;
        this.ball.body.velocity.y = Math.sin(angle) * force;

        // Ensure ball bounces up if it's on the ground
        if (this.ball.body.velocity.y > -100 && this.ball.y > GROUND_Y - 50) {
            this.ball.body.velocity.y = -350;
        }
    }

    performKick(player, isLegKick = false) {
        // Calculate kick direction based on player position relative to ball
        const dx = this.ball.x - player.x;
        const dy = this.ball.y - player.y;
        const angle = Math.atan2(dy, dx);

        // Apply powerful kick force
        const kickPower = isLegKick ? LEG_KICK_POWER : KICK_POWER;

        // Apply horizontal and vertical velocity
        this.ball.body.setVelocity(
            Math.cos(angle) * kickPower,
            Math.sin(angle) * kickPower * 0.6  // Slightly less vertical power
        );

        // Always ensure ball bounces up when kicked from ground
        if (this.ball.y > GROUND_Y - 50) {
            this.ball.body.velocity.y = Math.min(this.ball.body.velocity.y, -HIGH_KICK_POWER);
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

        if (this.gameMode === '2v2') {
            // Reset 2v2 positions
            this.player1.setPosition(150, 420);
            this.player1.setVelocity(0, 0);

            this.player2.setPosition(1050, 420);
            this.player2.setVelocity(0, 0);

            this.player3.setPosition(250, 480);
            this.player3.setVelocity(0, 0);

            this.player4.setPosition(950, 480);
            this.player4.setVelocity(0, 0);
        } else {
            // Reset 1v1 positions
            this.player1.setPosition(200, 450);
            this.player1.setVelocity(0, 0);

            this.player2.setPosition(1000, 450);
            this.player2.setVelocity(0, 0);
        }
    }

    endMatch() {
        this.matchEnded = true;

        // Handle career mode differently
        if (this.gameMode === 'career') {
            // Determine if player won
            const victory = this.score1 > this.score2;

            // Transition to victory scene for career mode
            this.time.delayedCall(1000, () => {
                this.scene.start('VictoryScene', {
                    careerLevel: this.careerLevel,
                    playerScore: this.score1,
                    botScore: this.score2,
                    victory: victory
                });
            });
        } else {
            // Normal game over for other modes
            this.time.delayedCall(1000, () => {
                this.scene.start('GameOverScene', {
                    score1: this.score1,
                    score2: this.score2,
                    mode: this.gameMode
                });
            });
        }
    }

    updateBot(delta, player, playerNum) {
        // Generic bot update for any player
        if (this.matchEnded || this.goalScored) return;

        const timerKey = `player${playerNum}`;
        this.aiTimers[timerKey] += delta;
        if (this.aiTimers[timerKey] < this.aiConfig.reactionTime) return;
        this.aiTimers[timerKey] = 0;

        const bot = player;
        const ball = this.ball;
        const ai = this.aiConfig;
        const kickingKey = `player${playerNum}Kicking`;
        const legKey = `player${playerNum}Leg`;
        const legFootKey = `player${playerNum}LegFoot`;

        // Calculate distances
        const distToBall = Phaser.Math.Distance.Between(bot.x, bot.y, ball.x, ball.y);

        // Determine target position based on role
        let targetX = ball.x;
        let targetGoalX = bot.team === 1 ? 1160 : 40;  // Opponent's goal

        // Role-based AI behavior
        if (bot.role === 'defender') {
            // Defender stays back more
            const homeX = bot.team === 1 ? 250 : 950;
            const defenseThreshold = bot.team === 1 ? 400 : 800;

            if (bot.team === 1) {
                // Team 1 defender
                if (ball.x > defenseThreshold) {
                    targetX = Math.min(ball.x - 100, homeX + 150);
                } else {
                    targetX = homeX;
                }
            } else {
                // Team 2 defender
                if (ball.x < defenseThreshold) {
                    targetX = Math.max(ball.x + 100, homeX - 150);
                } else {
                    targetX = homeX;
                }
            }
        } else {
            // Attacker pushes forward more
            if (bot.team === 1) {
                // Team 1 attacker
                targetX = Math.min(ball.x + 50, 1000);
            } else {
                // Team 2 attacker
                targetX = Math.max(ball.x - 50, 200);
            }
        }

        // Avoid clustering with teammates
        const teammates = this.gameMode === '2v2' ?
            [this.player1, this.player2, this.player3, this.player4].filter(p => p !== bot && p.team === bot.team) : [];

        for (let teammate of teammates) {
            const teammateDist = Phaser.Math.Distance.Between(bot.x, bot.y, teammate.x, teammate.y);
            if (teammateDist < 80) {
                // Move away from teammate
                targetX += (bot.x < teammate.x) ? -40 : 40;
            }
        }

        // Move towards target
        const moveSpeed = PLAYER_SPEED * ai.speed * (bot.role === 'attacker' ? 1.1 : 0.9);

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
        const kickRange = ai.kickRange * (bot.role === 'attacker' ? 1.2 : 1);
        if (distToBall < kickRange && Math.random() < ai.accuracy) {
            // Trigger kick animation for bot
            if (!this[kickingKey]) {
                this[kickingKey] = true;

                const kickAngle = Phaser.Math.Angle.Between(bot.x, bot.y, targetGoalX, GOAL_Y);
                const legEndX = bot.x + Math.cos(kickAngle) * LEG_REACH;
                const legEndY = bot.y + 20 + Math.sin(kickAngle) * LEG_REACH;

                // Position leg foot at kick position
                this[legFootKey].x = legEndX;
                this[legFootKey].y = legEndY;

                // Animate bot leg
                this.tweens.add({
                    targets: this[legKey],
                    rotation: kickAngle,
                    duration: KICK_ANIMATION_TIME / 2,
                    ease: 'Power2',
                    yoyo: true,
                    onComplete: () => {
                        this[kickingKey] = false;
                    }
                });

                // Kick the ball
                this.performKick(bot, false);
            }
        }

        // Update bot leg position when not kicking
        if (!this[kickingKey]) {
            this[legKey].x = bot.x;
            this[legKey].y = bot.y + 20;
            this[legKey].rotation = 0;
            this[legFootKey].x = bot.x;
            this[legFootKey].y = bot.y + 45;
        }
    }

    update(time, delta) {
        if (this.matchEnded || this.goalScored) return;

        if (this.gameMode === 'career') {
            // CAREER MODE - Player 1 is human, others are bots
            this.handlePlayerControls(this.player1, this.keys1, 1);

            // Update all bots based on botCount
            if (this.player2) this.updateCareerBot(delta, this.player2, 2);
            if (this.player3) this.updateCareerBot(delta, this.player3, 3);
            if (this.player4) this.updateCareerBot(delta, this.player4, 4);
            if (this.player5) this.updateCareerBot(delta, this.player5, 5);
        } else if (this.gameMode === '2v2') {
            // 2v2 MODE
            // Player 1 is always human
            this.handlePlayerControls(this.player1, this.keys1, 1);

            if (this.subMode === '4players') {
                // All 4 players are human
                this.handlePlayerControls(this.player2, this.keys2, 2);
                this.handlePlayerControls(this.player3, this.keys3, 3);
                this.handlePlayerControls(this.player4, this.keys4, 4);
            } else if (this.subMode === 'bots') {
                // 2 humans vs 2 bots (P1+P3 vs Bot2+Bot4)
                this.handlePlayerControls(this.player3, this.keys3, 3);
                this.updateBot(delta, this.player2, 2);
                this.updateBot(delta, this.player4, 4);
            } else if (this.subMode === 'hardcore') {
                // 1 human + 1 human vs 2 bots (P1+P3 vs Bot2+Bot4)
                this.handlePlayerControls(this.player3, this.keys3, 3);
                this.updateBot(delta, this.player2, 2);
                this.updateBot(delta, this.player4, 4);
            }
        } else {
            // 1v1 MODE (original)
            // Player 1 controls (always human)
            this.handlePlayerControls(this.player1, this.keys1, 1);

            // Player 2: human or bot
            if (this.gameMode === 'pvp') {
                this.handlePlayerControls(this.player2, this.keys2, 2);
            } else if (this.gameMode === 'bot') {
                // For 1v1 bot mode, use simplified updateBot
                this.updateBotSimple(delta);
            }
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

    updateCareerBot(delta, bot, playerNum) {
        // Career mode bot AI - simpler than 2v2 team-based AI
        if (this.matchEnded || this.goalScored) return;

        const timerKey = `player${playerNum}`;
        this.aiTimers[timerKey] += delta;
        if (this.aiTimers[timerKey] < this.aiConfig.reactionTime) return;
        this.aiTimers[timerKey] = 0;

        const ball = this.ball;
        const ai = this.aiConfig;
        const kickingKey = `player${playerNum}Kicking`;
        const legKey = `player${playerNum}Leg`;
        const legFootKey = `player${playerNum}LegFoot`;

        // Calculate distances
        const distToBall = Phaser.Math.Distance.Between(bot.x, bot.y, ball.x, ball.y);
        const distToGoal = Math.abs(bot.x - 40);  // Distance to player's goal

        // Career mode bots are all against the player, so they defend the right goal
        let targetX = ball.x;

        // Coordinate with other bots for better coverage
        if (this.botCount > 1) {
            // Spread out bots when multiple are present
            const botIndex = playerNum - 2;  // 0, 1, 2, 3
            const spacing = 150;

            // When ball is on left side (player's side)
            if (ball.x < 600) {
                // Push forward but maintain formation
                targetX = Math.min(ball.x + botIndex * spacing, 1000 - botIndex * 50);
            } else {
                // Defensive positioning
                targetX = 900 - botIndex * spacing/2;
            }
        } else {
            // Single bot behavior (levels 1-3)
            if (ball.x < 600) {
                targetX = ball.x + 100;  // Chase ball
            } else {
                targetX = 900;  // Stay defensive
            }
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

        // Kick if ball is close
        if (distToBall < ai.kickRange && !this[kickingKey]) {
            this[kickingKey] = true;

            // Calculate kick angle towards player's goal
            const kickAngle = Math.atan2(GOAL_Y - bot.y, 40 - bot.x);

            // Calculate leg end position
            const legEndX = bot.x + Math.cos(kickAngle) * LEG_REACH;
            const legEndY = bot.y + Math.sin(kickAngle) * LEG_REACH;

            // Position leg foot at kick position
            this[legFootKey].x = legEndX;
            this[legFootKey].y = legEndY;

            // Animate leg
            this.tweens.add({
                targets: this[legKey],
                rotation: kickAngle,
                duration: KICK_ANIMATION_TIME / 2,
                ease: 'Power2',
                yoyo: true,
                onComplete: () => {
                    this[kickingKey] = false;
                }
            });

            // Check if ball is in kick range
            if (distToBall < 80) {
                this.performKick(bot, false);
            }
        } else {
            // Reset leg position when not kicking
            this[legKey].x = bot.x;
            this[legKey].y = bot.y + 20;
            this[legKey].rotation = 0;
            this[legFootKey].x = bot.x;
            this[legFootKey].y = bot.y + 45;
        }
    }

    updateBotSimple(delta) {
        // Simple bot for 1v1 mode (original behavior)
        if (this.matchEnded || this.goalScored) return;

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
            // Trigger kick animation for bot
            if (!this.player2Kicking) {
                this.player2Kicking = true;

                const kickAngle = Phaser.Math.Angle.Between(bot.x, bot.y, 40, GOAL_Y);
                const legEndX = bot.x + Math.cos(kickAngle) * LEG_REACH;
                const legEndY = bot.y + 20 + Math.sin(kickAngle) * LEG_REACH;

                // Position leg foot at kick position
                this.player2LegFoot.x = legEndX;
                this.player2LegFoot.y = legEndY;

                // Animate bot leg
                this.tweens.add({
                    targets: this.player2Leg,
                    rotation: kickAngle,
                    duration: KICK_ANIMATION_TIME / 2,
                    ease: 'Power2',
                    yoyo: true,
                    onComplete: () => {
                        this.player2Kicking = false;
                    }
                });

                // Kick the ball
                this.performKick(bot, false);
            }
        }

        // Update bot leg position when not kicking
        if (!this.player2Kicking) {
            this.player2Leg.x = bot.x;
            this.player2Leg.y = bot.y + 20;
            this.player2Leg.rotation = 0;
            this.player2LegFoot.x = bot.x;
            this.player2LegFoot.y = bot.y + 45;
        }
    }

    handlePlayerControls(player, keys, playerNum) {
        // Get the appropriate leg and foot for this player
        const leg = this[`player${playerNum}Leg`];
        const legFoot = this[`player${playerNum}LegFoot`];
        const kickingKey = `player${playerNum}Kicking`;

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

        // Update leg position to follow player
        if (!this[kickingKey]) {
            leg.x = player.x;
            leg.y = player.y + 20;
            leg.rotation = 0;
            legFoot.x = player.x;
            legFoot.y = player.y + 45;
        }

        // Kick with leg animation
        if (Phaser.Input.Keyboard.JustDown(keys.kick)) {
            const dx = this.ball.x - player.x;
            const dy = this.ball.y - player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Start kick animation
            if (!this[kickingKey]) {
                this[kickingKey] = true;

                // Animate leg forward
                const kickAngle = Math.atan2(dy, dx);
                const legEndX = player.x + Math.cos(kickAngle) * LEG_REACH;
                const legEndY = player.y + 20 + Math.sin(kickAngle) * LEG_REACH;

                // Position leg foot at kick position
                legFoot.x = legEndX;
                legFoot.y = legEndY;

                // Animate leg
                this.tweens.add({
                    targets: leg,
                    rotation: kickAngle,
                    duration: KICK_ANIMATION_TIME / 2,
                    ease: 'Power2',
                    yoyo: true,
                    onComplete: () => {
                        this[kickingKey] = false;
                    }
                });

                // Check if ball is in kick range
                if (distance < 80) {
                    this.performKick(player, false);
                }
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
    scene: [
        MenuScene,
        Mode1v1Scene,
        Mode2v2Scene,
        CareerMenuScene,
        VictoryScene,
        DifficultyScene,
        Difficulty2v2Scene,
        DifficultyHardcoreScene,
        GameScene,
        PauseScene,
        GameOverScene
    ]
};

// ==================== START GAME ====================
console.log('Starting Head Football game...');
const game = new Phaser.Game(config);