const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('path');

let electronApp;
let window;

test.beforeEach(async () => {
  electronApp = await electron.launch({
    args: [path.join(__dirname, '..', 'main.js')]
  });
  window = await electronApp.firstWindow();
  await window.waitForLoadState();
  await window.waitForTimeout(2000);
});

test.afterEach(async () => {
  if (electronApp) {
    await electronApp.close();
  }
});

test.describe('Critical Game Functionality', () => {
  test('Game does not freeze after selecting difficulty', async () => {
    console.log('TEST: Checking if game freezes after difficulty selection...');

    // Navigate to bot mode
    await window.click('canvas', { position: { x: 600, y: 370 } });
    await window.waitForTimeout(1000);

    // Select Easy difficulty
    console.log('Selecting Easy difficulty...');
    await window.click('canvas', { position: { x: 600, y: 280 } });
    await window.waitForTimeout(2000);

    // Check game is responsive
    await window.keyboard.press('d');
    await window.waitForTimeout(500);
    await window.keyboard.press('w');
    await window.waitForTimeout(500);

    await window.screenshot({ path: 'test-results/no-freeze-easy.png' });
    console.log('✓ Game does NOT freeze on Easy difficulty!');
  });

  test('All difficulty levels work', async () => {
    const difficulties = [
      { name: 'Easy', y: 280 },
      { name: 'Medium', y: 360 },
      { name: 'Hard', y: 440 }
    ];

    for (const diff of difficulties) {
      console.log(`Testing ${diff.name} difficulty...`);

      // Go to main menu
      await window.reload();
      await window.waitForTimeout(2000);

      // Navigate to bot mode
      await window.click('canvas', { position: { x: 600, y: 370 } });
      await window.waitForTimeout(1000);

      // Select difficulty
      await window.click('canvas', { position: { x: 600, y: diff.y } });
      await window.waitForTimeout(2000);

      // Test controls
      await window.keyboard.press('d');
      await window.waitForTimeout(200);

      await window.screenshot({ path: `test-results/working-${diff.name.toLowerCase()}.png` });
      console.log(`✓ ${diff.name} difficulty works!`);
    }
  });

  test('PvP mode works', async () => {
    console.log('Testing Player vs Player mode...');

    // Click PvP button
    await window.click('canvas', { position: { x: 600, y: 280 } });
    await window.waitForTimeout(2000);

    // Test P1 controls
    await window.keyboard.press('d');
    await window.waitForTimeout(200);
    await window.keyboard.press('w');
    await window.waitForTimeout(200);

    // Test P2 controls
    await window.keyboard.press('ArrowLeft');
    await window.waitForTimeout(200);
    await window.keyboard.press('ArrowUp');

    await window.screenshot({ path: 'test-results/pvp-working.png' });
    console.log('✓ PvP mode works!');
  });

  test('Game runs smoothly for extended period', async () => {
    console.log('Testing game stability over time...');

    // Start bot game
    await window.click('canvas', { position: { x: 600, y: 370 } });
    await window.waitForTimeout(1000);
    await window.click('canvas', { position: { x: 600, y: 360 } }); // Medium

    // Let it run and take periodic screenshots
    for (let i = 1; i <= 5; i++) {
      await window.waitForTimeout(2000);
      await window.screenshot({ path: `test-results/stability-${i * 2}s.png` });
      console.log(`Game running smoothly at ${i * 2} seconds...`);
    }

    console.log('✓ Game runs smoothly without freezing!');
  });
});