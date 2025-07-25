# **Chicken Clicker**

An incremental idle game about clicking chickens and managing a coop. This game is an evolution of the classic *Cow Clicker* concept, expanded with modern idle game mechanics.

## **Project Path & History**

This game began as a collaborative project, evolving from a simple, single-file prototype inspired by [*Cow Clicker*](https://cowclicker.iffy.top/) into a structured, multi-file web application. The goal was to create a more engaging and long-lasting experience while retaining the charm of the original clicker genre. The project is now maintained here on GitHub.

The game is built with vanilla HTML, CSS, and JavaScript, using Tailwind CSS for styling.

## **How to Play**

The easiest way to play is to visit the official project URL:

[**https://chickenclicker.iffy.top/**](https://chickenclicker.iffy.top/)

### **Running Locally**

If you wish to run the game from the source files:

1. Clone this repository or download the project.  
2. Open the index.html file in any modern web browser.

*(The multi-file version is still available in the project history for reference.)*

## **Changelog**

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