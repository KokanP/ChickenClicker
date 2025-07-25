import { achievements } from './config.js';

// --- UTILITY & CALCULATION FUNCTIONS --- //
// These functions are shared across different parts of the game logic.

export function formatNumber(num) {
    if (num === Infinity) return 'Infinity';
    if (num < 1000) return num.toFixed(0);
    const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];
    const i = Math.floor(Math.log10(num) / 3);
    if (i >= suffixes.length) return num.toExponential(2);
    return (num / Math.pow(1000, i)).toFixed(2) + suffixes[i];
}

export function calculateCost(base, level, exponent = 1.15) {
    return Math.floor(base * Math.pow(exponent, level));
}

export function generateAchievementScreenshot(id, gameState) {
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

// --- Core Game Logic Calculations ---
export const getAchievementBonus = (gs) => gs.unlockedAchievements.reduce((total, id) => total * (achievements[id]?.bonus || 1), 1);
export const getReputationBonus = (gs) => 1 + gs.reputation * 0.05 + (gs.chickens.wyandotte * 0.05);
const getEventModifier = (gs) => gs.event.active ? gs.event.modifier : 1;
const getBuffModifier = (gs, buffType, defaultValue = 1) => (gs.activeBuffs[buffType] ? gs.activeBuffs[buffType].value : defaultValue);
const getBoostMultiplier = (gs) => getBuffModifier(gs, 'boostMultiplier');

export const getEggsPerSecond = (gs) => {
    let baseEps = gs.upgrades.worker * gs.chickens.leghorn * 1;
    baseEps += gs.chickens.brahma * (baseEps * 5);
    const nestEggInterest = gs.upgrades.nestEggIRA > 0 ? gs.eggs * 0.001 * gs.upgrades.nestEggIRA : 0;
    const peckingOrderBonus = 1 + (gs.upgrades.peckingOrder * 0.1);
    const bantyBonus = Math.pow(1.1, gs.chickens.banty);
    const totalBuildings = Object.values(gs.upgrades).reduce((a, b) => a + b, 0) + Object.values(gs.chickens).reduce((a, b) => a + b, 0);
    const cluckworkBonus = 1 + (gs.upgrades.cluckworkAutomation * 0.05 * totalBuildings);
    return (baseEps + nestEggInterest) * getAchievementBonus(gs) * getReputationBonus(gs) * getEventModifier(gs) * getBoostMultiplier(gs) * gs.permanentBonus * peckingOrderBonus * bantyBonus * cluckworkBonus;
};

export const getEggsPerClick = (gs) => {
    const loomBoost = 1 + (gs.upgrades.loom * 0.25);
    const baseEpc = 1 + gs.upgrades.incubator;
    const peckingOrderBonus = 1 + (gs.upgrades.peckingOrder * 0.1);
    const bantyBonus = Math.pow(1.1, gs.chickens.banty);
    return Math.floor(baseEpc * loomBoost * getAchievementBonus(gs) * getReputationBonus(gs) * getEventModifier(gs) * getBoostMultiplier(gs) * gs.permanentBonus * peckingOrderBonus * bantyBonus * getBuffModifier(gs, 'clickFrenzy'));
};
