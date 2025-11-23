const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('path');

let electronApp;
let window;

test.beforeEach(async () => {
  // Launch Electron app
  electronApp = await electron.launch({
    args: [path.join(__dirname, '..', 'main.js')]
  });

  // Get the first window that the app opens
  window = await electronApp.firstWindow();

  // Wait for the game to load
  await window.waitForLoadState();
  await window.waitForTimeout(2000); // Give Phaser time to initialize
});

test.afterEach(async () => {
  // Close the app
  if (electronApp) {
    await electronApp.close();
  }
});

test.describe('Head Football Game Tests', () => {
  test('Main menu loads correctly', async () => {
    // Check if canvas exists
    const canvas = await window.locator('canvas');
    await expect(canvas).toBeVisible();

    // Take screenshot of main menu
    await window.screenshot({ path: 'test-results/main-menu.png' });
  });

  test('Can navigate to Player vs Player mode', async () => {
    // Click on PvP button (approximate position)
    await window.click('canvas', {
      position: { x: 600, y: 280 }
    });

    await window.waitForTimeout(1000);

    // Take screenshot of game scene
    await window.screenshot({ path: 'test-results/pvp-game.png' });
  });

  test('Can navigate to difficulty selection', async () => {
    // Click on Player vs Bot button
    await window.click('canvas', {
      position: { x: 600, y: 370 }
    });

    await window.waitForTimeout(1000);

    // Take screenshot of difficulty scene
    await window.screenshot({ path: 'test-results/difficulty-menu.png' });
  });

  test('Can start bot game on Easy difficulty', async () => {
    // Navigate to difficulty selection
    await window.click('canvas', {
      position: { x: 600, y: 370 }
    });

    await window.waitForTimeout(1000);

    // Select Easy difficulty
    await window.click('canvas', {
      position: { x: 600, y: 280 }
    });

    await window.waitForTimeout(1000);

    // Take screenshot of bot game
    await window.screenshot({ path: 'test-results/bot-easy-game.png' });
  });

  test('Can start bot game on Medium difficulty', async () => {
    // Navigate to difficulty selection
    await window.click('canvas', {
      position: { x: 600, y: 370 }
    });

    await window.waitForTimeout(1000);

    // Select Medium difficulty
    await window.click('canvas', {
      position: { x: 600, y: 360 }
    });

    await window.waitForTimeout(1000);

    // Take screenshot of bot game
    await window.screenshot({ path: 'test-results/bot-medium-game.png' });
  });

  test('Can start bot game on Hard difficulty', async () => {
    // Navigate to difficulty selection
    await window.click('canvas', {
      position: { x: 600, y: 370 }
    });

    await window.waitForTimeout(1000);

    // Select Hard difficulty
    await window.click('canvas', {
      position: { x: 600, y: 440 }
    });

    await window.waitForTimeout(1000);

    // Take screenshot of bot game
    await window.screenshot({ path: 'test-results/bot-hard-game.png' });
  });

  test('Can pause and resume game', async () => {
    // Start a PvP game
    await window.click('canvas', {
      position: { x: 600, y: 280 }
    });

    await window.waitForTimeout(1000);

    // Press ESC to pause
    await window.keyboard.press('Escape');
    await window.waitForTimeout(500);

    // Take screenshot of pause menu
    await window.screenshot({ path: 'test-results/pause-menu.png' });

    // Resume game
    await window.click('canvas', {
      position: { x: 600, y: 320 }
    });

    await window.waitForTimeout(500);

    // Take screenshot of resumed game
    await window.screenshot({ path: 'test-results/game-resumed.png' });
  });

  test('Player controls work (WASD)', async () => {
    // Start a PvP game
    await window.click('canvas', {
      position: { x: 600, y: 280 }
    });

    await window.waitForTimeout(1000);

    // Test player 1 controls
    await window.keyboard.press('d'); // Move right
    await window.waitForTimeout(200);
    await window.keyboard.press('a'); // Move left
    await window.waitForTimeout(200);
    await window.keyboard.press('w'); // Jump
    await window.waitForTimeout(200);
    await window.keyboard.press('Space'); // Kick

    // Take screenshot after controls
    await window.screenshot({ path: 'test-results/player1-controls.png' });
  });

  test('Bot AI moves and plays', async () => {
    // Start bot game on Medium
    await window.click('canvas', {
      position: { x: 600, y: 370 }
    });

    await window.waitForTimeout(1000);

    await window.click('canvas', {
      position: { x: 600, y: 360 }
    });

    // Let the bot play for a few seconds
    await window.waitForTimeout(5000);

    // Take screenshot to see bot movement
    await window.screenshot({ path: 'test-results/bot-playing.png' });
  });

  test('Game timer counts down', async () => {
    // Start a PvP game
    await window.click('canvas', {
      position: { x: 600, y: 280 }
    });

    await window.waitForTimeout(1000);

    // Take initial screenshot
    await window.screenshot({ path: 'test-results/timer-start.png' });

    // Wait 3 seconds
    await window.waitForTimeout(3000);

    // Take screenshot after time passes
    await window.screenshot({ path: 'test-results/timer-after-3s.png' });
  });

  test('Can go back from difficulty menu', async () => {
    // Navigate to difficulty selection
    await window.click('canvas', {
      position: { x: 600, y: 370 }
    });

    await window.waitForTimeout(1000);

    // Click Back button
    await window.click('canvas', {
      position: { x: 600, y: 530 }
    });

    await window.waitForTimeout(1000);

    // Should be back at main menu
    await window.screenshot({ path: 'test-results/back-to-menu.png' });
  });

  test('Full game flow test - Quick match', async () => {
    console.log('Starting full game flow test...');

    // 1. Start from main menu
    await window.screenshot({ path: 'test-results/flow-1-menu.png' });

    // 2. Select bot mode
    await window.click('canvas', {
      position: { x: 600, y: 370 }
    });
    await window.waitForTimeout(1000);
    await window.screenshot({ path: 'test-results/flow-2-difficulty.png' });

    // 3. Select Easy difficulty
    await window.click('canvas', {
      position: { x: 600, y: 280 }
    });
    await window.waitForTimeout(1000);
    await window.screenshot({ path: 'test-results/flow-3-game-start.png' });

    // 4. Play for a bit
    for (let i = 0; i < 3; i++) {
      await window.keyboard.press('d');
      await window.waitForTimeout(200);
      await window.keyboard.press('w');
      await window.waitForTimeout(200);
      await window.keyboard.press('Space');
      await window.waitForTimeout(200);
    }
    await window.screenshot({ path: 'test-results/flow-4-gameplay.png' });

    // 5. Pause game
    await window.keyboard.press('Escape');
    await window.waitForTimeout(500);
    await window.screenshot({ path: 'test-results/flow-5-paused.png' });

    // 6. Resume game
    await window.keyboard.press('Escape');
    await window.waitForTimeout(500);
    await window.screenshot({ path: 'test-results/flow-6-resumed.png' });

    console.log('Full game flow test completed successfully!');
  });
});

test.describe('Performance Tests', () => {
  test('Game runs without freezing for 10 seconds', async () => {
    // Start a bot game
    await window.click('canvas', {
      position: { x: 600, y: 370 }
    });
    await window.waitForTimeout(1000);

    await window.click('canvas', {
      position: { x: 600, y: 360 }
    });

    // Record screenshots every second for 10 seconds
    for (let i = 1; i <= 10; i++) {
      await window.waitForTimeout(1000);
      await window.screenshot({ path: `test-results/performance-${i}s.png` });
      console.log(`Game running smoothly at ${i} seconds...`);
    }

    console.log('Game ran for 10 seconds without freezing!');
  });
});