// background/background.js

// Click on extension icon -> toggle LiquiSight side panel on current tab
chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return;
  chrome.tabs.sendMessage(tab.id, { action: "togglePanel" });
});

// Alt+L keyboard shortcut -> same behavior
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-liquisight") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "togglePanel" });
      }
    });
  }
});