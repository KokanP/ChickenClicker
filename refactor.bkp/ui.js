import { CONFIG, achievements } from './config.js';
import { calculateCost, formatNumber, getEggsPerSecond, getEggsPerClick, getReputationBonus, generateAchievementScreenshot } from './utils.js';

// --- DOM Element References ---
export const elements = {
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
    versionNumberEl: document.getElementById('version-number')
};

// --- UI Building Functions ---
export function buildUpgradeShop() {
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

export function buildCoop() {
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

// --- UI Update Functions ---
export function updateUI(gameState) {
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
    
    elements.reputationPointsEl.textContent = formatNumber(gameState.reputation);
    elements.reputationBonusEl.textContent = ((getReputationBonus(gameState) - 1) * 100).toFixed(0);
    elements.prestigeButton.disabled = gameState.eggs < CONFIG.PRESTIGE_COST;
    
    if(gameState.event.active) {
        elements.eventBanner.style.display = 'block';
        elements.eventBanner.textContent = `${gameState.event.type}! ${Math.ceil(gameState.event.duration)}s left!`;
    } else {
        elements.eventBanner.style.display = 'none';
    }
}

export function renderAchievements(gameState) {
    elements.achievementsList.innerHTML = '';
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
                generateAchievementScreenshot(id, gameState);
            });
            el.appendChild(shareIcon);
        }
        
        elements.achievementsList.appendChild(el);
    });
}

// --- UI Feedback Functions ---
export function showToast(title, description) {
    elements.toastTitle.textContent = title;
    elements.toastDescription.textContent = description;
    elements.toast.classList.add('show');
    setTimeout(() => elements.toast.classList.remove('show'), 4000);
};

export function showFloatingText(text, event, isSuper = false) {
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
