// --- Single-File Merged JavaScript for Chicken Clicker ---

const CONFIG = {
    SAVE_KEY: 'chickenClickerSave_v2.9',
    GAME_VERSION: '2.93 (Clarity Update)',
    GAME_TICK_INTERVAL: 0.1,
    SAVE_INTERVAL: 5,
    GOLDEN_CHICKEN_SPAWN_INTERVAL: 60,
    RANDOM_EVENT_INTERVAL: 180,
    COLORED_EGG_ATTEMPT_INTERVAL: 15,
    COLORED_EGG_SPAWN_CHANCE: 10 / 240,
    PRESTIGE_COST: 1e12,
    UPGRADES: {
        worker: { name: 'Coop Worker', desc: 'Each level helps Leghorn Chickens produce +1 EPS.', baseCost: 10, exponent: 1.15, currency: 'eggs', color: 'green' },
        incubator: { name: 'Incubator', desc: 'Each level increases your base Eggs Per Click by +1.', baseCost: 50, exponent: 1.15, currency: 'eggs', color: 'blue' },
        loom: { name: 'Golden Loom', desc: 'Uses Golden Feathers to boost eggs per click by +25% per level.', baseCost: 10, exponent: 1.5, currency: 'feathers', color: 'yellow' },
        featherForecast: { name: 'Feather Forecast', desc: 'Increases Golden Feather find chance.', baseCost: 10000, exponent: 1.8, currency: 'eggs', color: 'gray' },
        eggstraClicks: { name: 'Eggstra Clicks', desc: 'Each click has a chance to be 10x stronger.', baseCost: 50000, exponent: 1.25, currency: 'eggs', color: 'pink' },
        cluckworkAutomation: { name: 'Cluckwork Automation', desc: 'Boosts EPS by 5% for every building owned.', baseCost: 1e6, exponent: 2, currency: 'eggs', color: 'purple' },
        peckingOrder: { name: 'Pecking Order', desc: 'A flat +10% boost to both clicks and EPS.', baseCost: 1e7, exponent: 1.5, currency: 'eggs', color: 'indigo' },
        nestEggIRA: { name: 'Nest Egg IRA', desc: 'Earn 0.1% of your base EPS as interest per second (capped).', baseCost: 1e9, exponent: 2.5, currency: 'eggs', color: 'teal' },
        fowlLanguage: { name: 'Fowl Language', desc: 'The chicken occasionally squawks insults. Essential.', baseCost: 1e12, exponent: 10, currency: 'eggs', color: 'red' },
        goldenCompass: { name: 'Golden Compass', desc: 'Increases the egg bonus from Golden Chickens by 25% per level.', baseCost: 25, exponent: 1.6, currency: 'feathers', color: 'yellow' },
        comfyCoopBedding: { name: 'Comfy Coop Bedding', desc: 'Increases the maximum offline progress time by 2 hours per level.', baseCost: 5e12, exponent: 2.2, currency: 'eggs', color: 'teal' },
        prismaticFeed: { name: 'Prismatic Feed', desc: 'Increases the duration of all Colored Egg buffs by 10% per level.', baseCost: 1e15, exponent: 2.5, currency: 'eggs', color: 'pink' }
    },
    CHICKENS: {
        leghorn: { name: 'Leghorn Chicken', desc: 'The backbone of your coop. Produces 1 egg/s per Coop Worker.', baseCost: 1000, exponent: 1.25, color: 'gray' },
        silkie: { name: 'Silkie Chicken', desc: 'Produces fewer eggs but has a chance to find Golden Feathers.', baseCost: 5000, exponent: 1.25, color: 'orange' },
        rooster: { name: 'Rooster', desc: 'Doesn\'t lay eggs. Grants a base of 1,000 Reputation on prestige instead.', baseCost: 1e6, exponent: 1.25, color: 'red', repValue: 1000 },
        orpington: { name: 'Orpington Oracle', desc: 'Grants a random egg bonus every 10 minutes.', baseCost: 1e8, exponent: 1.3, color: 'yellow' },
        wyandotte: { name: 'Wyandotte Warrior', desc: 'Increases Reputation gained on prestige by 5% per chicken.', baseCost: 1e10, exponent: 1.35, color: 'blue' },
        doja: { name: 'Doja Cow', desc: '"Moooove over!" Each click has a chance to be a "Super Click", granting 1 hour of EPS. Landing Super Clicks within 10 seconds of each other creates a chain, increasing the bonus by 10% each time!', baseCost: 5e12, exponent: 1.4, color: 'pink' },
        brahma: { name: 'Brahma Behemoth', desc: 'A gentle giant. Adds a massive +500% to your base EPS.', baseCost: 1e15, exponent: 1.45, color: 'green' },
        serama: { name: 'Serama Sorcerer', desc: 'Has a chance to grant a free upgrade level.', baseCost: 1e18, exponent: 1.5, color: 'purple' },
        banty: { name: 'Banty Chicken', desc: 'The king. Provides a +10% multiplicative bonus to ALL production.', baseCost: 1e21, exponent: 1.6, color: 'indigo' }
    },
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
const FOWL_INSULTS = [
    "Peck off!",
    "Cluck you!",
    "Is that all you've got?",
    "My grandmother clicks harder.",
    "You call that a click?",
    "Bawk-bawk-BUM!",
    "Don't ruffle my feathers.",
];
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
    firstInsult: { name: "Ruffled Feathers", description: "Witness the chicken's dark side for the first time.", bonus: 1.01, hidden: true },
};
const achievementConditions = {
    click1: (gs) => gs.totalClicks >= 1, click1k: (gs) => gs.totalClicks >= 1000, click100k: (gs) => gs.totalClicks >= 100000, click1M: (gs) => gs.totalClicks >= 1e6,
    egg1k: (gs) => gs.totalEggs >= 1000, egg1M: (gs) => gs.totalEggs >= 1e6, egg1B: (gs) => gs.totalEggs >= 1e9, egg1T: (gs) => gs.totalEggs >= 1e12,
    worker25: (gs) => gs.upgrades.worker >= 25, worker100: (gs) => gs.upgrades.worker >= 100,
    incubator25: (gs) => gs.upgrades.incubator >= 25, incubator100: (gs) => gs.upgrades.incubator >= 100,
    loom1: (gs) => gs.upgrades.loom >= 1, loom10: (gs) => gs.upgrades.loom >= 10,
    featherForecast1: (gs) => gs.upgrades.featherForecast >= 1, eggstraClicks1: (gs) => gs.upgrades.eggstraClicks >= 1,
    cluckworkAutomation1: (gs) => gs.upgrades.cluckworkAutomation >= 1, peckingOrder1: (gs) => gs.upgrades.peckingOrder >= 1,
    nestEggIRA1: (gs) => gs.upgrades.nestEggIRA >= 1, fowlLanguage1: (gs) => gs.upgrades.fowlLanguage >= 1,
    silkie1: (gs) => gs.chickens.silkie >= 1, rooster1: (gs) => gs.chickens.rooster >= 1,
    orpington1: (gs) => gs.chickens.orpington >= 1, wyandotte1: (gs) => gs.chickens.wyandotte >= 1,
    doja1: (gs) => gs.chickens.doja >= 1, brahma1: (gs) => gs.chickens.brahma >= 1,
    serama1: (gs) => gs.chickens.serama >= 1, banty1: (gs) => gs.chickens.banty >= 1,
    secondChance: (gs) => gs.prestigeCount >= 1, eternalFarmer: (gs) => gs.prestigeCount >= 10, prestigeWorldwide: (gs) => gs.prestigeCount >= 25,
    goldenTouch: (gs) => gs.goldenChickensClicked >= 1, goldRush: (gs) => gs.goldenChickensClicked >= 10, goldFever: (gs) => gs.goldenChickensClicked >= 50,
    eggGreen: (gs) => gs.clickedColoredEggs['green'], eggRed: (gs) => gs.clickedColoredEggs['red'], eggPink: (gs) => gs.clickedColoredEggs['pink'],
    eggOrange: (gs) => gs.clickedColoredEggs['orange'], eggYellow: (gs) => gs.clickedColoredEggs['yellow'], eggWhite: (gs) => gs.clickedColoredEggs['white'],
    eggBlack: (gs) => gs.clickedColoredEggs['black'], eggBlue: (gs) => gs.clickedColoredEggs['blue'], eggPurple: (gs) => gs.clickedColoredEggs['purple'],
    eggGold: (gs) => gs.clickedColoredEggs['gold'],
    impatient: (gs) => gs.failedBuys >= 50, license: (gs) => gs.licenseClicked, reset: (gs) => gs.resets > 0,
    lazy: (gs) => gs.totalClicks === 0 && gs.timePlayed >= 120,
    loner: (gs) => gs.totalEggs >= 1e6 && gs.upgrades.worker === 0,
    afk: (gs) => gs.timeSinceLastClick >= 900,
    indecisive: (gs) => gs.modalOpens >= 50,
    justTheBasics: (gs) => gs.totalEggs >= 1e7 && Object.keys(gs.chickens).every(c => c === 'leghorn' || gs.chickens[c] === 0),
    allUpgrades: (gs) => Object.keys(CONFIG.UPGRADES).every(u => gs.upgrades[u] > 0),
    allChickens: (gs) => Object.keys(CONFIG.CHICKENS).every(c => gs.chickens[c] > 0),
    eggCollector: (gs) => Object.keys(CONFIG.COLORED_EGGS).every(c => gs.clickedColoredEggs[c]),
    firstInsult: (gs) => gs.firstInsultFired,
};

// --- utils.js content ---
function formatNumber(num) {
    if (num === null || isNaN(num) || !isFinite(num)) return '0';
    if (num < 1000) return num.toFixed(0);
    const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];
    const i = Math.floor(Math.log10(num) / 3);
    if (i >= suffixes.length) return num.toExponential(2);
    return (num / Math.pow(1000, i)).toFixed(2) + suffixes[i];
}
function calculateCost(base, level, exponent = 1.15, gameState) {
    let cost = Math.floor(base * Math.pow(exponent, level));
    if (gameState && gameState.activeBuffs.discount) {
        cost = Math.floor(cost * (1 - gameState.activeBuffs.discount.value));
    }
    return cost;
}
function generateAchievementScreenshot(id, gameState) {
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
const getAchievementBonus = (gs) => {
    const totalBonus = gs.unlockedAchievements.reduce((sum, id) => {
        const bonusValue = achievements[id]?.bonus || 1;
        return sum + (bonusValue - 1);
    }, 0);
    return 1 + totalBonus;
};
const getReputationBonus = (gs) => 1 + (gs.reputation || 0) * 0.05;
const getEventModifier = (gs) => gs.event.active ? gs.event.modifier : 1;
const getBuffModifier = (gs, buffType, defaultValue = 1) => {
    const buff = gs.activeBuffs[buffType];
    if (buff && buff.duration > 0) {
        return buff.value;
    }
    return defaultValue;
};
const getBoostMultiplier = (gs) => getBuffModifier(gs, 'boostMultiplier');
const getBaseEggsPerSecond = (gs) => {
    let baseEps = gs.upgrades.worker * gs.chickens.leghorn * 1;
    baseEps += gs.chickens.brahma * (baseEps * 5);
    return baseEps;
}
const getEggsPerSecond = (gs) => {
    const baseEps = getBaseEggsPerSecond(gs);
    const interestCap = baseEps > 0 ? baseEps * 10 : 1000;
    const nestEggInterest = gs.upgrades.nestEggIRA > 0 ? Math.min(baseEps * 0.001 * gs.upgrades.nestEggIRA, interestCap) : 0;
    const peckingOrderBonus = 1 + (gs.upgrades.peckingOrder * 0.1);
    const bantyBonus = Math.pow(1.1, gs.chickens.banty);
    const totalBuildings = Object.values(gs.upgrades).reduce((a, b) => a + b, 0) + Object.values(gs.chickens).reduce((a, b) => a + b, 0);
    const cluckworkBonus = 1 + (gs.upgrades.cluckworkAutomation * 0.05 * totalBuildings);
    return (baseEps + nestEggInterest) * getAchievementBonus(gs) * getReputationBonus(gs) * getEventModifier(gs) * getBoostMultiplier(gs) * gs.permanentBonus * peckingOrderBonus * bantyBonus * cluckworkBonus;
};
const getEggsPerClick = (gs) => {
    const loomBoost = 1 + (gs.upgrades.loom * 0.25);
    const baseEpc = 1 + gs.upgrades.incubator;
    const peckingOrderBonus = 1 + (gs.upgrades.peckingOrder * 0.1);
    const bantyBonus = Math.pow(1.1, gs.chickens.banty);
    return Math.floor(baseEpc * loomBoost * getAchievementBonus(gs) * getReputationBonus(gs) * getEventModifier(gs) * getBoostMultiplier(gs) * gs.permanentBonus * peckingOrderBonus * bantyBonus * getBuffModifier(gs, 'clickFrenzy'));
};

function getPrestigeCost(gs) {
    const baseCost = CONFIG.PRESTIGE_COST;
    const prestigeCount = gs.prestigeCount || 0;
    return baseCost * Math.pow(2, prestigeCount);
}

// --- ui.js content ---
const elements = {
    nicknameInput: document.getElementById('nickname-input'),
    chicken: document.getElementById('chicken'),
    eggCounter: document.getElementById('egg-counter'),
    featherCounter: document.getElementById('feather-counter'),
    epsCounter: document.getElementById('eggs-per-second'),
    epcCounter: document.getElementById('eggs-per-click'),
    achievementsList: document.getElementById('achievements-list'),
    goldenChicken: document.getElementById('golden-chicken'),
    toast: document.getElementById('achievement-toast'),
    toastTitle: document.getElementById('toast-title'),
    toastDescription: document.getElementById('toast-description'),
    prestigeButton: document.getElementById('prestige-button'),
    reputationPointsEl: document.getElementById('reputation-points'),
    reputationBonusEl: document.getElementById('reputation-bonus'),
    resetButton: document.getElementById('reset-button'),
    licenseSummary: document.getElementById('license-summary'),
    eventBanner: document.getElementById('event-banner'),
    nameModal: document.getElementById('name-modal'),
    initialNicknameInput: document.getElementById('initial-nickname-input'),
    startGameBtn: document.getElementById('start-game-btn'),
    playerNameDisplay: document.getElementById('player-name-display'),
    upgradesListContainer: document.getElementById('upgrades-list'),
    coopListContainer: document.getElementById('coop-list'),
    coloredEggContainer: document.getElementById('colored-egg-container'),
    versionNumberEl: document.getElementById('version-number'),
    exportSaveClipboardBtn: document.getElementById('export-save-clipboard'),
    exportSaveFileBtn: document.getElementById('export-save-file'),
    importSaveText: document.getElementById('import-save-text'),
    importSaveTextBtn: document.getElementById('import-save-text-btn'),
    importSaveFileBtn: document.getElementById('import-save-file-btn'),
    importFileInput: document.getElementById('import-file-input'),
};
function buildUpgradeShop() {
    elements.upgradesListContainer.innerHTML = '';
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
        elements.upgradesListContainer.appendChild(el);
    }
}
function buildCoop() {
    elements.coopListContainer.innerHTML = '';
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
        elements.coopListContainer.appendChild(el);
    }
}
function updateUI(gameState) {
    elements.eggCounter.textContent = `${formatNumber(gameState.eggs)} Eggs`;
    elements.featherCounter.textContent = `${formatNumber(gameState.feathers)} Golden Feathers`;
    elements.epsCounter.textContent = `per second: ${formatNumber(getEggsPerSecond(gameState))}`;
    elements.epcCounter.textContent = `per click: ${formatNumber(getEggsPerClick(gameState))}`;

    for (const id in CONFIG.UPGRADES) {
        const upgrade = CONFIG.UPGRADES[id];
        const levelEl = document.getElementById(`${id}-level`);
        const costEl = document.getElementById(`${id}-cost`);
        const buttonEl = document.getElementById(`buy-${id}`);
        if (!levelEl || !costEl || !buttonEl) continue;

        levelEl.textContent = formatNumber(gameState.upgrades[id]);
        const cost = calculateCost(upgrade.baseCost, gameState.upgrades[id], upgrade.exponent, gameState);
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
        const cost = calculateCost(chicken.baseCost, gameState.chickens[id], chicken.exponent, gameState);
        costEl.textContent = formatNumber(cost);
        buttonEl.disabled = gameState.eggs < cost;
    }
    
    elements.reputationPointsEl.textContent = formatNumber(gameState.reputation);
    elements.reputationBonusEl.textContent = ((getReputationBonus(gameState) - 1) * 100).toFixed(0);

    const requiredPrestigeCost = getPrestigeCost(gameState);
    const prestigeCostTextEl = document.getElementById('prestige-cost-text');
    if (prestigeCostTextEl) {
         prestigeCostTextEl.textContent = `Reset progress for a permanent production boost. Requires ${formatNumber(requiredPrestigeCost)} eggs.`;
    }
    elements.prestigeButton.disabled = gameState.eggs < requiredPrestigeCost;

    const achBonus = getAchievementBonus(gameState);
    const repBonus = getReputationBonus(gameState);
    const permBonus = gameState.permanentBonus;

    const achBonusUI = document.getElementById('achievement-bonus-ui');
    const permBonusUI = document.getElementById('permanent-bonus-ui');
    const totalMultiplierUI = document.getElementById('total-multiplier-ui');

    if (achBonusUI) achBonusUI.textContent = `+${((achBonus - 1) * 100).toFixed(0)}`;
    if (permBonusUI) permBonusUI.textContent = `x${permBonus.toFixed(2)}`;
    if (totalMultiplierUI) totalMultiplierUI.textContent = `x${(achBonus * repBonus * permBonus).toFixed(2)}`;

    if(gameState.event.active) {
        elements.eventBanner.style.display = 'block';
        elements.eventBanner.textContent = `${gameState.event.type}! ${Math.ceil(gameState.event.duration)}s left!`;
    } else {
        elements.eventBanner.style.display = 'none';
    }

    const blueprintsLevelEl = document.getElementById('ancestralBlueprints-level');
    const blueprintsCostEl = document.getElementById('ancestralBlueprints-cost');
    const buyBlueprintsBtn = document.getElementById('buy-ancestralBlueprints');
    if (blueprintsLevelEl) {
        const level = gameState.prestigeUpgrades.ancestralBlueprints;
        const cost = 10 * Math.pow(2, level);
        blueprintsLevelEl.textContent = level;
        blueprintsCostEl.textContent = formatNumber(cost);
        buyBlueprintsBtn.disabled = gameState.reputation < cost;
    }

    updateEggEffectsBanner(gameState);
}

function updateEggEffectsBanner(gameState) {
  const banner = document.getElementById('egg-effects-banner');
  banner.innerHTML = '';
  // Only consider buffs with duration > 0 (active timed buffs)
  const activeBuffs = Object.entries(gameState.activeBuffs)
    .filter(([effect, buff]) => buff.duration > 0);

  if (activeBuffs.length === 0) {
    banner.style.display = 'none';
    return;
  }

  banner.style.display = 'flex';
  activeBuffs.forEach(([effect, buff]) => {
    // Find the egg config to get color and icon
    const eggEntry = Object.entries(CONFIG.COLORED_EGGS).find(([k, egg]) => egg.effect === effect);
    const color = eggEntry ? eggEntry[1].color : '#e2e8f0';
    const name = effect.charAt(0).toUpperCase() + effect.slice(1).replace(/([A-Z])/g, ' $1');

    const pill = document.createElement('span');
    pill.className = 'egg-effect-pill';
    pill.style.background = color + "22"; // transparent background
    pill.style.border = `2px solid ${color}`;
    pill.innerHTML = `<span class="icon" style="color:${color}">🥚</span> ${name}: ${Math.ceil(buff.duration)}s`;
    banner.appendChild(pill);
  });
}

function renderAchievements(gameState) {
    elements.achievementsList.innerHTML = '';
    Object.keys(achievements).forEach(id => {
        const ach = achievements[id];
        const isUnlocked = gameState.unlockedAchievements.includes(id);
        if (ach.hidden && !isUnlocked) return;

        const el = document.createElement('div');
        el.className = `p-2 rounded-lg transition-all duration-300 font-semibold ${isUnlocked ? 'bg-yellow-300 text-yellow-800' : 'bg-gray-200 text-gray-500'}`;

        let progressHtml = '';
        if (!isUnlocked) {
            const condition = achievementConditions[id];
            const conditionStr = condition.toString();
            const match = conditionStr.match(/gs\.(totalClicks|totalEggs|upgrades\.(\w+)|chickens\.(\w+)|goldenChickensClicked)\s*>=\s*([\d.e+]+)/);
            if (match) {
                const key = match[1];
                const target = parseFloat(match[4]);
                let current = 0;
                if (key.startsWith('upgrades.')) {
                    current = gameState.upgrades[match[2]] || 0;
                } else if (key.startsWith('chickens.')) {
                    current = gameState.chickens[match[3]] || 0;
                } else {
                    current = gameState[key] || 0;
                }
                const progress = Math.min(current / target, 1);
                if (progress > 0) {
                    progressHtml = `
                        <div class="achievement-progress-bar">
                            <div class="achievement-progress" style="width: ${progress * 100}%"></div>
                        </div>
                        <p class="text-xs text-gray-600 text-right mt-1">${formatNumber(current)} / ${formatNumber(target)}</p>
                    `;
                }
            }
        }

        el.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <strong>${ach.name}</strong>
                    <p class="text-sm font-normal">${ach.description}</p>
                </div>
                ${isUnlocked ? `<span id="share-${id}" class="cursor-pointer hover:scale-110 transition-transform"><svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-3V6c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zM9 6h6v2H9V6zm11 12H4v-8h16v8zm-9-4h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg></span>` : ''}
            </div>
            ${progressHtml}
        `;

        elements.achievementsList.appendChild(el);

        if (isUnlocked) {
            const shareIcon = el.querySelector(`#share-${id}`);
            if (shareIcon) {
                shareIcon.title = "Share Achievement";
                shareIcon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    generateAchievementScreenshot(id, gameState);
                });
            }
        }
    });
}
function showToast(title, description) {
    elements.toastTitle.textContent = title;
    elements.toastDescription.textContent = description;
    elements.toast.classList.add('show');
    setTimeout(() => elements.toast.classList.remove('show'), 4000);
};
function showFloatingText(text, event, isSuper = false) {
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

// --- game.js content ---
let gameState = {};
const initialGameState = {
    nickname: null, eggs: 0, totalEggs: 0, feathers: 0, totalFeathers: 0, totalClicks: 0,
    upgrades: {
        worker: 0, incubator: 0, loom: 0, featherForecast: 0, eggstraClicks: 0, 
        cluckworkAutomation: 0, peckingOrder: 0, nestEggIRA: 0, fowlLanguage: 0,
        goldenCompass: 0, comfyCoopBedding: 0, prismaticFeed: 0
    },
    chickens: { 
        leghorn: 1, silkie: 0, rooster: 0, orpington: 0, wyandotte: 0, doja: 0,
        brahma: 0, serama: 0, banty: 0
    },
    unlockedAchievements: [], reputation: 0, timePlayed: 0, failedBuys: 0, licenseClicked: false,
    goldenChickensClicked: 0, prestigeCount: 0, resets: 0,
    event: { active: false, type: null, duration: 0, modifier: 1 },
    activeBuffs: {}, permanentBonus: 1, clickedColoredEggs: {},
    oracleTimer: 0,
    lastSuperClickTime: 0, superClickChain: 0, modalOpens: 0, timeSinceLastClick: 0,
    firstInsultFired: false,
    prestigeUpgrades: { ancestralBlueprints: 0 },
};

function clickChicken(event) {
    let epc = getEggsPerClick(gameState);
    if (gameState.upgrades.eggstraClicks > 0 && Math.random() < (gameState.upgrades.eggstraClicks * 0.05)) {
        epc *= 10;
    }
    gameState.eggs += epc;
    gameState.totalEggs += epc;
    showFloatingText(`+${formatNumber(epc)}`, event);
    
    // Check for Fowl Language upgrade and occasionally show an insult
    if (gameState.upgrades.fowlLanguage > 0 && Math.random() < 0.00008333) { 
        const insult = FOWL_INSULTS[Math.floor(Math.random() * FOWL_INSULTS.length)];
        const el = document.createElement('div');
        el.className = 'floating-insult'; // Use the new CSS class
        el.textContent = insult;

		const chickenContainer = document.querySelector('.chicken-container');
		if (chickenContainer) {
			chickenContainer.appendChild(el);
			const containerRect = chickenContainer.getBoundingClientRect();
			// Center horizontally
			el.style.left = `${(containerRect.width / 2) - (el.offsetWidth / 2)}px`;
			// Place above the chicken's head; adjust -40 or -50 as needed for visual fit
			el.style.top = `10px`;
			setTimeout(() => {
				if (el.parentElement) {
					el.parentElement.removeChild(el);
				}
			}, 1450);
		}
        gameState.firstInsultFired = true;
    }

    const superClickChance = (gameState.chickens.doja * 0.001) * (gameState.activeBuffs.superClickFrenzy ? gameState.activeBuffs.superClickFrenzy.value : 1);
    if (gameState.chickens.doja > 0 && Math.random() < superClickChance) {
        const now = Date.now();
        if (now - gameState.lastSuperClickTime < 10000) {
            gameState.superClickChain++;
        } else {
            gameState.superClickChain = 0;
        }
        gameState.lastSuperClickTime = now;
        const superClickBonus = (getEggsPerSecond(gameState) * 3600) * (1 + gameState.superClickChain * 0.1);
        gameState.eggs += superClickBonus;
        gameState.totalEggs += superClickBonus;
        showFloatingText(`+${formatNumber(superClickBonus)}!`, event, true);
    }
    gameState.totalClicks++;
    gameState.timeSinceLastClick = 0;
}

function buyUpgrade(id) {
    const upgrade = CONFIG.UPGRADES[id];
    const cost = calculateCost(upgrade.baseCost, gameState.upgrades[id], upgrade.exponent, gameState);
    if (gameState[upgrade.currency] >= cost) {
        gameState[upgrade.currency] -= cost;
        gameState.upgrades[id]++;
    } else {
        gameState.failedBuys++;
    }
}

function buyChicken(id) {
    const chicken = CONFIG.CHICKENS[id];
    const cost = calculateCost(chicken.baseCost, gameState.chickens[id], chicken.exponent, gameState);
    if (gameState.eggs >= cost) {
        gameState.eggs -= cost;
        gameState.chickens[id]++;
    } else {
        gameState.failedBuys++;
    }
}

function spawnGoldenChicken() {
    const containerRect = elements.coloredEggContainer.getBoundingClientRect();
    elements.goldenChicken.style.top = `${Math.random() * (containerRect.height - 120)}px`;
    elements.goldenChicken.style.left = `${Math.random() * (containerRect.width - 80)}px`;
    elements.goldenChicken.style.display = 'block';
    elements.goldenChicken.style.opacity = '1';
    setTimeout(() => {
        elements.goldenChicken.style.opacity = '0';
        setTimeout(() => elements.goldenChicken.style.display = 'none', 500);
    }, 5000);
}

function clickGoldenChicken(event) {
    const compassBonus = 1 + (gameState.upgrades.goldenCompass * 0.25);
    const bonus = Math.max(getEggsPerClick(gameState) * 100, getEggsPerSecond(gameState) * 10 * 60) * compassBonus;
    gameState.eggs += bonus;
    gameState.totalEggs += bonus;
    gameState.goldenChickensClicked++;
    showFloatingText(`+${formatNumber(bonus)}!`, event);
    elements.goldenChicken.style.display = 'none';
}

function spawnColoredEgg() {
    if (Math.random() > CONFIG.COLORED_EGG_SPAWN_CHANCE) return;
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
            const containerRect = elements.coloredEggContainer.getBoundingClientRect();
            eggEl.style.top = `${Math.random() * (containerRect.height - 120)}px`;
            eggEl.style.left = `${Math.random() * (containerRect.width - 40)}px`;
            eggEl.style.display = 'block';
            eggEl.addEventListener('click', () => { applyEggEffect(id); eggEl.remove(); }, { once: true });
            elements.coloredEggContainer.appendChild(eggEl);
            setTimeout(() => { if (eggEl.parentElement) eggEl.parentElement.removeChild(eggEl); }, 10000);
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
        case 'discount': bonusDescription = `Next ${egg.duration} upgrades are ${egg.value * 100}% cheaper!`; break;
        case 'clickFrenzy': bonusDescription = `Click power is ${egg.value}x for ${egg.duration} seconds!`; break;
        case 'instantGain': const gain = getEggsPerSecond(gameState) * egg.value; gameState.eggs += gain; gameState.totalEggs += gain; bonusDescription = `Instantly gained ${formatNumber(gain)} eggs!`; break;
        case 'featherFrenzy': bonusDescription = `Golden Feather chance is doubled for ${egg.duration / 60} minutes!`; break;
        case 'goldRush': bonusDescription = `A rush of ${egg.value} Golden Chickens has appeared!`; for(let i=0; i<egg.value; i++) spawnGoldenChicken(); break;
        case 'boostMultiplier': bonusDescription = `All egg production is doubled for ${egg.duration} seconds!`; break;
        case 'superClickFrenzy': bonusDescription = `Super Click chance is doubled for ${egg.duration} seconds!`; break;
        case 'prestigeBuff': bonusDescription = `Your next prestige will grant an extra ${egg.value * 100}% Reputation!`; break;
        case 'prestigePercent': const prestigeGain = CONFIG.PRESTIGE_COST * egg.value; gameState.eggs += prestigeGain; gameState.totalEggs += prestigeGain; bonusDescription = `Gained ${formatNumber(prestigeGain)} eggs toward your next prestige!`; break;
        case 'permanentBonus': bonusDescription = `Permanently increased all egg production by ${egg.value * 100}%!`; break;
    }
    showToast(bonusTitle, bonusDescription);

    if (egg.duration > 0) {
        const durationBonus = 1 + (gameState.upgrades.prismaticFeed * 0.10);
        const newDuration = egg.duration * durationBonus;
        gameState.activeBuffs[egg.effect] = { value: egg.value, duration: newDuration };
    } else if (egg.effect === 'permanentBonus') {
        gameState.permanentBonus += egg.value;
    } else if (egg.effect === 'prestigeBuff') {
        gameState.activeBuffs[egg.effect] = { value: (gameState.activeBuffs[egg.effect]?.value || 0) + egg.value };
    }
    checkAchievements();
}

function saveGame() { localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(gameState)); }
function loadGame() {
    const savedState = localStorage.getItem(CONFIG.SAVE_KEY);
    gameState = savedState ? JSON.parse(savedState) : { ...initialGameState };
    gameState = deepMerge(initialGameState, gameState);

    const resetCount = localStorage.getItem('chickenClickerResetCount');
    if (resetCount) {
        gameState.resets = parseInt(resetCount, 10);
        localStorage.removeItem('chickenClickerResetCount');
    }

    if (!gameState.nickname) {
        elements.nameModal.style.display = 'flex';
    } else {
        elements.playerNameDisplay.textContent = gameState.nickname;
    }
    elements.nicknameInput.value = gameState.nickname;
}
function deepMerge(target, source) {
    const output = { ...target };
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) Object.assign(output, { [key]: source[key] });
                else output[key] = deepMerge(target[key], source[key]);
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}
function isObject(item) { return (item && typeof item === 'object' && !Array.isArray(item)); }
function hardReset() {
    if (confirm("Are you sure you want to completely reset your game? This cannot be undone.")) {
        localStorage.setItem('chickenClickerResetCount', (gameState.resets || 0) + 1);
        localStorage.removeItem(CONFIG.SAVE_KEY);
        location.reload();
    }
}

function exportSave(toFile = false) {
    try {
        const saveString = btoa(JSON.stringify(gameState));
        if (toFile) {
            const blob = new Blob([saveString], {type: "text/plain;charset=utf-8"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `chicken_clicker_save_${Date.now()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast("Success", "Save file downloaded!");
        } else {
            navigator.clipboard.writeText(saveString).then(() => {
                showToast("Success", "Save data copied to clipboard!");
            }, () => {
                showToast("Error", "Could not copy to clipboard.");
            });
        }
    } catch (e) {
        showToast("Error", "Could not export save data.");
        console.error("Export failed:", e);
    }
}

function importSave(saveString) {
    if (!saveString) {
        showToast("Error", "No save data provided.");
        return;
    }
    try {
        const decodedString = atob(saveString);
        const newGameState = JSON.parse(decodedString);
        
        if (typeof newGameState.eggs !== 'number' || typeof newGameState.upgrades.worker !== 'number') {
            throw new Error("Invalid save file structure.");
        }

        localStorage.setItem(CONFIG.SAVE_KEY, decodedString);
        showToast("Success", "Game imported! Reloading...");
        setTimeout(() => location.reload(), 1500);

    } catch (e) {
        showToast("Error", "Invalid or corrupt save data.");
        console.error("Import failed:", e);
    }
}

function calculateOfflineProgress() {
    const lastTime = localStorage.getItem('chickenClickerExitTime');
    if (!lastTime) return;

    localStorage.removeItem('chickenClickerExitTime');

    let offlineSeconds = (Date.now() - parseInt(lastTime, 10)) / 1000;
    if (offlineSeconds <= 10) return;

    const maxOfflineSeconds = 86400 + (gameState.upgrades.comfyCoopBedding * 7200);
    offlineSeconds = Math.min(offlineSeconds, maxOfflineSeconds);

    const offlineEps = getEggsPerSecond(gameState);
    const eggsGained = Math.floor(offlineEps * offlineSeconds);
    
    const featherChancePerSecond = (gameState.chickens.silkie * (0.1 + (gameState.upgrades.featherForecast * 0.01)));
    const feathersGained = Math.floor(featherChancePerSecond * offlineSeconds);

    const repChancePerSecond = gameState.chickens.rooster * 0.01;
    const repGained = repChancePerSecond * offlineSeconds;

    if (eggsGained <= 0 && feathersGained <= 0 && repGained <= 0) return;

    gameState.eggs += eggsGained;
    gameState.totalEggs += eggsGained;
    gameState.feathers += feathersGained;
    gameState.reputation += repGained;

    const timeAwayHours = Math.floor(offlineSeconds / 3600);
    const timeAwayMinutes = Math.floor((offlineSeconds % 3600) / 60);
    document.getElementById('offline-time').textContent = `${timeAwayHours}h ${timeAwayMinutes}m`;
    
    const offlineEggsLine = document.getElementById('offline-eggs-line');
    if (eggsGained > 0) {
        offlineEggsLine.textContent = `+${formatNumber(eggsGained)} Eggs`;
        offlineEggsLine.classList.remove('hidden');
    }

    const offlineFeathersLine = document.getElementById('offline-feathers-line');
     if (feathersGained > 0) {
        offlineFeathersLine.textContent = `+${formatNumber(feathersGained)} Golden Feathers`;
        offlineFeathersLine.classList.remove('hidden');
    }

    const offlineRepLine = document.getElementById('offline-rep-line');
     if (repGained > 0) {
        offlineRepLine.textContent = `+${formatNumber(repGained)} Reputation`;
        offlineRepLine.classList.remove('hidden');
    }

    document.getElementById('offline-progress-modal').style.display = 'flex';
}


function gameLoop() {
    try {
        const secondsPassed = CONFIG.GAME_TICK_INTERVAL;
        const eps = getEggsPerSecond(gameState);
        gameState.eggs += eps * secondsPassed;
        gameState.totalEggs += eps * secondsPassed;
        gameState.timePlayed += secondsPassed;
        gameState.timeSinceLastClick = (gameState.timeSinceLastClick || 0) + secondsPassed;
        const activeBuffKeys = Object.keys(gameState.activeBuffs);
        for (const buffKey of activeBuffKeys) {
            const buff = gameState.activeBuffs[buffKey];
            // Ensure buff exists and has a positive, numeric duration before acting on it.
            if (buff && typeof buff.duration === 'number' && buff.duration > 0) {
                buff.duration -= secondsPassed;
                if (buff.duration <= 0) {
                    delete gameState.activeBuffs[buffKey];
                }
            }
        }
        if(gameState.event.active) {
            gameState.event.duration -= secondsPassed;
            if(gameState.event.duration <= 0) gameState.event.active = false;
        }
        const featherChance = 0.1 + (gameState.upgrades.featherForecast * 0.01);
        const featherFrenzyBonus = getBuffModifier(gameState, 'featherFrenzy');
        if(Math.random() < (gameState.chickens.silkie * featherChance * featherFrenzyBonus * secondsPassed)) {
            gameState.feathers++;
            gameState.totalFeathers++;
        }
        gameState.reputation += gameState.chickens.rooster * 0.01 * secondsPassed;
        if (gameState.chickens.serama > 0 && Math.random() < (gameState.chickens.serama * 0.01 * secondsPassed)) {
            let cheapest = null, minCost = Infinity;
            for(const id in CONFIG.UPGRADES) {
                const cost = calculateCost(CONFIG.UPGRADES[id].baseCost, gameState.upgrades[id], CONFIG.UPGRADES[id].exponent, gameState);
                if(cost < minCost) { minCost = cost; cheapest = id; }
            }
            if(cheapest) gameState.upgrades[cheapest]++;
        }

        if (gameState.chickens.orpington > 0) {
            gameState.oracleTimer = (gameState.oracleTimer || 0) + secondsPassed;
            if (gameState.oracleTimer >= 600) {
                const oracles = gameState.chickens.orpington;
                const baseBonus = getEggsPerSecond(gameState) * 1800;
                const randomMultiplier = Math.random() + 0.5;
                const totalBonus = Math.floor(baseBonus * oracles * randomMultiplier);

                if (totalBonus > 0) {
                    gameState.eggs += totalBonus;
                    gameState.totalEggs += totalBonus;
                    showToast("Oracle's Blessing!", `Your Orpington Oracles granted you ${formatNumber(totalBonus)} eggs!`);
                }
                gameState.oracleTimer = 0;
            }
        }

        updateUI(gameState);
        checkAchievements();
    } catch (error) {
        console.error("Game loop crashed:", error);
    }
}

function checkAchievements() {
    Object.keys(achievements).forEach(id => {
        if (!gameState.unlockedAchievements.includes(id) && achievementConditions[id](gameState)) {
            gameState.unlockedAchievements.push(id);
            const ach = achievements[id];
            if (!ach.noToast) showToast('Achievement Unlocked!', ach.name);
            renderAchievements(gameState);
        }
    });
}

function prestige() {
    const requiredCost = getPrestigeCost(gameState);
    if (gameState.eggs >= requiredCost) {
        if(confirm(`Are you sure you want to sell the coop? This will reset your eggs, upgrades, and chickens for Reputation points.`)){
            const { nickname, unlockedAchievements, permanentBonus, resets, prestigeUpgrades } = gameState;
            const eggsForPrestige = Math.floor(Math.sqrt(gameState.totalEggs / 1e11));
            const prestigeBuff = gameState.activeBuffs.prestigeBuff ? gameState.activeBuffs.prestigeBuff.value : 0;

            const reputationFromEggs = Math.floor((eggsForPrestige > 0 ? eggsForPrestige : 1) * (1 + prestigeBuff));
            const reputationFromRoosters = (gameState.chickens.rooster || 0) * (CONFIG.CHICKENS.rooster.repValue || 0);
            const totalReputationGained = reputationFromEggs + reputationFromRoosters;

            const wyandotteBonus = 1 + (gameState.chickens.wyandotte * 0.05);
            const finalGainedRep = Math.floor(totalReputationGained * wyandotteBonus);

            let newRep = (gameState.reputation || 0) + finalGainedRep;

            if (!isFinite(newRep)) {
                newRep = gameState.reputation || 0;
            }

            const prestigeCount = (gameState.prestigeCount || 0) + 1;
            const unlockedHidden = unlockedAchievements.filter(id => achievements[id]?.hidden);
            
            let newGameState = deepMerge(initialGameState, {});
            newGameState.nickname = nickname;
            newGameState.reputation = newRep;
            newGameState.prestigeCount = prestigeCount;
            newGameState.unlockedAchievements = unlockedHidden;
            newGameState.permanentBonus = permanentBonus;
            newGameState.resets = resets;
            newGameState.prestigeUpgrades = prestigeUpgrades;

            if (newGameState.prestigeUpgrades.ancestralBlueprints > 0) {
                newGameState.upgrades.worker = newGameState.prestigeUpgrades.ancestralBlueprints * 5;
            }

            gameState = newGameState;

            saveGame();
            location.reload();
        }
    }
}

function triggerEvent() {
    if(gameState.event.active) return;
    gameState.event = { active: true, type: "Feeding Frenzy", duration: 60, modifier: 2 };
}

function setupEventListeners() {
    elements.startGameBtn.addEventListener('click', () => {
        const name = elements.initialNicknameInput.value.trim();
        if (name) {
            gameState.nickname = name;
            elements.nicknameInput.value = name;
            elements.nameModal.style.display = 'none';
            elements.playerNameDisplay.textContent = name;
            saveGame();
        }
    });
    elements.chicken.addEventListener('click', clickChicken);
    elements.goldenChicken.addEventListener('click', clickGoldenChicken);
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
    elements.nicknameInput.addEventListener('change', (e) => { 
        gameState.nickname = e.target.value || "A Farmer";
        elements.playerNameDisplay.textContent = gameState.nickname;
    });
    elements.prestigeButton.addEventListener('click', prestige);
    elements.resetButton.addEventListener('click', hardReset);
    elements.licenseSummary.addEventListener('click', () => { gameState.licenseClicked = true; });
    
    const saveExitTime = () => localStorage.setItem('chickenClickerExitTime', Date.now());
    window.addEventListener('beforeunload', saveExitTime);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            saveExitTime();
        }
    });
    
    elements.exportSaveClipboardBtn.addEventListener('click', () => exportSave(false));
    elements.exportSaveFileBtn.addEventListener('click', () => exportSave(true));
    elements.importSaveTextBtn.addEventListener('click', () => importSave(elements.importSaveText.value));
    elements.importSaveFileBtn.addEventListener('click', () => elements.importFileInput.click());
    elements.importFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => importSave(e.target.result);
            reader.readAsText(file);
        }
    });

    for (const id in CONFIG.UPGRADES) {
        document.getElementById(`buy-${id}`).addEventListener('click', () => buyUpgrade(id));
    }
    for (const id in CONFIG.CHICKENS) {
        document.getElementById(`buy-${id}`).addEventListener('click', () => buyChicken(id));
    }

    document.getElementById('buy-ancestralBlueprints').addEventListener('click', () => {
        const level = gameState.prestigeUpgrades.ancestralBlueprints;
        const cost = 10 * Math.pow(2, level);
        if (gameState.reputation >= cost) {
            gameState.reputation -= cost;
            gameState.prestigeUpgrades.ancestralBlueprints++;
        }
    });
}

function initialize() {
    if (elements.versionNumberEl) {
        elements.versionNumberEl.textContent = CONFIG.GAME_VERSION;
    }
    buildUpgradeShop();
    buildCoop();
    loadGame();
    
    calculateOfflineProgress();

    renderAchievements(gameState);
    updateUI(gameState);
    setupEventListeners();
    setInterval(gameLoop, CONFIG.GAME_TICK_INTERVAL * 1000);
    setInterval(saveGame, CONFIG.SAVE_INTERVAL * 1000);
    setInterval(spawnGoldenChicken, CONFIG.GOLDEN_CHICKEN_SPAWN_INTERVAL * 1000);
    setInterval(triggerEvent, CONFIG.RANDOM_EVENT_INTERVAL * 1000);
    setInterval(spawnColoredEgg, CONFIG.COLORED_EGG_ATTEMPT_INTERVAL * 1000);
}

initialize();
