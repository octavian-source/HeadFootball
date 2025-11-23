const { test, expect } = require('@playwright/test');
const { _electron: electron } = require('playwright');

test.describe('Head Football Game Tests', () => {
    let electronApp;
    let window;

    test.beforeEach(async () => {
        // Launch Electron app
        electronApp = await electron.launch({
            args: ['main.js'],
            cwd: process.cwd()
        });

        // Get the first window
        window = await electronApp.firstWindow();

        // Wait for the app to load
        await window.waitForLoadState('domcontentloaded');
        await window.waitForTimeout(2000);
    });

    test.afterEach(async () => {
        if (electronApp) {
            await electronApp.close();
        }
    });

    test('should load the menu without errors', async () => {
        // Capture console messages and errors
        const messages = [];
        const errors = [];

        window.on('console', msg => {
            messages.push(`${msg.type()}: ${msg.text()}`);
            console.log(`CONSOLE ${msg.type()}: ${msg.text()}`);
        });

        window.on('pageerror', error => {
            errors.push(error.message);
            console.log(`PAGE ERROR: ${error.message}`);
        });

        // Wait for game to initialize
        await window.waitForTimeout(3000);

        // Take screenshot of menu
        await window.screenshot({ path: 'test-results/menu-screenshot.png' });

        // Check for errors
        console.log('=== CONSOLE MESSAGES ===');
        messages.forEach(msg => console.log(msg));
        console.log('=== ERRORS ===');
        errors.forEach(err => console.log(err));

        expect(errors.length).toBe(0);
    });

    test('should start game after selecting bot difficulty', async () => {
        const messages = [];
        const errors = [];

        window.on('console', msg => {
            messages.push(`${msg.type()}: ${msg.text()}`);
            console.log(`CONSOLE ${msg.type()}: ${msg.text()}`);
        });

        window.on('pageerror', error => {
            errors.push(error.message);
            console.log(`PAGE ERROR: ${error.message}`);
        });

        // Wait for menu to load
        await window.waitForTimeout(3000);
        console.log('Menu loaded, taking screenshot...');
        await window.screenshot({ path: 'test-results/1-menu.png' });

        // Click VS BOT button
        console.log('Clicking VS BOT button...');
        await window.evaluate(() => {
            const game = window.game;
            const scene = game.scene.scenes[0]; // MenuScene
            scene.scene.start('DifficultyScene');
        });

        await window.waitForTimeout(1000);
        await window.screenshot({ path: 'test-results/2-difficulty-select.png' });

        // Click Easy difficulty
        console.log('Selecting EASY difficulty...');
        await window.evaluate(() => {
            const game = window.game;
            const scene = game.scene.scenes[1]; // DifficultyScene
            scene.scene.start('GameScene', { mode: 'bot', difficulty: 'easy' });
        });

        // Wait to see if game starts or freezes
        console.log('Waiting for game to start...');
        await window.waitForTimeout(5000);
        await window.screenshot({ path: 'test-results/3-game-started.png' });

        // Check game state
        const gameState = await window.evaluate(() => {
            const game = window.game;
            const activeScenes = game.scene.scenes.filter(s => s.scene.isActive());
            return {
                activeScenes: activeScenes.map(s => s.scene.key),
                totalScenes: game.scene.scenes.length
            };
        });

        console.log('=== GAME STATE ===');
        console.log(JSON.stringify(gameState, null, 2));

        console.log('=== CONSOLE MESSAGES ===');
        messages.forEach(msg => console.log(msg));

        console.log('=== ERRORS ===');
        errors.forEach(err => console.log(err));

        expect(errors.length).toBe(0);
        expect(gameState.activeScenes).toContain('GameScene');
    });

    test('should debug create method step by step', async () => {
        const logs = [];

        window.on('console', msg => {
            logs.push(`${msg.type()}: ${msg.text()}`);
            console.log(`CONSOLE: ${msg.text()}`);
        });

        // Add debug logging to the game
        await window.evaluate(() => {
            // Override GameScene create to add logging
            const originalCreate = window.GameScene.prototype.create;
            window.GameScene.prototype.create = function() {
                console.log('[DEBUG] GameScene.create() started');

                try {
                    console.log('[DEBUG] Setting initial variables...');
                    this.score1 = 0;
                    this.score2 = 0;
                    this.goalScored = false;
                    this.matchTime = 90;
                    this.matchEnded = false;
                    console.log('[DEBUG] Variables set successfully');

                    console.log('[DEBUG] Creating field...');
                    this.createField();
                    console.log('[DEBUG] Field created');

                    console.log('[DEBUG] Creating players...');
                    this.createPlayers();
                    console.log('[DEBUG] Players created');

                    console.log('[DEBUG] Creating ball...');
                    this.createBall();
                    console.log('[DEBUG] Ball created');

                    console.log('[DEBUG] Creating UI...');
                    this.createUI();
                    console.log('[DEBUG] UI created');

                    console.log('[DEBUG] Setting up controls...');
                    this.setupControls();
                    console.log('[DEBUG] Controls set up');

                    console.log('[DEBUG] Setting up collisions...');
                    this.setupCollisions();
                    console.log('[DEBUG] Collisions set up');

                    console.log('[DEBUG] Starting match timer...');
                    this.startMatchTimer();
                    console.log('[DEBUG] Match timer started');

                    console.log('[DEBUG] GameScene.create() completed successfully');
                } catch (error) {
                    console.error('[DEBUG] Error in create():', error.message);
                    console.error('[DEBUG] Stack:', error.stack);
                }
            };
        });

        await window.waitForTimeout(2000);

        // Start the game
        await window.evaluate(() => {
            const game = window.game;
            game.scene.scenes[0].scene.start('DifficultyScene');
        });

        await window.waitForTimeout(1000);

        await window.evaluate(() => {
            const game = window.game;
            game.scene.scenes[1].scene.start('GameScene', { mode: 'bot', difficulty: 'easy' });
        });

        await window.waitForTimeout(5000);

        console.log('=== ALL LOGS ===');
        logs.forEach(log => console.log(log));
    });
});
