const { _electron: electron } = require('playwright');
const path = require('path');

/**
 * Launch the Electron application for testing
 * @returns {Promise<{app: ElectronApplication, window: Page}>}
 */
async function launchElectronApp() {
  // Launch Electron app
  const electronApp = await electron.launch({
    args: [path.join(__dirname, '..')],
    env: {
      ...process.env,
      NODE_ENV: 'test'
    },
  });

  // Wait for the first window to appear
  const window = await electronApp.firstWindow();

  // Wait for the window to be fully loaded
  await window.waitForLoadState('networkidle');

  return { app: electronApp, window };
}

/**
 * Close the Electron application
 * @param {ElectronApplication} app
 */
async function closeElectronApp(app) {
  if (app) {
    await app.close();
  }
}

/**
 * Take a screenshot with a descriptive name
 * @param {Page} window
 * @param {string} name
 */
async function takeScreenshot(window, name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await window.screenshot({
    path: `tests/screenshots/${name}-${timestamp}.png`,
    fullPage: true
  });
}

/**
 * Wait for game to be ready (check for canvas element)
 * @param {Page} window
 */
async function waitForGameReady(window) {
  // Wait for canvas element to be visible
  await window.waitForSelector('canvas', {
    state: 'visible',
    timeout: 10000
  });

  // Additional wait to ensure game is fully initialized
  await window.waitForTimeout(2000);
}

/**
 * Get game state information
 * @param {Page} window
 */
async function getGameState(window) {
  return await window.evaluate(() => {
    // Try to access global game variables if they exist
    const gameInfo = {};

    // Check if canvas exists
    const canvas = document.querySelector('canvas');
    gameInfo.canvasExists = !!canvas;
    gameInfo.canvasVisible = canvas ? canvas.offsetWidth > 0 && canvas.offsetHeight > 0 : false;

    // Try to get game state from global variables
    if (typeof game !== 'undefined') {
      gameInfo.gameExists = true;
      gameInfo.gameState = game.state || 'unknown';

      // Try to get player info
      if (game.player1) {
        gameInfo.player1Visible = true;
        gameInfo.player1Position = { x: game.player1.x, y: game.player1.y };
      }

      if (game.player2) {
        gameInfo.player2Visible = true;
        gameInfo.player2Position = { x: game.player2.x, y: game.player2.y };
      }

      // Try to get ball info
      if (game.ball) {
        gameInfo.ballVisible = true;
        gameInfo.ballPosition = { x: game.ball.x, y: game.ball.y };
      }

      // Try to get timer info
      if (game.timer !== undefined) {
        gameInfo.timerValue = game.timer;
      }

      // Try to get score info
      if (game.score1 !== undefined) {
        gameInfo.score1 = game.score1;
      }
      if (game.score2 !== undefined) {
        gameInfo.score2 = game.score2;
      }
    }

    return gameInfo;
  });
}

module.exports = {
  launchElectronApp,
  closeElectronApp,
  takeScreenshot,
  waitForGameReady,
  getGameState
};