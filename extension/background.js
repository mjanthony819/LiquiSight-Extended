// background.js

// Listen for Alt+L command and toggle the panel on the active tab
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "toggle-liquisight") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      // First inject content script if needed
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content/content.js"]
        });
      } catch (e) {
        console.log("Content script may already be loaded");
      }
      
      try {
        await chrome.scripting.insertCSS({
          target: { tabId: tab.id },
          files: ["content/style.css"]
        });
      } catch (e) {
        console.log("CSS may already be loaded");
      }
      
      // Send toggle message
      setTimeout(() => {
        chrome.tabs.sendMessage(tab.id, { action: "togglePanel" });
      }, 100);
    }
  }
});