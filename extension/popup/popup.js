// popup.js - LiquiSight Extension Popup

document.addEventListener("DOMContentLoaded", () => {
  const authView = document.getElementById("authView");
  const mainView = document.getElementById("mainView");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const activateBtn = document.getElementById("activateBtn");
  const userEmailEl = document.getElementById("userEmail");
  const statusEl = document.getElementById("status");

  // Check if user is logged in
  chrome.storage.local.get(["user"], ({ user }) => {
    if (user && user.email) {
      showMainView(user.email);
    }
  });

  // Login handler - THIS IS THE KEY PART
  loginBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      statusEl.textContent = "Please enter email and password";
      return;
    }

    statusEl.textContent = "Logging in...";

    // Save user session
    await chrome.storage.local.set({ user: { email } });
    
    // Activate the side panel on current tab
    await activatePanel();
    
    // Close popup
    window.close();
  });

  // Logout handler
  logoutBtn.addEventListener("click", () => {
    chrome.storage.local.remove(["user"], () => {
      showAuthView();
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "deactivate" }).catch(() => {});
        }
      });
    });
  });

  // Activate panel button
  activateBtn.addEventListener("click", async () => {
    await activatePanel();
    window.close();
  });

  // Enter key handlers
  passwordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") loginBtn.click();
  });

  emailInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") passwordInput.focus();
  });

  function showAuthView() {
    authView.classList.remove("hidden");
    mainView.classList.remove("active");
    emailInput.value = "";
    passwordInput.value = "";
    statusEl.textContent = "";
  }

  function showMainView(email) {
    authView.classList.add("hidden");
    mainView.classList.add("active");
    userEmailEl.textContent = email;
  }

  async function activatePanel() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) {
        alert("No active tab found");
        return;
      }
      
      // Check if we can inject on this page
      const url = tab.url || "";
      if (url.startsWith("chrome://") || url.startsWith("chrome-extension://") || url.startsWith("edge://") || url === "" || url.startsWith("about:")) {
        alert("Cannot open LiquiSight on this page.\\n\\nPlease navigate to a website first (e.g., google.com, tradingview.com)");
        return;
      }
      
      const tabId = tab.id;
      
      // Inject CSS first
      try {
        await chrome.scripting.insertCSS({
          target: { tabId: tabId },
          files: ["content/style.css"]
        });
      } catch (e) {
        console.log("CSS:", e.message);
      }
      
      // Inject content script
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ["content/content.js"]
        });
      } catch (e) {
        console.log("Script:", e.message);
      }
      
      // Wait for script to initialize
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Send activate message
      try {
        await chrome.tabs.sendMessage(tabId, { action: "activate" });
      } catch (e) {
        console.log("Message:", e.message);
      }
      
    } catch (error) {
      console.error("activatePanel error:", error);
      alert("Error: " + error.message);
    }
    }
  }
);
