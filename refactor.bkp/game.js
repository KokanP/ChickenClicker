import { CONFIG, achievements, achievementConditions } from './config.js';
import { elements, buildUpgradeShop, buildCoop, updateUI, renderAchievements, showToast, showFloatingText } from './ui.js';
import { calculateCost, formatNumber, getEggsPerClick, getEggsPerSecond } from './utils.js';

// --- Game State ---
let gameState = {};
const initialGameState = {
    nickname: null, eggs: 0, totalEggs: 0, feathers: 0, totalFeathers: 0, totalClicks: 0,
    upgrades: {
        worker: 0, incubator: 0, loom: 0, featherForecast: 0, eggstraClicks: 0, 
        cluckworkAutomation: 0, peckingOrder: 0, nestEggIRA: 0, fowlLanguage: 0
    },
    chickens: { 
        leghorn: 1, silkie: 0, rooster: 0, orpington: 0, wyandotte: 0, doja: 0,
        brahma: 0, serama: 0, banty: 0
    },
    unlockedAchievements: [], reputation: 0, timePlayed: 0, failedBuys: 0, licenseClicked: false,
    goldenChickensClicked: 0, prestigeCount: 0, resets: 0,
    event: { active: false, type: null, duration: 0, modifier: 1 },
    activeBuffs: {}, permanentBonus: 1, clickedColoredEggs: {},
    lastSuperClickTime: 0, superClickChain: 0, modalOpens: 0, timeSinceLastClick: 0,
};

// --- Player Actions ---
function clickChicken(event) {
    let epc = getEggsPerClick(gameState);
    if (gameState.upgrades.eggstraClicks > 0 && Math.random() < (gameState.upgrades.eggstraClicks * 0.05)) {
        epc *= 10;
    }
    gameState.eggs += epc;
    gameState.totalEggs += epc;
    showFloatingText(`+${formatNumber(epc)}`, event);

    const superClickChance = (gameState.chickens.doja * 0.001) * (gameState.activeBuffs.superClickFrenzy ? gameState.activeBuffs.superClickFrenzy.value : 1);
    if (gameState.chickens.doja > 0 && Math.random() < superClickChance) {
        const now = Date.now();
        if (now - gameState.lastSuperClickTime < 10000) {
            gameState.superClickChain++;
        } else {
            gameState.superClickChain = 0;
        }
        gameState.lastSuperClickTime = now;
        const superClickBonus = (getEggsPerSecond(gameState) * 3600) / Math.pow(2, gameState.superClickChain);
        gameState.eggs += superClickBonus;
        gameState.totalEggs += superClickBonus;
        showFloatingText(`+${formatNumber(superClickBonus)}!`, event, true);
    }
    gameState.totalClicks++;
    gameState.timeSinceLastClick = 0;
}

function buyUpgrade(id) {
    const upgrade = CONFIG.UPGRADES[id];
    const cost = calculateCost(upgrade.baseCost, gameState.upgrades[id], upgrade.exponent);
    if (gameState[upgrade.currency] >= cost) {
        gameState[upgrade.currency] -= cost;
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

// --- Event & Spawn Logic ---
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
    const bonus = Math.max(getEggsPerClick(gameState) * 100, getEggsPerSecond(gameState) * 10 * 60);
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
        case 'boostMultiplier': bonusDescription = `All active boosts are doubled for ${egg.duration} seconds!`; break;
        case 'superClickFrenzy': bonusDescription = `Super Click chance is doubled for ${egg.duration} seconds!`; break;
        case 'prestigeBuff': bonusDescription = `Your next prestige will grant an extra ${egg.value * 100}% Reputation!`; break;
        case 'prestigePercent': const prestigeGain = CONFIG.PRESTIGE_COST * egg.value; gameState.eggs += prestigeGain; gameState.totalEggs += prestigeGain; bonusDescription = `Gained ${formatNumber(prestigeGain)} eggs toward your next prestige!`; break;
        case 'permanentBonus': bonusDescription = `Permanently increased all egg production by ${egg.value * 100}%!`; break;
    }
    showToast(bonusTitle, bonusDescription);
    if (egg.duration > 0) gameState.activeBuffs[egg.effect] = { value: egg.value, duration: egg.duration };
    else if (egg.effect === 'permanentBonus') gameState.permanentBonus += egg.value;
    else if (egg.effect === 'prestigeBuff') gameState.activeBuffs[egg.effect] = { value: (gameState.activeBuffs[egg.effect]?.value || 0) + egg.value };
    checkAchievements();
}

// --- Save, Load, Reset ---
function saveGame() { localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(gameState)); }
function loadGame() {
    const savedState = localStorage.getItem(CONFIG.SAVE_KEY);
    gameState = savedState ? JSON.parse(savedState) : { ...initialGameState };
    gameState = deepMerge(initialGameState, gameState);
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
        localStorage.removeItem(CONFIG.SAVE_KEY);
        location.reload();
    }
}

// --- Main Game Loop & Initialization ---
function gameLoop() {
    const secondsPassed = CONFIG.GAME_TICK_INTERVAL;
    const eps = getEggsPerSecond(gameState);
    gameState.eggs += eps * secondsPassed;
    gameState.totalEggs += eps * secondsPassed;
    gameState.timePlayed += secondsPassed;
    gameState.timeSinceLastClick = (gameState.timeSinceLastClick || 0) + secondsPassed;
    for (const buff in gameState.activeBuffs) {
        if (gameState.activeBuffs[buff].duration > 0) {
            gameState.activeBuffs[buff].duration -= secondsPassed;
            if (gameState.activeBuffs[buff].duration <= 0) delete gameState.activeBuffs[buff];
        }
    }
    if(gameState.event.active) {
        gameState.event.duration -= secondsPassed;
        if(gameState.event.duration <= 0) gameState.event.active = false;
    }
    const featherChance = 0.1 + (gameState.upgrades.featherForecast * 0.01);
    if(Math.random() < (gameState.chickens.silkie * featherChance * secondsPassed)) {
        gameState.feathers++;
        gameState.totalFeathers++;
    }
    gameState.reputation += gameState.chickens.rooster * 0.01 * secondsPassed;
    if (gameState.chickens.serama > 0 && Math.random() < (gameState.chickens.serama * 0.01 * secondsPassed)) {
        let cheapest = null, minCost = Infinity;
        for(const id in CONFIG.UPGRADES) {
            const cost = calculateCost(CONFIG.UPGRADES[id].baseCost, gameState.upgrades[id], CONFIG.UPGRADES[id].exponent);
            if(cost < minCost) { minCost = cost; cheapest = id; }
        }
        if(cheapest) gameState.upgrades[cheapest]++;
    }
    updateUI(gameState);
    checkAchievements();
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
    if (gameState.eggs >= CONFIG.PRESTIGE_COST) {
        if(confirm(`Are you sure you want to sell the coop? This will reset your eggs, upgrades, and chickens for Reputation points.`)){
            const { nickname, unlockedAchievements, permanentBonus } = gameState;
            const eggsForPrestige = Math.floor(Math.sqrt(gameState.totalEggs / 1e11));
            const prestigeBuff = gameState.activeBuffs.prestigeBuff ? gameState.activeBuffs.prestigeBuff.value : 0;
            const newRep = gameState.reputation + Math.floor((eggsForPrestige > 0 ? eggsForPrestige : 1) * (1 + prestigeBuff));
            const prestigeCount = (gameState.prestigeCount || 0) + 1;
            const unlockedHidden = unlockedAchievements.filter(id => achievements[id]?.hidden);
            
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
    for (const id in CONFIG.UPGRADES) {
        document.getElementById(`buy-${id}`).addEventListener('click', () => buyUpgrade(id));
    }
    for (const id in CONFIG.CHICKENS) {
        document.getElementById(`buy-${id}`).addEventListener('click', () => buyChicken(id));
    }
}

function initialize() {
    if (elements.versionNumberEl) {
        elements.versionNumberEl.textContent = CONFIG.GAME_VERSION;
    }
    buildUpgradeShop();
    buildCoop();
    loadGame();
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
