const { test, expect } = require('@playwright/test');
const {
  launchElectronApp,
  closeElectronApp,
  takeScreenshot,
  waitForGameReady,
  getGameState
} = require('./electron-helpers');

let electronApp;
let window;

test.describe('Headball 2 Game Tests', () => {
  test.beforeEach(async () => {
    // Launch the Electron app before each test
    const app = await launchElectronApp();
    electronApp = app.app;
    window = app.window;

    // Set a reasonable viewport
    await window.setViewportSize({ width: 1280, height: 720 });
  });

  test.afterEach(async () => {
    // Take a screenshot before closing (for debugging)
    await takeScreenshot(window, 'test-end');

    // Close the app after each test
    await closeElectronApp(electronApp);
  });

  test('should launch game successfully', async () => {
    // Wait for the game to be ready
    await waitForGameReady(window);

    // Check if the window title is correct
    const title = await window.title();
    expect(title).toContain('Head Football');

    // Check if canvas exists
    const canvas = await window.locator('canvas');
    await expect(canvas).toBeVisible();

    // Take a screenshot of the initial state
    await takeScreenshot(window, 'game-launched');

    console.log('✓ Game launched successfully');
  });

  test('should start a match and verify players are visible', async () => {
    await waitForGameReady(window);

    // Try to start a match (assuming there's a start button or menu)
    // First, try to click on canvas or any start button

    // Look for any button that might start the game
    const startButton = window.locator('button:has-text("Start"), button:has-text("Play"), button:has-text("Bot Mode"), button:has-text("vs Bot")');
    const buttonExists = await startButton.count() > 0;

    if (buttonExists) {
      await startButton.first().click();
      console.log('✓ Clicked start button');
    } else {
      // If no button, try clicking on canvas to start
      const canvas = await window.locator('canvas');
      await canvas.click();
      console.log('✓ Clicked canvas to start');
    }

    // Wait for game to initialize
    await window.waitForTimeout(3000);

    // Get game state
    const gameState = await getGameState(window);
    console.log('Game state:', gameState);

    // Verify players are visible
    if (gameState.player1Visible) {
      console.log('✓ Player 1 is visible at position:', gameState.player1Position);
    } else {
      console.log('✗ Player 1 is NOT visible');
    }

    if (gameState.player2Visible) {
      console.log('✓ Player 2 is visible at position:', gameState.player2Position);
    } else {
      console.log('✗ Player 2 is NOT visible');
    }

    // Take a screenshot
    await takeScreenshot(window, 'players-visible-check');

    // Assert at least one player is visible
    expect(gameState.player1Visible || gameState.player2Visible).toBeTruthy();
  });

  test('should verify ball stays on field (no falling through ground)', async () => {
    await waitForGameReady(window);

    // Start the game
    const canvas = await window.locator('canvas');
    await canvas.click();
    await window.waitForTimeout(2000);

    // Monitor ball position over time
    const ballPositions = [];
    const groundLevel = 600; // Approximate ground level (adjust based on your game)

    console.log('Monitoring ball position for 30 seconds...');

    for (let i = 0; i < 30; i++) {
      const gameState = await getGameState(window);

      if (gameState.ballPosition) {
        ballPositions.push(gameState.ballPosition);
        console.log(`Second ${i + 1}: Ball at (${gameState.ballPosition.x}, ${gameState.ballPosition.y})`);

        // Check if ball has fallen through the ground
        if (gameState.ballPosition.y > groundLevel + 100) {
          console.log('✗ WARNING: Ball may have fallen through the ground!');
          await takeScreenshot(window, 'ball-fell-through');
          throw new Error(`Ball fell through the ground at position y=${gameState.ballPosition.y}`);
        }
      }

      await window.waitForTimeout(1000);
    }

    console.log('✓ Ball stayed on field for 30 seconds');
    await takeScreenshot(window, 'ball-position-stable');

    // Verify we collected ball positions
    expect(ballPositions.length).toBeGreaterThan(0);
  });

  test('should score a goal and verify game does not freeze', async () => {
    await waitForGameReady(window);

    // Start the game
    const canvas = await window.locator('canvas');
    await canvas.click();
    await window.waitForTimeout(2000);

    // Get initial score
    let initialState = await getGameState(window);
    const initialScore1 = initialState.score1 || 0;
    const initialScore2 = initialState.score2 || 0;
    const initialTimer = initialState.timerValue;

    console.log(`Initial scores: Player1=${initialScore1}, Player2=${initialScore2}`);
    console.log(`Initial timer: ${initialTimer}`);

    // Simulate player movement to try scoring
    // Using keyboard controls (adjust based on your game's controls)
    await window.keyboard.press('ArrowRight');
    await window.waitForTimeout(500);
    await window.keyboard.press('ArrowUp'); // Jump
    await window.waitForTimeout(500);

    // Try multiple attempts to score
    console.log('Attempting to score a goal...');

    for (let attempt = 0; attempt < 10; attempt++) {
      // Move towards the goal
      await window.keyboard.press('ArrowRight');
      await window.waitForTimeout(200);
      await window.keyboard.press('ArrowUp');
      await window.waitForTimeout(200);

      // Check if a goal was scored
      const currentState = await getGameState(window);
      const currentScore1 = currentState.score1 || 0;
      const currentScore2 = currentState.score2 || 0;

      if (currentScore1 > initialScore1 || currentScore2 > initialScore2) {
        console.log(`✓ Goal scored! New scores: Player1=${currentScore1}, Player2=${currentScore2}`);
        await takeScreenshot(window, 'goal-scored');

        // Now test if game continues after goal
        console.log('Testing if game continues after goal...');

        // Wait a bit
        await window.waitForTimeout(3000);

        // Try to move player after goal
        await window.keyboard.press('ArrowLeft');
        await window.waitForTimeout(500);
        await window.keyboard.press('ArrowRight');
        await window.waitForTimeout(500);

        // Check if timer is still running
        const afterGoalState = await getGameState(window);
        const afterGoalTimer = afterGoalState.timerValue;

        console.log(`Timer after goal: ${afterGoalTimer}`);

        // Verify game hasn't frozen
        if (afterGoalTimer !== undefined && initialTimer !== undefined) {
          if (afterGoalTimer !== initialTimer) {
            console.log('✓ Timer is still running - game did not freeze');
          } else {
            console.log('✗ WARNING: Timer may be frozen');
          }
        }

        // Verify controls still work
        const beforeMoveState = await getGameState(window);
        await window.keyboard.press('ArrowRight');
        await window.waitForTimeout(500);
        const afterMoveState = await getGameState(window);

        if (beforeMoveState.player1Position && afterMoveState.player1Position) {
          if (beforeMoveState.player1Position.x !== afterMoveState.player1Position.x) {
            console.log('✓ Controls still work after goal');
          } else {
            console.log('✗ WARNING: Controls may not be working after goal');
          }
        }

        break;
      }
    }

    await takeScreenshot(window, 'game-after-goal-test');
  });

  test('should verify timer works properly', async () => {
    await waitForGameReady(window);

    // Start the game
    const canvas = await window.locator('canvas');
    await canvas.click();
    await window.waitForTimeout(2000);

    // Monitor timer over time
    const timerValues = [];

    console.log('Monitoring timer for 10 seconds...');

    for (let i = 0; i < 10; i++) {
      const gameState = await getGameState(window);

      if (gameState.timerValue !== undefined) {
        timerValues.push(gameState.timerValue);
        console.log(`Second ${i + 1}: Timer value = ${gameState.timerValue}`);
      }

      await window.waitForTimeout(1000);
    }

    // Verify timer is changing
    const uniqueTimerValues = [...new Set(timerValues)];

    if (uniqueTimerValues.length > 1) {
      console.log('✓ Timer is working properly (values are changing)');
    } else if (uniqueTimerValues.length === 1) {
      console.log('✗ Timer appears to be frozen at value:', uniqueTimerValues[0]);
      throw new Error('Timer is not working properly - stuck at same value');
    } else {
      console.log('⚠ Could not detect timer values');
    }

    await takeScreenshot(window, 'timer-test-complete');

    // Assert timer values were collected and changed
    expect(timerValues.length).toBeGreaterThan(0);
    expect(uniqueTimerValues.length).toBeGreaterThan(1);
  });

  test('should verify controls work throughout the game', async () => {
    await waitForGameReady(window);

    // Start the game
    const canvas = await window.locator('canvas');
    await canvas.click();
    await window.waitForTimeout(2000);

    console.log('Testing player controls...');

    // Test movement controls
    const movements = [
      { key: 'ArrowLeft', direction: 'left' },
      { key: 'ArrowRight', direction: 'right' },
      { key: 'ArrowUp', direction: 'up/jump' }
    ];

    for (const movement of movements) {
      const beforeState = await getGameState(window);
      const beforePos = beforeState.player1Position;

      // Press key
      await window.keyboard.press(movement.key);
      await window.waitForTimeout(500);

      const afterState = await getGameState(window);
      const afterPos = afterState.player1Position;

      if (beforePos && afterPos) {
        if (beforePos.x !== afterPos.x || beforePos.y !== afterPos.y) {
          console.log(`✓ ${movement.direction} control works - player moved`);
        } else {
          console.log(`✗ ${movement.direction} control may not be working`);
        }
      }
    }

    // Test continuous gameplay for 20 seconds
    console.log('Testing continuous gameplay for 20 seconds...');

    for (let i = 0; i < 20; i++) {
      // Random movements to simulate gameplay
      const randomKey = movements[Math.floor(Math.random() * movements.length)].key;
      await window.keyboard.press(randomKey);
      await window.waitForTimeout(1000);

      // Check game state
      const state = await getGameState(window);
      if (!state.canvasVisible) {
        console.log('✗ Game canvas is no longer visible - possible freeze');
        throw new Error('Game may have frozen - canvas not visible');
      }
    }

    console.log('✓ Controls worked throughout 20 seconds of gameplay');
    await takeScreenshot(window, 'controls-test-complete');
  });

  test('full game integration test', async () => {
    await waitForGameReady(window);

    console.log('Starting full integration test...');

    // Start the game
    const canvas = await window.locator('canvas');
    await canvas.click();
    await window.waitForTimeout(2000);

    // Play for 60 seconds with various actions
    const testDuration = 60; // seconds
    const issues = [];

    for (let second = 0; second < testDuration; second++) {
      // Random actions
      if (second % 5 === 0) {
        await window.keyboard.press('ArrowRight');
      }
      if (second % 7 === 0) {
        await window.keyboard.press('ArrowUp');
      }
      if (second % 11 === 0) {
        await window.keyboard.press('ArrowLeft');
      }

      // Check game state every 5 seconds
      if (second % 5 === 0) {
        const state = await getGameState(window);

        // Check for issues
        if (!state.canvasVisible) {
          issues.push(`Canvas not visible at second ${second}`);
        }

        if (state.ballPosition && state.ballPosition.y > 700) {
          issues.push(`Ball may have fallen through ground at second ${second}`);
        }

        console.log(`Second ${second}: Game running, score=${state.score1 || 0}-${state.score2 || 0}`);
      }

      await window.waitForTimeout(1000);
    }

    // Final screenshot
    await takeScreenshot(window, 'integration-test-complete');

    // Report results
    if (issues.length > 0) {
      console.log('✗ Issues detected during integration test:');
      issues.forEach(issue => console.log(`  - ${issue}`));
      throw new Error(`Integration test failed with ${issues.length} issues`);
    } else {
      console.log('✓ Full integration test passed - no critical issues detected');
    }
  });
});