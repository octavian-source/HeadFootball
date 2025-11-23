// Verification script for enhanced Head Football features
const fs = require('fs');

console.log('Verifying Head Football Enhancements...\n');

// Read the game.js file
const gameCode = fs.readFileSync('game.js', 'utf8');

// Features to verify
const features = [
    {
        name: 'Increased Kick Power',
        check: () => gameCode.includes('const KICK_POWER = 900'),
        expected: 'KICK_POWER = 900'
    },
    {
        name: 'Leg Kick Power',
        check: () => gameCode.includes('const LEG_KICK_POWER = 1000'),
        expected: 'LEG_KICK_POWER = 1000'
    },
    {
        name: 'Leg Reach Distance',
        check: () => gameCode.includes('const LEG_REACH = 35'),
        expected: 'LEG_REACH = 35'
    },
    {
        name: 'Kick Animation Time',
        check: () => gameCode.includes('const KICK_ANIMATION_TIME = 200'),
        expected: 'KICK_ANIMATION_TIME = 200'
    },
    {
        name: 'Goalposts Method',
        check: () => gameCode.includes('createGoalposts()'),
        expected: 'createGoalposts() method'
    },
    {
        name: 'Left Goal Posts',
        check: () => gameCode.includes('this.leftGoalLeftPost') && gameCode.includes('this.leftGoalCrossbar'),
        expected: 'Left goal posts and crossbar'
    },
    {
        name: 'Right Goal Posts',
        check: () => gameCode.includes('this.rightGoalLeftPost') && gameCode.includes('this.rightGoalCrossbar'),
        expected: 'Right goal posts and crossbar'
    },
    {
        name: 'Player Leg Graphics',
        check: () => gameCode.includes('this.player1Leg') && gameCode.includes('this.player2Leg'),
        expected: 'Player leg graphics'
    },
    {
        name: 'Leg Foot Collision',
        check: () => gameCode.includes('this.player1LegFoot') && gameCode.includes('this.player2LegFoot'),
        expected: 'Leg foot collision bodies'
    },
    {
        name: 'Kick Animation State',
        check: () => gameCode.includes('this.player1Kicking') && gameCode.includes('this.player2Kicking'),
        expected: 'Kick animation states'
    },
    {
        name: 'performKick Method',
        check: () => gameCode.includes('performKick(player, isLegKick'),
        expected: 'performKick method with leg kick parameter'
    },
    {
        name: 'Enhanced Ball Bounce',
        check: () => gameCode.includes('const force = 300'),
        expected: 'Increased ball bounce force (300)'
    },
    {
        name: 'Ball Bounce Between Players',
        check: () => gameCode.includes('Ball is between players - bounce it up'),
        expected: 'Ball bounce when trapped between players'
    },
    {
        name: 'Goalpost Collisions',
        check: () => gameCode.includes('this.physics.add.collider(this.ball, this.leftGoalLeftPost)'),
        expected: 'Ball-goalpost collision detection'
    },
    {
        name: 'Leg Animation Tween',
        check: () => gameCode.includes('this.tweens.add') && gameCode.includes('rotation: kickAngle'),
        expected: 'Leg kick animation tween'
    },
    {
        name: 'Bot Leg Animation',
        check: () => gameCode.includes('// Animate bot leg'),
        expected: 'Bot leg animation support'
    }
];

// Run verification
let passCount = 0;
let failCount = 0;

features.forEach(feature => {
    const passed = feature.check();
    if (passed) {
        console.log(`✅ ${feature.name}: PASSED`);
        passCount++;
    } else {
        console.log(`❌ ${feature.name}: FAILED - Expected ${feature.expected}`);
        failCount++;
    }
});

console.log('\n' + '='.repeat(50));
console.log(`VERIFICATION RESULTS: ${passCount}/${features.length} features implemented`);

if (failCount === 0) {
    console.log('✅ All enhancements successfully implemented!');
} else {
    console.log(`⚠️ ${failCount} features need attention`);
}

// Check for preserved functionality
console.log('\n' + '='.repeat(50));
console.log('PRESERVED FUNCTIONALITY CHECK:');

const preservedFeatures = [
    { name: 'Menu Scene', check: () => gameCode.includes('class MenuScene') },
    { name: 'Difficulty Scene', check: () => gameCode.includes('class DifficultyScene') },
    { name: 'Pause Scene', check: () => gameCode.includes('class PauseScene') },
    { name: 'GameOver Scene', check: () => gameCode.includes('class GameOverScene') },
    { name: 'AI Bot Easy', check: () => gameCode.includes('easy: {') },
    { name: 'AI Bot Medium', check: () => gameCode.includes('medium: {') },
    { name: 'AI Bot Hard', check: () => gameCode.includes('hard: {') },
    { name: 'WASD Controls', check: () => gameCode.includes("this.input.keyboard.addKey('W')") },
    { name: 'Arrow Controls', check: () => gameCode.includes('Phaser.Input.Keyboard.KeyCodes.UP') },
    { name: 'Score System', check: () => gameCode.includes('scoreGoal') },
    { name: 'Timer System', check: () => gameCode.includes('startMatchTimer') }
];

let preservedCount = 0;
preservedFeatures.forEach(feature => {
    if (feature.check()) {
        console.log(`✅ ${feature.name}: Preserved`);
        preservedCount++;
    } else {
        console.log(`❌ ${feature.name}: Missing or modified`);
    }
});

console.log(`\n✅ ${preservedCount}/${preservedFeatures.length} original features preserved`);

// Final summary
console.log('\n' + '='.repeat(50));
if (passCount === features.length && preservedCount === preservedFeatures.length) {
    console.log('🎉 ENHANCEMENT COMPLETE: All new features added, all original features preserved!');
    process.exit(0);
} else {
    console.log('⚠️ Some issues detected. Please review the failed checks.');
    process.exit(1);
}