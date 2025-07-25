// --- GAME BALANCE & CONFIGURATION --- //
// This section contains all the core values that control the game's pacing and difficulty.
// Change these numbers to rebalance the game without altering the main logic.

export const CONFIG = {
    // General Settings
    SAVE_KEY: 'chickenClickerSave_v2.3_separated', // Change this to reset all players' saves on an update
    GAME_VERSION: '2.3',

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

// --- Achievements Data ---
export const achievements = {
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

export const achievementConditions = {
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
};
