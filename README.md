# **Chicken Clicker**

An incremental idle game about clicking chickens and managing a coop. This game is an evolution of the classic *Cow Clicker* concept, expanded with modern idle game mechanics like achievements, prestige, and now, **offline progress**.

## **Project Path & History**

This game began as a collaborative project, evolving from a simple, single-file prototype inspired by [*Cow Clicker*](https://cowclicker.iffy.top/) into a structured, multi-file web application. The goal was to create a more engaging and long-lasting experience while retaining the charm of the original clicker genre. The project is now maintained here on GitHub.

The game is built with vanilla HTML, CSS, and JavaScript, using Tailwind CSS for styling.

## **How to Play**

The easiest way to play is to visit the official project URL:

[**https://chickenclicker.iffy.top/**](https://chickenclicker.iffy.top/)

### Running Locally

If you wish to run the game from the source files:

1.  Clone this repository or download the project as a ZIP file.
2.  Ensure all three core files (`index.html`, `style.css`, and `script.js`) are in the same directory.
3.  Open the `index.html` file in any modern web browser.

*(The multi-file version is still available in the project history for reference.)*

### **Save Management**

Version 2.5 introduces the ability to export and import your save data. This is useful for creating backups or transferring your game to another browser or device.

* **Exporting:** In the "Settings" menu, you can export your save data either to your clipboard or as a downloadable text file.  
* **Importing:** In the "Settings" menu, you can paste save data into the text box and click "From Text", or you can select a previously downloaded save file by clicking "From File". The game will reload to apply the new save state.

## **Changelog**

### **Version 2.93 (Clarity Update)**
*   **UI/Clarity:** Updated the descriptions for several upgrades and chickens (Coop Worker, Incubator, Golden Loom, Rooster, Wyandotte Warrior, and Doja Cow) to be more explicit about their mechanical effects and how they scale. This addresses player confusion about upgrade stacking and hidden mechanics.
*   **Housekeeping:** Updated version number to 2.93.

### **Version 2.92 (Eggies)**
*   **Feature (UI):** Added a new banner at the top of the screen that displays all active colored egg buffs. Each buff is shown as a colored "pill" with its name, an icon, and a countdown of its remaining duration in seconds.
*   **Housekeeping:** Updated version number to 2.92.

### **Version 2.91 (Jules)**
*   **Critical Fix (Reputation):** Overhauled the reputation calculation for prestige. Roosters now grant a base of 1,000 Reputation each. The bonus from Wyandotte Warriors has been increased from 1% to 5% per chicken. This resolves the issue of reputation gain stalling at high levels.
*   **Critical Fix (Buffs):** Rewrote the buff expiration logic in the main game loop to correctly decrement and remove temporary buffs. This fixes a critical bug where buffs like the Red Egg's "clickFrenzy" would not apply or expire correctly.
*   **Feature (UI):** Added progress bars to all non-hidden achievements that track a specific number (e.g., total clicks, eggs, buildings owned). The bar shows the current progress and a "current / target" number count.
*   **Housekeeping:** Updated version number to 2.91.

### **Version 2.9 (Cluck You Totoro!)**

* **Fix:** The "Fowl Language" upgrade now works as intended. The chicken will occasionally squawk insults at the player after the upgrade is purchased, finally giving this essential feature its voice.
* **Documentation:** Updated the in-game "How to Play" guide with accurate descriptions for Prestige cost, Golden Feathers, and the Golden Chicken's rewards to match current game mechanics.
* **Documentation:** Updated the "Running Locally" instructions in the README to correctly reflect the project's multi-file structure.
* **Housekeeping:** Updated version number and save key to 2.9.

### **Version 2.8 (Architect's Update)**

* **Balance:** The prestige cost is now dynamic, doubling with each use to increase the late-game challenge.
* **Feature:** Added four new upgrades: Golden Compass, Comfy Coop Bedding, Prismatic Feed, and the 'Ancestral Blueprints' prestige upgrade.
* **Fix:** Corrected a visual bug where long version titles would overflow on narrow mobile screens.
* **Housekeeping:** Updated version number and save key to 2.8.
* **Housekeeping:** Refactored the single index.html file into separate index.html, style.css, and script.js files for better organization and maintainability.

### **Version 2.7 (Banty Shack)**

*Named in honor of torn.com's faction Banty Shack for reaching 1 million respect.*

* **Feature:** Implemented Offline Progress\! The game now calculates and awards resources (Eggs, Golden Feathers, Reputation) earned while the game was closed.  
* **UI:** Added a "Welcome Back" modal that appears on load to summarize the earnings your farm made while you were away.  
* **Housekeeping:** Updated the game's internal version number and save file key to 2.7.

### **Version 2.6 (Tarzan)**

* **Balance:** Changed achievement bonuses from multiplicative to additive to prevent runaway late-game scaling.  
* **UI:** The prestige menu now displays a full breakdown of all permanent production multipliers for better clarity.  
* **Feature:** Implemented the previously non-functional "Orpington Oracle" chicken. It now provides a random egg bonus every 10 minutes.  
* **Fix:** The "Wyandotte Warrior" now correctly increases Reputation gained on prestige, as described.  
* **Housekeeping:** Updated version number and save key to 2.6.

### **Version 2.5 (Totoro)**

*Named in honor of user Totoro\_Sama for discovering and reporting a critical, game-breaking bug.*

* **Feature:** Added a comprehensive "Help" screen accessible from the main navigation bar. It explains all core game mechanics, currencies, and concepts.  
* **Feature:** Implemented a robust save management system in the Settings menu. Players can now export their save to the clipboard or a file, and import a save from text or a file.  
* **Bug Fix (Critical):** Fixed a game-breaking bug where the "Nest Egg IRA" upgrade could cause the player's egg count to become Infinity. This led to a corrupted save file upon prestiging, making the game unresponsive. The upgrade's bonus is now capped relative to base production.  
* **Bug Fix:** Corrected the logic for the "Doja Cow's" Super Click chain bonus, which was previously inverted and punished rapid clicks instead of rewarding them.  
* **Bug Fix:** Fixed the non-functional "Discount" (Green Egg) and "Feather Frenzy" (Orange Egg) buffs. They now correctly apply their effects.  
* **Bug Fix:** Ensured the "Hard Reset" achievement is now correctly awarded.  
* **Housekeeping:** Updated the game's internal version number and save file key to 2.5 to prevent conflicts with older, potentially corrupt save files.

### **Version 2.4 (Hotfix & Consolidation)**

* **Project Consolidation:** Merged all separate JavaScript (game.js, ui.js, utils.js, config.js) and CSS (style.css) files into a single, self-contained index.html. This simplifies local usage, eliminates potential browser module loading issues, and makes the project easier to share and debug.  
* **Bug Fix (Critical):** Corrected a major issue where upgrade and coop item colors were not displaying. The dynamic generation of Tailwind CSS classes (e.g., bg-${color}-500) was preventing the Just-In-Time compiler from including the necessary styles. The new single-file structure resolves this.  
* **Bug Fix:** Fixed a logic error that made the "What Did It Do To You?" (Hard Reset) achievement impossible to obtain.  
* **Housekeeping:** Synchronized copyright information across files and replaced an invalid alt attribute on the chicken SVG with a more accessible \<title\> tag.

### **Version 2.3**

* **Refactor:** Broke down the monolithic game.js into three logical files: config.js for game balance, ui.js for DOM manipulation, and game.js for core logic. This greatly improves maintainability and makes debugging easier.  
* **Housekeeping:** Updated version number to 2.3.

### **Version 2.2**

* **Feature:** Reworked "Doja Chicken" into "Doja Cow" with a new passive "Super Click" ability, replacing the temporary frenzy.  
* **Bug Fix:** The player's name now correctly appears in the settings menu after being entered for the first time.  
* **Housekeeping:** Added version number to the settings panel.

### **Version 2.1**

* **Feature:** Added over 50 new achievements, including many hidden ones.  
* **Feature:** Implemented a system for 10 different colored eggs to spawn randomly, each providing a unique temporary bonus.  
* **Feature:** Added 6 new upgrade tiers with unique, pun-based names.  
* **Feature:** Added 6 new chicken tiers to the coop, including the "Doja Cow" and the powerful "Banty Chicken".  
* **UI:** A pop-up now prompts the user to enter their name on their first playthrough or after a hard reset.  
* **Balance:** Adjusted colored egg spawn rate to an average of 10 per hour and added a toast notification to display the bonus received.

### **Version 2.0**

* **Refactor:** Separated the project from a single HTML file into index.html, style.css, and game.js.  
* **Refactor:** Created a central CONFIG object at the top of game.js to make game balancing and tweaking easy and accessible without changing core logic.

### **Version 1.x (Pre-GitHub)**

* Initial prototype development.  
* Implementation of core clicking mechanics, upgrades, and chickens.  
* Introduction of the prestige system (Reputation).  
* Redesign to a mobile-first UI with a fixed bottom navigation and modal screens.  
* Addition of a constrained, bordered layout for a better desktop/tablet experience.