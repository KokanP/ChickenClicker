document.addEventListener('DOMContentLoaded', () => {

    // --- GAME BALANCE & CONFIGURATION --- //
    // This section contains all the core values that control the game's pacing and difficulty.
    // Change these numbers to rebalance the game without altering the main logic.

    const CONFIG = {
        // General Settings
        SAVE_KEY: 'chickenClickerSave_v2.3_separated', // Change this to reset all players' saves on an update
        GAME_VERSION: '2.2',

        // Timers (in seconds)
        GAME_TICK_INTERVAL: 0.1,      // How often the main game loop runs (lower is smoother but more intensive)
        SAVE_INTERVAL: 5,             // How often the game saves to local storage
        GOLDEN_CHICKEN_SPAWN_INTERVAL: 60, // Average time between golden chicken spawns
        RANDOM_EVENT_INTERVAL: 180,   // Average time between random "Feeding Frenzy" events
        COLORED_EGG_ATTEMPT_INTERVAL: 15, // How often the game TRIES to spawn a colored egg
        
        // Probabilities (higher is more likely)
        COLORED_EGG_SPAWN_CHANCE: 10 / 240, // (10 eggs) / (240 checks per hour) = ~10 eggs per hour.
        
        // Production & Costs
        PRESTIGE_COST: 1e12, // Eggs required to prestige for the first time
        
        // Upgrades: { name, description, baseCost, cost exponent, currency, UI color }
        UPGRADES: {
            worker: { name: 'Coop Worker', desc: 'Helps Leghorns produce eggs automatically.', baseCost: 10, exponent: 1.15, currency: 'eggs', color: 'green' },
            incubator: { name: 'Incubator', desc: 'Increases eggs per click.', baseCost: 50, exponent: 1.15, currency: 'eggs', color: 'blue' },
            loom: { name: 'Golden Loom', desc: 'Uses Golden Feathers to massively boost eggs per click.', baseCost: 10, exponent: 1.5, currency: 'feathers', color: 'yellow' },
            featherForecast: { name: 'Feather Forecast', desc: 'Increases Golden Feather find chance.', baseCost: 10000, exponent: 1.8, currency: 'eggs', color: 'gray' },
            eggstraClicks: { name: 'Eggstra Clicks', desc: 'Each click has a chance to be 10x stronger.', baseCost: 50000, exponent: 1.25, currency: 'eggs', color: 'pink' },
            cluckworkAutomation: { name: 'Cluckwork Automation', desc: 'Boosts EPS by 5% for every building owned.', baseCost: 1e6, exponent: 2, currency: 'eggs', color: 'purple' },
            peckingOrder: { name: 'Pecking Order', desc: 'A flat +10% boost to both clicks and EPS.', baseCost: 1e7, exponent: 1.5, currency: 'eggs', color: 'indigo' },
            nestEggIRA: { name: 'Nest Egg IRA', desc: 'Earn 0.1% of your current eggs as interest per second.', baseCost: 1e9, exponent: 2.5, currency: 'eggs', color: 'teal' },
            fowlLanguage: { name: 'Fowl Language', desc: 'The chicken occasionally squawks insults. Essential.', baseCost: 1e12, exponent: 10, currency: 'eggs', color: 'red' }
        },

        // Chickens: { name, description, baseCost, cost exponent, UI color }
        CHICKENS: {
            leghorn: { name: 'Leghorn Chicken', desc: 'The backbone of your coop. Produces 1 egg/s per Coop Worker.', baseCost: 1000, exponent: 1.25, color: 'gray' },
            silkie: { name: 'Silkie Chicken', desc: 'Produces fewer eggs but has a chance to find Golden Feathers.', baseCost: 5000, exponent: 1.25, color: 'orange' },
            rooster: { name: 'Rooster', desc: 'Doesn\'t lay eggs. Generates Reputation instead.', baseCost: 1e6, exponent: 1.25, color: 'red' },
            orpington: { name: 'Orpington Oracle', desc: 'Grants a random egg bonus every 10 minutes.', baseCost: 1e8, exponent: 1.3, color: 'yellow' },
            wyandotte: { name: 'Wyandotte Warrior', desc: 'Increases Reputation gained on prestige.', baseCost: 1e10, exponent: 1.35, color: 'blue' },
            doja: { name: 'Doja Cow', desc: '"Moooove over!" Each click has a chance to be a "Super Click", granting 1 hour of EPS.', baseCost: 5e12, exponent: 1.4, color: 'pink' },
            brahma: { name: 'Brahma Behemoth', desc: 'A gentle giant. Adds a massive +500% to your base EPS.', baseCost: 1e15, exponent: 1.45, color: 'green' },
            serama: { name: 'Serama Sorcerer', desc: 'Has a chance to grant a free upgrade level.', baseCost: 1e18, exponent: 1.5, color: 'purple' },
            banty: { name: 'Banty Chicken', desc: 'The king. Provides a +10% multiplicative bonus to ALL production.', baseCost: 1e21, exponent: 1.6, color: 'indigo' }
        },

        // Colored Eggs: { likelihood (adds up to 100), effect, value, duration (seconds), UI color }
        COLORED_EGGS: {
            green:  { likelihood: 15, effect: 'discount', value: 0.1, duration: 5, color: '#4ade80' },
            red:    { likelihood: 15, effect: 'clickFrenzy', value: 5, duration: 30, color: '#f87171' },
            pink:   { likelihood: 14, effect: 'instantGain', value: 1800, duration: 0, color: '#f472b6' },
            orange: { likelihood: 14, effect: 'featherFrenzy', value: 2, duration: 600, color: '#fb923c' },
            yellow: { likelihood: 13, effect: 'goldRush', value: 3, duration: 0, color: '#facc15' },
            white:  { likelihood: 10, effect: 'boostMultiplier', value: 2, duration: 60, color: '#f9fafb' },
            black:  { likelihood: 6,  effect: 'superClickFrenzy', value: 2, duration: 60, color: '#1f2937' },
            blue:   { likelihood: 6,  effect: 'prestigeBuff', value: 0.1, duration: -1, color: '#60a5fa' },
            purple: { likelihood: 3,  effect: 'prestigePercent', value: 0.01, duration: 0, color: '#a78bfa' },
            gold:   { likelihood: 1,  effect: 'permanentBonus', value: 0.01, duration: -1, color: 'gold' }
        }
    };

    // --- END OF CONFIGURATION --- //


    // --- DOM Elements ---
    const nicknameInput = document.getElementById('nickname-input');
    const chicken = document.getElementById('chicken');
    const eggCounter = document.getElementById('egg-counter');
    const featherCounter = document.getElementById('feather-counter');
    const epsCounter = document.getElementById('eggs-per-second');
    const epcCounter = document.getElementById('eggs-per-click');
    const achievementsList = document.getElementById('achievements-list');
    const goldenChicken = document.getElementById('golden-chicken');
    const toast = document.getElementById('achievement-toast');
    const toastTitle = document.getElementById('toast-title');
    const toastDescription = document.getElementById('toast-description');
    const prestigeButton = document.getElementById('prestige-button');
    const reputationPointsEl = document.getElementById('reputation-points');
    const reputationBonusEl = document.getElementById('reputation-bonus');
    const resetButton = document.getElementById('reset-button');
    const licenseSummary = document.getElementById('license-summary');
    const eventBanner = document.getElementById('event-banner');
    const nameModal = document.getElementById('name-modal');
    const initialNicknameInput = document.getElementById('initial-nickname-input');
    const startGameBtn = document.getElementById('start-game-btn');
    const playerNameDisplay = document.getElementById('player-name-display');
    const upgradesListContainer = document.getElementById('upgrades-list');
    const coopListContainer = document.getElementById('coop-list');
    const coloredEggContainer = document.getElementById('colored-egg-container');
    const versionNumberEl = document.getElementById('version-number');

    // --- Game State ---
    let gameState = {};
    const initialGameState = {
        nickname: null,
        eggs: 0,
        totalEggs: 0,
        feathers: 0,
        totalFeathers: 0,
        totalClicks: 0,
        upgrades: {
            worker: 0, incubator: 0, loom: 0,
            featherForecast: 0, eggstraClicks: 0, cluckworkAutomation: 0,
            peckingOrder: 0, nestEggIRA: 0, fowlLanguage: 0
        },
        chickens: { 
            leghorn: 1, silkie: 0, rooster: 0,
            orpington: 0, wyandotte: 0, doja: 0,
            brahma: 0, serama: 0, banty: 0
        },
        unlockedAchievements: [],
        reputation: 0,
        timePlayed: 0,
        failedBuys: 0,
        licenseClicked: false,
        goldenChickensClicked: 0,
        prestigeCount: 0,
        resets: 0,
        event: { active: false, type: null, duration: 0, modifier: 1 },
        activeBuffs: {},
        permanentBonus: 1, // From Gold Eggs
        clickedColoredEggs: {},
        lastSuperClickTime: 0,
        superClickChain: 0,
        modalOpens: 0,
        timeSinceLastClick: 0,
    };
    
    // --- Achievements Data ---
    const achievements = {
        click1: { name: "First Peck", description: "Click the chicken once.", bonus: 1.01 },
        click1k: { name: "Click Addict", description: "Click 1,000 times.", bonus: 1.02 },
        click100k: { name: "Carpal Tunnel Hopeful", description: "Click 100,000 times.", bonus: 1.05 },
        click1M: { name: "Million-Click March", description: "Click 1,000,000 times.", bonus: 1.1 },
        egg1k: { name: "First Dozen", description: "Earn 1,000 total eggs.", bonus: 1.01 },
        egg1M: { name: "Egg Millionaire", description: "Earn 1,000,000 total eggs.", bonus: 1.03 },
        egg1B: { name: "Egg Billionaire", description: "Earn 1,000,000,000 total eggs.", bonus: 1.05 },
        egg1T: { name: "Trillionaire's Omelette", description: "Earn 1 Trillion total eggs.", bonus: 1.1 },
        worker25: { name: "Coop Manager", description: "Own 25 Coop Workers.", bonus: 1.02 },
        worker100: { name: "Foreman of the Flock", description: "Own 100 Coop Workers.", bonus: 1.05 },
        incubator25: { name: "Industrial Revolution", description: "Own 25 Incubators.", bonus: 1.02 },
        incubator100: { name: "Clickpocalypse", description: "Own 100 Incubators.", bonus: 1.05 },
        loom1: { name: "Golden Threads", description: "Build your first Golden Loom.", bonus: 1.05 },
        loom10: { name: "Rich Tapestry", description: "Own 10 Golden Looms.", bonus: 1.1 },
        featherForecast1: { name: "Good Omen", description: "Buy a Feather Forecast.", bonus: 1.02 },
        eggstraClicks1: { name: "Lucky Break", description: "Buy an Eggstra Clicks.", bonus: 1.02 },
        cluckworkAutomation1: { name: "Synergy", description: "Buy Cluckwork Automation.", bonus: 1.03 },
        peckingOrder1: { name: "Top of the Order", description: "Buy a Pecking Order.", bonus: 1.03 },
        nestEggIRA1: { name: "Retirement Plan", description: "Start a Nest Egg IRA.", bonus: 1.05 },
        fowlLanguage1: { name: "Why I Oughta!", description: "Buy Fowl Language.", bonus: 1.01 },
        silkie1: { name: "Fluffy", description: "Buy your first Silkie Chicken.", bonus: 1.02 },
        rooster1: { name: "Cocky", description: "Buy your first Rooster.", bonus: 1.02 },
        orpington1: { name: "Fortune Teller", description: "Buy an Orpington Oracle.", bonus: 1.03 },
        wyandotte1: { name: "Reputable", description: "Buy a Wyandotte Warrior.", bonus: 1.03 },
        doja1: { name: "Moooove Over", description: "Buy a Doja Cow.", bonus: 1.05 },
        brahma1: { name: "Gentle Giant", description: "Buy a Brahma Behemoth.", bonus: 1.05 },
        serama1: { name: "Freebie!", description: "Buy a Serama Sorcerer.", bonus: 1.07 },
        banty1: { name: "King of the Coop", description: "Buy the legendary Banty Chicken.", bonus: 1.1 },
        secondChance: { name: "Second Chance", description: "Prestige for the first time.", bonus: 1.10 },
        eternalFarmer: { name: "Eternal Farmer", description: "Prestige 10 times.", bonus: 1.25 },
        prestigeWorldwide: { name: "Prestige Worldwide", description: "Prestige 25 times.", bonus: 1.5 },
        goldenTouch: { name: "Golden Touch", description: "Click your first Golden Chicken.", bonus: 1.02 },
        goldRush: { name: "Gold Rush", description: "Click 10 Golden Chickens.", bonus: 1.10 },
        goldFever: { name: "Gold Fever", description: "Click 50 Golden Chickens.", bonus: 1.2 },
        eggGreen: { name: "Going Green", description: "Find a Green Egg.", bonus: 1.01, hidden: true, noToast: true },
        eggRed: { name: "Seeing Red", description: "Find a Red Egg.", bonus: 1.01, hidden: true, noToast: true },
        eggPink: { name: "In the Pink", description: "Find a Pink Egg.", bonus: 1.01, hidden: true, noToast: true },
        eggOrange: { name: "Orange You Glad", description: "Find an Orange Egg.", bonus: 1.01, hidden: true, noToast: true },
        eggYellow: { name: "Mellow Yellow", description: "Find a Yellow Egg.", bonus: 1.01, hidden: true, noToast: true },
        eggWhite: { name: "Plain and Simple", description: "Find a White Egg.", bonus: 1.01, hidden: true, noToast: true },
        eggBlack: { name: "Back in Black", description: "Find a Black Egg.", bonus: 1.01, hidden: true, noToast: true },
        eggBlue: { name: "Feeling Blue", description: "Find a Blue Egg.", bonus: 1.01, hidden: true, noToast: true },
        eggPurple: { name: "Purple Reign", description: "Find a Purple Egg.", bonus: 1.01, hidden: true, noToast: true },
        eggGold: { name: "Midas Touch", description: "Find a Gold Egg.", bonus: 1.05, hidden: true, noToast: true },
        impatient: { name: "Impatient", description: "Try to buy something you can't afford 50 times.", bonus: 1.01, hidden: true },
        license: { name: "License and Registration", description: "Read the license.", bonus: 1.01, hidden: true },
        reset: { name: "What Did It Do To You?", description: "Use the Hard Reset button.", bonus: 1.00, hidden: true },
        lazy: { name: "Are You Even Trying?", description: "Don't click the chicken for the first 2 minutes.", bonus: 1.05, hidden: true },
        loner: { name: "Just Me and My Chicken", description: "Reach 1M eggs without buying any Coop Workers.", bonus: 1.10, hidden: true },
        afk: { name: "Still There?", description: "Don't click anything for 15 minutes.", bonus: 1.1, hidden: true },
        indecisive: { name: "Window Shopper", description: "Open and close a modal 50 times.", bonus: 1.02, hidden: true },
        justTheBasics: { name: "Old School", description: "Reach 10M eggs using only Leghorn Chickens.", bonus: 1.15, hidden: true },
        allUpgrades: { name: "Master Builder", description: "Buy at least one of every upgrade.", bonus: 1.2, hidden: true },
        allChickens: { name: "Gotta Cluck 'Em All", description: "Own at least one of every chicken.", bonus: 1.2, hidden: true },
        eggCollector: { name: "Taste the Rainbow", description: "Find one of every colored egg.", bonus: 1.25, hidden: true },
    };
    
    const achievementConditions = {
        click1: () => gameState.totalClicks >= 1, click1k: () => gameState.totalClicks >= 1000, click100k: () => gameState.totalClicks >= 100000, click1M: () => gameState.totalClicks >= 1e6,
        egg1k: () => gameState.totalEggs >= 1000, egg1M: () => gameState.totalEggs >= 1e6, egg1B: () => gameState.totalEggs >= 1e9, egg1T: () => gameState.totalEggs >= 1e12,
        worker25: () => gameState.upgrades.worker >= 25, worker100: () => gameState.upgrades.worker >= 100,
        incubator25: () => gameState.upgrades.incubator >= 25, incubator100: () => gameState.upgrades.incubator >= 100,
        loom1: () => gameState.upgrades.loom >= 1, loom10: () => gameState.upgrades.loom >= 10,
        featherForecast1: () => gameState.upgrades.featherForecast >= 1, eggstraClicks1: () => gameState.upgrades.eggstraClicks >= 1,
        cluckworkAutomation1: () => gameState.upgrades.cluckworkAutomation >= 1, peckingOrder1: () => gameState.upgrades.peckingOrder >= 1,
        nestEggIRA1: () => gameState.upgrades.nestEggIRA >= 1, fowlLanguage1: () => gameState.upgrades.fowlLanguage >= 1,
        silkie1: () => gameState.chickens.silkie >= 1, rooster1: () => gameState.chickens.rooster >= 1,
        orpington1: () => gameState.chickens.orpington >= 1, wyandotte1: () => gameState.chickens.wyandotte >= 1,
        doja1: () => gameState.chickens.doja >= 1, brahma1: () => gameState.chickens.brahma >= 1,
        serama1: () => gameState.chickens.serama >= 1, banty1: () => gameState.chickens.banty >= 1,
        secondChance: () => gameState.prestigeCount >= 1, eternalFarmer: () => gameState.prestigeCount >= 10, prestigeWorldwide: () => gameState.prestigeCount >= 25,
        goldenTouch: () => gameState.goldenChickensClicked >= 1, goldRush: () => gameState.goldenChickensClicked >= 10, goldFever: () => gameState.goldenChickensClicked >= 50,
        eggGreen: () => gameState.clickedColoredEggs['green'], eggRed: () => gameState.clickedColoredEggs['red'], eggPink: () => gameState.clickedColoredEggs['pink'],
        eggOrange: () => gameState.clickedColoredEggs['orange'], eggYellow: () => gameState.clickedColoredEggs['yellow'], eggWhite: () => gameState.clickedColoredEggs['white'],
        eggBlack: () => gameState.clickedColoredEggs['black'], eggBlue: () => gameState.clickedColoredEggs['blue'], eggPurple: () => gameState.clickedColoredEggs['purple'],
        eggGold: () => gameState.clickedColoredEggs['gold'],
        impatient: () => gameState.failedBuys >= 50, license: () => gameState.licenseClicked, reset: () => gameState.resets > 0,
        lazy: () => gameState.totalClicks === 0 && gameState.timePlayed >= 120,
        loner: () => gameState.totalEggs >= 1e6 && gameState.upgrades.worker === 0,
        afk: () => gameState.timeSinceLastClick >= 900,
        indecisive: () => gameState.modalOpens >= 50,
        justTheBasics: () => gameState.totalEggs >= 1e7 && Object.keys(gameState.chickens).every(c => c === 'leghorn' || gameState.chickens[c] === 0),
        allUpgrades: () => Object.keys(CONFIG.UPGRADES).every(u => gameState.upgrades[u] > 0),
        allChickens: () => Object.keys(CONFIG.CHICKENS).every(c => gameState.chickens[c] > 0),
        eggCollector: () => Object.keys(CONFIG.COLORED_EGGS).every(c => gameState.clickedColoredEggs[c]),
    };
    
    // --- Utility Functions ---
    const formatNumber = (num) => {
        if (num === Infinity) return 'Infinity';
        if (num < 1000) return num.toFixed(0);
        const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];
        const i = Math.floor(Math.log10(num) / 3);
        if (i >= suffixes.length) return num.toExponential(2);
        return (num / Math.pow(1000, i)).toFixed(2) + suffixes[i];
    };
    const calculateCost = (base, level, exponent = 1.15) => Math.floor(base * Math.pow(exponent, level));
    const formatTime = (seconds) => `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`;
    
    const showFloatingText = (text, event, isSuper = false) => {
        const el = document.createElement('div');
        el.className = 'floating-text';
        if (isSuper) {
            el.classList.add('super-click-text');
        }
        el.textContent = text;
        const chickenContainer = document.querySelector('.chicken-container');
        if (!chickenContainer) return;
        chickenContainer.appendChild(el);
        
        const containerRect = chickenContainer.getBoundingClientRect();
        el.style.left = `${event.clientX - containerRect.left - (el.offsetWidth / 2)}px`;
        el.style.top = `${event.clientY - containerRect.top - (el.offsetHeight / 2)}px`;
        
        setTimeout(() => {
            if (el.parentElement) {
                el.parentElement.removeChild(el);
            }
        }, 1450);
    };

    // --- Game Logic ---
    const getAchievementBonus = () => gameState.unlockedAchievements.reduce((total, id) => total * (achievements[id]?.bonus || 1), 1);
    const getReputationBonus = () => 1 + gameState.reputation * 0.05 + (gameState.chickens.wyandotte * 0.05);
    const getEventModifier = () => gameState.event.active ? gameState.event.modifier : 1;
    const getBuffModifier = (buffType, defaultValue = 1) => (gameState.activeBuffs[buffType] ? gameState.activeBuffs[buffType].value : defaultValue);
    const getBoostMultiplier = () => getBuffModifier('boostMultiplier');

    const getEggsPerSecond = () => {
        let baseEps = gameState.upgrades.worker * gameState.chickens.leghorn * 1;
        baseEps += gameState.chickens.brahma * (baseEps * 5);
        const nestEggInterest = gameState.upgrades.nestEggIRA > 0 ? gameState.eggs * 0.001 * gameState.upgrades.nestEggIRA : 0;
        
        const peckingOrderBonus = 1 + (gameState.upgrades.peckingOrder * 0.1);
        const bantyBonus = Math.pow(1.1, gameState.chickens.banty);
        
        const totalBuildings = Object.values(gameState.upgrades).reduce((a, b) => a + b, 0) + Object.values(gameState.chickens).reduce((a, b) => a + b, 0);
        const cluckworkBonus = 1 + (gameState.upgrades.cluckworkAutomation * 0.05 * totalBuildings);

        return (baseEps + nestEggInterest) * getAchievementBonus() * getReputationBonus() * getEventModifier() * getBoostMultiplier() * gameState.permanentBonus * peckingOrderBonus * bantyBonus * cluckworkBonus;
    };

    const getEggsPerClick = () => {
        const loomBoost = 1 + (gameState.upgrades.loom * 0.25);
        const baseEpc = 1 + gameState.upgrades.incubator;
        const peckingOrderBonus = 1 + (gameState.upgrades.peckingOrder * 0.1);
        const bantyBonus = Math.pow(1.1, gameState.chickens.banty);

        return Math.floor(baseEpc * loomBoost * getAchievementBonus() * getReputationBonus() * getEventModifier() * getBoostMultiplier() * gameState.permanentBonus * peckingOrderBonus * bantyBonus * getBuffModifier('clickFrenzy'));
    };

    const clickChicken = (event) => {
        // Regular Click
        let epc = getEggsPerClick();
        if (gameState.upgrades.eggstraClicks > 0 && Math.random() < (gameState.upgrades.eggstraClicks * 0.05)) {
            epc *= 10;
        }
        gameState.eggs += epc;
        gameState.totalEggs += epc;
        showFloatingText(`+${formatNumber(epc)}`, event);

        // Super Click (Doja Cow)
        const superClickChance = (gameState.chickens.doja * 0.001) * getBuffModifier('superClickFrenzy', 1);
        if (gameState.chickens.doja > 0 && Math.random() < superClickChance) {
            const now = Date.now();
            if (now - gameState.lastSuperClickTime < 10000) { // 10 second window for diminishing returns
                gameState.superClickChain++;
            } else {
                gameState.superClickChain = 0;
            }
            gameState.lastSuperClickTime = now;

            const superClickBonus = (getEggsPerSecond() * 3600) / Math.pow(2, gameState.superClickChain);
            gameState.eggs += superClickBonus;
            gameState.totalEggs += superClickBonus;
            showFloatingText(`+${formatNumber(superClickBonus)}!`, event, true);
        }

        gameState.totalClicks++;
        gameState.timeSinceLastClick = 0;
    };

    // --- Initialization ---
    function initialize() {
        if (versionNumberEl) {
            versionNumberEl.textContent = CONFIG.GAME_VERSION;
        }
        buildUpgradeShop();
        buildCoop();
        loadGame();
        renderAchievements();
        updateUI();
        
        setupEventListeners();

        setInterval(gameLoop, CONFIG.GAME_TICK_INTERVAL * 1000);
        setInterval(saveGame, CONFIG.SAVE_INTERVAL * 1000);
        setInterval(spawnGoldenChicken, CONFIG.GOLDEN_CHICKEN_SPAWN_INTERVAL * 1000);
        setInterval(triggerEvent, CONFIG.RANDOM_EVENT_INTERVAL * 1000);
        setInterval(spawnColoredEgg, CONFIG.COLORED_EGG_ATTEMPT_INTERVAL * 1000);
    }
    
    function buildUpgradeShop() {
        upgradesListContainer.innerHTML = '';
        for (const id in CONFIG.UPGRADES) {
            const upgrade = CONFIG.UPGRADES[id];
            const el = document.createElement('div');
            el.className = `bg-${upgrade.color}-200 p-4 rounded-lg border-2 border-${upgrade.color}-400`;
            el.innerHTML = `
                <h4 class="text-2xl funky-font">${upgrade.name}</h4>
                <p class="text-gray-600 mb-2">${upgrade.desc}</p>
                <p>Level: <span id="${id}-level" class="font-bold">0</span></p>
                <button id="buy-${id}" class="w-full mt-2 funky-button bg-${upgrade.color}-500 text-white">Buy for <span id="${id}-cost">10</span> ${upgrade.currency === 'eggs' ? 'Eggs' : 'Feathers'}</button>
            `;
            upgradesListContainer.appendChild(el);
        }
    }

    function buildCoop() {
        coopListContainer.innerHTML = '';
        for (const id in CONFIG.CHICKENS) {
            const chicken = CONFIG.CHICKENS[id];
            const el = document.createElement('div');
            el.className = `bg-${chicken.color}-200 p-4 rounded-lg border-2 border-${chicken.color}-400`;
            let buttonHtml = `<button id="buy-${id}" class="w-full mt-2 funky-button bg-${chicken.color}-500 text-white">Buy for <span id="${id}-cost">1000</span> Eggs</button>`;
            
            el.innerHTML = `
                <h4 class="text-2xl funky-font">${chicken.name}</h4>
                <p class="text-gray-600 mb-2">${chicken.desc}</p>
                <p>Owned: <span id="${id}-chickens" class="font-bold">0</span></p>
                ${buttonHtml}
            `;
            coopListContainer.appendChild(el);
        }
    }
    
    function setupEventListeners() {
        startGameBtn.addEventListener('click', () => {
            const name = initialNicknameInput.value.trim();
            if (name) {
                gameState.nickname = name;
                nicknameInput.value = name;
                nameModal.style.display = 'none';
                playerNameDisplay.textContent = name;
                saveGame();
            }
        });

        chicken.addEventListener('click', clickChicken);
        goldenChicken.addEventListener('click', clickGoldenChicken);

        const navButtons = document.querySelectorAll('.nav-button');
        const closeButtons = document.querySelectorAll('.close-modal-btn');
        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modalId = button.dataset.modal;
                document.getElementById(modalId).style.display = 'flex';
                gameState.modalOpens++;
            });
        });
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                button.closest('.modal-screen').style.display = 'none';
            });
        });

        nicknameInput.addEventListener('change', (e) => { 
            gameState.nickname = e.target.value || "A Farmer";
            playerNameDisplay.textContent = gameState.nickname;
        });
        prestigeButton.addEventListener('click', prestige);
        resetButton.addEventListener('click', hardReset);
        licenseSummary.addEventListener('click', () => { gameState.licenseClicked = true; });

        for (const id in CONFIG.UPGRADES) {
            document.getElementById(`buy-${id}`).addEventListener('click', () => buyUpgrade(id));
        }
        for (const id in CONFIG.CHICKENS) {
            document.getElementById(`buy-${id}`).addEventListener('click', () => buyChicken(id));
        }
    }
    
    function buyUpgrade(id) {
        const upgrade = CONFIG.UPGRADES[id];
        const cost = calculateCost(upgrade.baseCost, gameState.upgrades[id], upgrade.exponent);
        const currency = upgrade.currency;

        if (gameState[currency] >= cost) {
            gameState[currency] -= cost;
            gameState.upgrades[id]++;
        } else {
            gameState.failedBuys++;
        }
    }

    function buyChicken(id) {
        const chicken = CONFIG.CHICKENS[id];
        const cost = calculateCost(chicken.baseCost, gameState.chickens[id], chicken.exponent);
        
        if (gameState.eggs >= cost) {
            gameState.eggs -= cost;
            gameState.chickens[id]++;
        } else {
            gameState.failedBuys++;
        }
    }
    
    function spawnColoredEgg() {
        if (Math.random() > CONFIG.COLORED_EGG_SPAWN_CHANCE) {
            return;
        }

        const roll = Math.random() * 100;
        let cumulativeLikelihood = 0;

        for (const id in CONFIG.COLORED_EGGS) {
            const egg = CONFIG.COLORED_EGGS[id];
            cumulativeLikelihood += egg.likelihood;
            if (roll < cumulativeLikelihood) {
                const eggEl = document.createElement('div');
                eggEl.className = 'colored-egg';
                eggEl.style.backgroundColor = egg.color;
                eggEl.style.borderRadius = '50% 50% 50% 50% / 60% 60% 40% 40%';
                eggEl.style.boxShadow = `inset -5px -5px 10px rgba(0,0,0,0.3), 0 0 10px ${egg.color}`;
                
                const containerRect = coloredEggContainer.getBoundingClientRect();
                eggEl.style.top = `${Math.random() * (containerRect.height - 120)}px`;
                eggEl.style.left = `${Math.random() * (containerRect.width - 40)}px`;
                eggEl.style.display = 'block';
                
                eggEl.addEventListener('click', () => {
                    applyEggEffect(id);
                    eggEl.remove();
                }, { once: true });

                coloredEggContainer.appendChild(eggEl);
                
                setTimeout(() => {
                    if (eggEl.parentElement) {
                        eggEl.parentElement.removeChild(eggEl);
                    }
                }, 10000);
                return;
            }
        }
    }

    function applyEggEffect(id) {
        const egg = CONFIG.COLORED_EGGS[id];
        gameState.clickedColoredEggs[id] = (gameState.clickedColoredEggs[id] || 0) + 1;
        
        let bonusTitle = `${id.charAt(0).toUpperCase() + id.slice(1)} Egg Bonus!`;
        let bonusDescription = '';

        switch(egg.effect) {
            case 'discount':
                bonusDescription = `Next ${egg.duration} upgrades are ${egg.value * 100}% cheaper!`;
                break;
            case 'clickFrenzy':
                bonusDescription = `Click power is ${egg.value}x for ${egg.duration} seconds!`;
                break;
            case 'instantGain':
                const gain = getEggsPerSecond() * egg.value;
                gameState.eggs += gain;
                gameState.totalEggs += gain;
                bonusDescription = `Instantly gained ${formatNumber(gain)} eggs!`;
                break;
            case 'featherFrenzy':
                bonusDescription = `Golden Feather chance is doubled for ${egg.duration / 60} minutes!`;
                break;
            case 'goldRush':
                bonusDescription = `A rush of ${egg.value} Golden Chickens has appeared!`;
                for(let i=0; i<egg.value; i++) spawnGoldenChicken();
                break;
            case 'boostMultiplier':
                 bonusDescription = `All active boosts are doubled for ${egg.duration} seconds!`;
                break;
            case 'superClickFrenzy':
                bonusDescription = `Super Click chance is doubled for ${egg.duration} seconds!`;
                break;
            case 'prestigeBuff':
                bonusDescription = `Your next prestige will grant an extra ${egg.value * 100}% Reputation!`;
                break;
            case 'prestigePercent':
                const prestigeGain = CONFIG.PRESTIGE_COST * egg.value;
                gameState.eggs += prestigeGain;
                gameState.totalEggs += prestigeGain;
                bonusDescription = `Gained ${formatNumber(prestigeGain)} eggs toward your next prestige!`;
                break;
            case 'permanentBonus':
                bonusDescription = `Permanently increased all egg production by ${egg.value * 100}%!`;
                break;
        }

        showToast(bonusTitle, bonusDescription);

        if (egg.duration > 0) {
            gameState.activeBuffs[egg.effect] = { value: egg.value, duration: egg.duration };
        } else if (egg.effect === 'permanentBonus') {
            gameState.permanentBonus += egg.value;
        } else if (egg.effect === 'prestigeBuff') {
            gameState.activeBuffs[egg.effect] = { value: (gameState.activeBuffs[egg.effect]?.value || 0) + egg.value };
        }
        
        checkAchievements();
    }
    
    function saveGame() {
        localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(gameState));
    }
    
    function loadGame() {
        const savedState = localStorage.getItem(CONFIG.SAVE_KEY);
        gameState = savedState ? JSON.parse(savedState) : { ...initialGameState };
        gameState = deepMerge(initialGameState, gameState);

        if (!gameState.nickname) {
            nameModal.style.display = 'flex';
        } else {
            playerNameDisplay.textContent = gameState.nickname;
        }
        nicknameInput.value = gameState.nickname;
    }

    function deepMerge(target, source) {
        const output = { ...target };
        if (isObject(target) && isObject(source)) {
            Object.keys(source).forEach(key => {
                if (isObject(source[key])) {
                    if (!(key in target))
                        Object.assign(output, { [key]: source[key] });
                    else
                        output[key] = deepMerge(target[key], source[key]);
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    }

    function isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }

    function hardReset() {
        if (confirm("Are you sure you want to completely reset your game? This cannot be undone.")) {
            localStorage.removeItem(CONFIG.SAVE_KEY);
            location.reload();
        }
    }
    
    function gameLoop() {
        const secondsPassed = CONFIG.GAME_TICK_INTERVAL;
        const eps = getEggsPerSecond();
        gameState.eggs += eps * secondsPassed;
        gameState.totalEggs += eps * secondsPassed;
        gameState.timePlayed += secondsPassed;
        gameState.timeSinceLastClick = (gameState.timeSinceLastClick || 0) + secondsPassed;
        
        for (const buff in gameState.activeBuffs) {
            if (gameState.activeBuffs[buff].duration > 0) {
                gameState.activeBuffs[buff].duration -= secondsPassed;
                if (gameState.activeBuffs[buff].duration <= 0) {
                    delete gameState.activeBuffs[buff];
                }
            }
        }

        if(gameState.event.active) {
            gameState.event.duration -= secondsPassed;
            if(gameState.event.duration <= 0) {
                gameState.event.active = false;
            }
        }
        
        const featherChance = 0.1 + (gameState.upgrades.featherForecast * 0.01);
        if(Math.random() < (gameState.chickens.silkie * featherChance * secondsPassed)) {
            gameState.feathers++;
            gameState.totalFeathers++;
        }
        gameState.reputation += gameState.chickens.rooster * 0.01 * secondsPassed;
        if (gameState.chickens.serama > 0 && Math.random() < (gameState.chickens.serama * 0.01 * secondsPassed)) {
            let cheapest = null;
            let minCost = Infinity;
            for(const id in CONFIG.UPGRADES) {
                const cost = calculateCost(CONFIG.UPGRADES[id].baseCost, gameState.upgrades[id], CONFIG.UPGRADES[id].exponent);
                if(cost < minCost) {
                    minCost = cost;
                    cheapest = id;
                }
            }
            if(cheapest) gameState.upgrades[cheapest]++;
        }

        updateUI();
        checkAchievements();
    }
    
    function updateUI() {
        eggCounter.textContent = `${formatNumber(gameState.eggs)} Eggs`;
        featherCounter.textContent = `${formatNumber(gameState.feathers)} Golden Feathers`;
        epsCounter.textContent = `per second: ${formatNumber(getEggsPerSecond())}`;
        epcCounter.textContent = `per click: ${formatNumber(getEggsPerClick())}`;

        for (const id in CONFIG.UPGRADES) {
            const upgrade = CONFIG.UPGRADES[id];
            const levelEl = document.getElementById(`${id}-level`);
            const costEl = document.getElementById(`${id}-cost`);
            const buttonEl = document.getElementById(`buy-${id}`);
            if (!levelEl || !costEl || !buttonEl) continue;

            levelEl.textContent = formatNumber(gameState.upgrades[id]);
            const cost = calculateCost(upgrade.baseCost, gameState.upgrades[id], upgrade.exponent);
            costEl.textContent = formatNumber(cost);
            buttonEl.disabled = gameState[upgrade.currency] < cost;
        }

        for (const id in CONFIG.CHICKENS) {
            const chicken = CONFIG.CHICKENS[id];
            const ownedEl = document.getElementById(`${id}-chickens`);
            const costEl = document.getElementById(`${id}-cost`);
            const buttonEl = document.getElementById(`buy-${id}`);
            if (!ownedEl || !costEl || !buttonEl) continue;

            ownedEl.textContent = formatNumber(gameState.chickens[id]);
            const cost = calculateCost(chicken.baseCost, gameState.chickens[id], chicken.exponent);
            costEl.textContent = formatNumber(cost);
            buttonEl.disabled = gameState.eggs < cost;
        }
        
        reputationPointsEl.textContent = formatNumber(gameState.reputation);
        reputationBonusEl.textContent = ((getReputationBonus() - 1) * 100).toFixed(0);
        prestigeButton.disabled = gameState.eggs < CONFIG.PRESTIGE_COST;
        
        if(gameState.event.active) {
            eventBanner.style.display = 'block';
            eventBanner.textContent = `${gameState.event.type}! ${Math.ceil(gameState.event.duration)}s left!`;
        } else {
            eventBanner.style.display = 'none';
        }
    }
    
    function renderAchievements() {
        achievementsList.innerHTML = '';
        Object.keys(achievements).forEach(id => {
            const ach = achievements[id];
            const isUnlocked = gameState.unlockedAchievements.includes(id);
            if(ach.hidden && !isUnlocked) return;

            const el = document.createElement('div');
            el.className = `p-2 rounded-lg transition-all duration-300 font-semibold flex justify-between items-center ${isUnlocked ? 'bg-yellow-300 text-yellow-800' : 'bg-gray-200 text-gray-500'}`;
            el.innerHTML = `<div><strong>${ach.name}</strong><p class="text-sm font-normal">${ach.description}</p></div>`;
            
            if (isUnlocked) {
                const shareIcon = document.createElement('span');
                shareIcon.innerHTML = `<svg class="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-3V6c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zM9 6h6v2H9V6zm11 12H4v-8h16v8zm-9-4h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>`;
                shareIcon.title = "Share Achievement";
                shareIcon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    generateAchievementScreenshot(id);
                });
                el.appendChild(shareIcon);
            }
            
            achievementsList.appendChild(el);
        });
    }
    
    function checkAchievements() {
        Object.keys(achievements).forEach(id => {
            if (!gameState.unlockedAchievements.includes(id) && achievementConditions[id]()) {
                gameState.unlockedAchievements.push(id);
                const ach = achievements[id];
                if (!ach.noToast) {
                    const title = 'Achievement Unlocked!';
                    showToast(title, ach.name);
                }
                renderAchievements();
            }
        });
    }
    
    function showToast(title, description) {
        toastTitle.textContent = title;
        toastDescription.textContent = description;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    };

    function spawnGoldenChicken() {
        const containerRect = coloredEggContainer.getBoundingClientRect();
        goldenChicken.style.top = `${Math.random() * (containerRect.height - 120)}px`;
        goldenChicken.style.left = `${Math.random() * (containerRect.width - 80)}px`;
        goldenChicken.style.display = 'block';
        goldenChicken.style.opacity = '1';
        setTimeout(() => {
            goldenChicken.style.opacity = '0';
            setTimeout(() => goldenChicken.style.display = 'none', 500);
        }, 5000);
    };

    function clickGoldenChicken(event) {
        const bonus = Math.max(getEggsPerClick() * 100, getEggsPerSecond() * 10 * 60);
        gameState.eggs += bonus;
        gameState.totalEggs += bonus;
        gameState.goldenChickensClicked++;
        showFloatingText(`+${formatNumber(bonus)}!`, event);
        goldenChicken.style.display = 'none';
    };
    
    function prestige() {
        if (gameState.eggs >= CONFIG.PRESTIGE_COST) {
            if(confirm(`Are you sure you want to sell the coop? This will reset your eggs, upgrades, and chickens for Reputation points.`)){
                const nickname = gameState.nickname;
                const eggsForPrestige = Math.floor(Math.sqrt(gameState.totalEggs / 1e11));
                const prestigeBuff = gameState.activeBuffs.prestigeBuff ? gameState.activeBuffs.prestigeBuff.value : 0;
                const newRep = gameState.reputation + Math.floor((eggsForPrestige > 0 ? eggsForPrestige : 1) * (1 + prestigeBuff));
                const prestigeCount = (gameState.prestigeCount || 0) + 1;
                const unlockedHidden = gameState.unlockedAchievements.filter(id => achievements[id]?.hidden);
                const permanentBonus = gameState.permanentBonus;
                
                let newGameState = deepMerge(initialGameState, {});
                newGameState.nickname = nickname;
                newGameState.reputation = newRep;
                newGameState.prestigeCount = prestigeCount;
                newGameState.unlockedAchievements = unlockedHidden;
                newGameState.permanentBonus = permanentBonus;
                gameState = newGameState;

                saveGame();
                location.reload();
            }
        }
    };
    
    function triggerEvent() {
        if(gameState.event.active) return;
        gameState.event = { active: true, type: "Feeding Frenzy", duration: 60, modifier: 2 };
    };

    function generateAchievementScreenshot(id) {
        if (!id || !achievements[id]) return;
        const ach = achievements[id];
        const nickname = gameState.nickname || "A Farmer";
        const timestamp = new Date().toLocaleString();
        document.getElementById('screenshot-nickname').textContent = nickname;
        document.getElementById('screenshot-ach-name').textContent = `"${ach.name}"`;
        document.getElementById('screenshot-ach-desc').textContent = ach.description;
        document.getElementById('screenshot-date').textContent = `Unlocked on ${timestamp}`;
        const template = document.getElementById('achievement-screenshot-template');
        html2canvas(template, { useCORS: true }).then(canvas => {
            const link = document.createElement('a');
            link.download = `chicken-clicker-achievement-${id}.png`;
            link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            link.click();
        });
    };

    initialize();
});
