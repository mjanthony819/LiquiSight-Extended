// LiquiSight Content Script - Side Panel

(function() {
  // Prevent multiple initializations
  if (window.liquiSightLoaded) {
    if (window.liquiOpenPanel) window.liquiOpenPanel();
    return;
  }
  window.liquiSightLoaded = true;

  let panel = null;
  let chatMessagesEl = null;
  let statusTextEl = null;
  let metricScans = 0;
  let metricPortfolio = 0;
  let metricAlerts = 0;
  let selectionOverlay = null;
  let selectionBox = null;
  let isActivated = false;
  let isProcessing = false;
  let scanPageBtnEl = null;
  let selectAreaBtnEl = null;
  let historyBtnEl = null;
  let chatInputEl = null;
  let chatSendBtnEl = null;

  // Expose globally
  window.liquiOpenPanel = openLiquiPanel;

  // Message listener
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "activate") {
      openLiquiPanel();
    } else if (request.action === "deactivate") {
      closeLiquiPanel();
    } else if (request.action === "togglePanel") {
      if (panel && panel.style.display !== "none") {
        closeLiquiPanel();
      } else {
        openLiquiPanel();
      }
    }
    sendResponse({ success: true });
    return true;
  });

  // Auto-open if logged in
  chrome.storage.local.get(["user"], (result) => {
    if (result.user) openLiquiPanel();
  });

  // Load metrics
  chrome.storage.local.get(["portfolio"], (result) => {
    const portfolio = result.portfolio || [];
    metricPortfolio = portfolio.length;
    const today = new Date().toDateString();
    metricScans = portfolio.filter(item => new Date(item.timestamp).toDateString() === today).length;
  });

  function openLiquiPanel() {
    if (!panel) createLiquiPanel();
    panel.style.display = "flex";
  }

  function closeLiquiPanel() {
    if (panel) panel.style.display = "none";
  }

  function createLiquiPanel() {
    panel = document.createElement("div");
    panel.className = "liqui-panel";
    panel.innerHTML = `
      <div class="liqui-header">
        <div class="liqui-title-section">
          <div class="liqui-title">LiquiSight</div>
          <div class="liqui-subtitle">AI FINANCIAL COPILOT</div>
        </div>
        <div class="liqui-status" id="liqui-status">
          <span class="liqui-status-dot"></span>
          <span id="liqui-status-text">Analyzing selection...</span>
        </div>
      </div>

      <button class="liqui-activate-btn" id="liqui-activate-btn">
        <div class="liqui-activate-left">
          <span class="liqui-activate-dot"></span>
          <span>ACTIVATE LIQUISIGHT</span>
        </div>
        <span class="liqui-shortcut">ALT + L</span>
      </button>

      <div class="liqui-actions">
        <button class="liqui-action-tile" id="liqui-scan-page">
          <div class="liqui-action-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/><polyline points="21 3 21 9 15 9"/></svg></div>
          <div class="liqui-action-label">Scan Page</div>
          <div class="liqui-action-desc">Read all visible charts</div>
        </button>
        <button class="liqui-action-tile" id="liqui-select-area">
          <div class="liqui-action-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg></div>
          <div class="liqui-action-label">Select Area</div>
          <div class="liqui-action-desc">Drag around a chart</div>
        </button>
        <button class="liqui-action-tile" id="liqui-history">
          <div class="liqui-action-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg></div>
          <div class="liqui-action-label">History</div>
          <div class="liqui-action-desc">Recent scans</div>
        </button>
      </div>

      <div class="liqui-metrics">
        <div class="liqui-metric"><div class="liqui-metric-label">SCANS TODAY</div><div class="liqui-metric-value" id="liqui-metric-scans">${metricScans}</div></div>
        <div class="liqui-metric"><div class="liqui-metric-label">IN PORTFOLIO</div><div class="liqui-metric-value" id="liqui-metric-portfolio">${metricPortfolio}</div></div>
        <div class="liqui-metric"><div class="liqui-metric-label">ALERTS</div><div class="liqui-metric-value" id="liqui-metric-alerts">${metricAlerts}</div></div>
      </div>

      <div class="liqui-links">
        <span class="liqui-link" id="liqui-dashboard">Open Dashboard</span>
        <span class="liqui-link" id="liqui-settings">Settings</span>
      </div>

      <div class="liqui-chat">
        <div class="liqui-chat-header">
          <span>LiquiSight Chat</span>
          <span class="liqui-chat-badge">Screen-aware</span>
        </div>
        <div class="liqui-chat-messages" id="liqui-chat-messages"></div>
        <div class="liqui-chat-input-wrap">
          <input id="liqui-chat-input" type="text" placeholder="Ask anything about this chart..." />
          <button id="liqui-chat-send"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    chatMessagesEl = panel.querySelector("#liqui-chat-messages");
    statusTextEl = panel.querySelector("#liqui-status-text");

    scanPageBtnEl = panel.querySelector("#liqui-scan-page");
    selectAreaBtnEl = panel.querySelector("#liqui-select-area");
    historyBtnEl = panel.querySelector("#liqui-history");
    chatInputEl = panel.querySelector("#liqui-chat-input");
    chatSendBtnEl = panel.querySelector("#liqui-chat-send");

    // Event listeners
    scanPageBtnEl.addEventListener("click", handleScanPage);
    selectAreaBtnEl.addEventListener("click", handleSelectArea);
    historyBtnEl.addEventListener("click", showHistory);
    panel.querySelector("#liqui-activate-btn").addEventListener("click", () => {
      isActivated = !isActivated;
      addBotMessage("LiquiSight is active on this page. Use \"Scan Page\" or \"Select Area\" and I'll interpret the price action for you.");
    });
    panel.querySelector("#liqui-settings").addEventListener("click", () => addBotMessage("Settings coming soon!"));

    const inputEl = panel.querySelector("#liqui-chat-input");
    panel.querySelector("#liqui-chat-send").addEventListener("click", () => handleUserChat(inputEl));
    inputEl.addEventListener("keydown", (e) => { if (e.key === "Enter") handleUserChat(inputEl); });

    addBotMessage("Hey, I'm LiquiSight.\\n\\nOpen any TradingView / Yahoo Finance style page, then:\\n• Use \"Scan Page\" to read all visible charts\\n• Or \"Select Area\" and drag around one chart.\\n\\nI'll post my analysis right here in the chat.");
  }

  function setBusy(busy, statusLabel) {
    isProcessing = busy;
    if (panel) panel.classList.toggle("liqui-busy", busy);
    if (scanPageBtnEl) scanPageBtnEl.disabled = busy;
    if (selectAreaBtnEl) selectAreaBtnEl.disabled = busy;
    if (historyBtnEl) historyBtnEl.disabled = busy;
    if (chatInputEl) chatInputEl.disabled = busy;
    if (chatSendBtnEl) chatSendBtnEl.disabled = busy;
    if (busy && statusLabel) setStatus(statusLabel);
  }

  function addBotMessage(text) {
    if (!chatMessagesEl) return;
    const msg = document.createElement("div");
    msg.className = "liqui-msg liqui-msg-bot";
    msg.innerHTML = '<div class="liqui-msg-content">' + text.replace(/\\n/g, '<br>') + '</div>';
    chatMessagesEl.appendChild(msg);
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }

  function addUserMessage(text) {
    if (!chatMessagesEl) return;
    const msg = document.createElement("div");
    msg.className = "liqui-msg liqui-msg-user";
    msg.innerHTML = '<div class="liqui-msg-content">' + text + '</div>';
    chatMessagesEl.appendChild(msg);
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }

  function handleUserChat(inputEl) {
    if (isProcessing) return;
    const text = inputEl.value.trim();
    if (!text) return;
    addUserMessage(text);
    inputEl.value = "";

    setBusy(true, "Thinking...");
    chrome.runtime.sendMessage(
      {
        action: "sendChatMessage",
        message: text,
        context: location.href,
      },
      (response) => {
        setBusy(false);

        if (chrome.runtime.lastError) {
          addBotMessage("Chat failed: " + chrome.runtime.lastError.message);
          setStatus("Ready");
          return;
        }

        if (!response?.ok) {
          addBotMessage("Chat failed: " + (response?.error || "Unknown error"));
          setStatus("Ready");
          return;
        }

        const reply = response.result?.reply || "Sorry — no reply returned."
        addBotMessage(reply);
        setStatus("Ready");
      }
    );
  }

  function setStatus(label) {
    if (statusTextEl) statusTextEl.textContent = label;
  }

  function updateMetrics() {
    const s = document.getElementById("liqui-metric-scans");
    const p = document.getElementById("liqui-metric-portfolio");
    if (s) s.textContent = metricScans;
    if (p) p.textContent = metricPortfolio;
  }

  function handleScanPage() {
    if (isProcessing) return;
    setBusy(true, "Scanning...");
    setStatus("Scanning page...");
    addBotMessage("Scanning this page for charts...");
    runScanEffect();
    chrome.runtime.sendMessage(
      {
        action: "sendChartForAnalysis",
        captureVisible: true,
        context: location.href,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          addBotMessage("Error contacting extension background: " + chrome.runtime.lastError.message);
          setBusy(false);
          setStatus("Ready");
          return;
        }

        if (!response?.ok) {
          addBotMessage("Analysis failed: " + (response?.error || "Unknown error"));
          setBusy(false);
          setStatus("Ready");
          return;
        }

        const analysis = response.result;
        addBotMessage(formatBackendAnalysis(analysis, "page"));
        metricScans++;
        metricPortfolio++;
        updateMetrics();
        saveToPortfolio(analysis);
        setBusy(false);
        setStatus("Ready");
      }
    );
  }

  function handleSelectArea() {
    if (isProcessing) return;
    setStatus("Select an area...");
    addBotMessage("Drag on the page to select a chart region.");
    if (selectionOverlay) return;
    selectionOverlay = document.createElement("div");
    selectionOverlay.className = "liqui-selection-overlay";
    document.body.appendChild(selectionOverlay);

    let startX = 0, startY = 0;
    function onMouseDown(e) {
      if (e.button !== 0) return;
      startX = e.clientX; startY = e.clientY;
      selectionBox = document.createElement("div");
      selectionBox.className = "liqui-selection-box";
      selectionBox.style.left = startX + "px";
      selectionBox.style.top = startY + "px";
      selectionOverlay.appendChild(selectionBox);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    function onMouseMove(e) {
      const x = Math.min(e.clientX, startX), y = Math.min(e.clientY, startY);
      const w = Math.abs(e.clientX - startX), h = Math.abs(e.clientY - startY);
      selectionBox.style.left = x + "px"; selectionBox.style.top = y + "px";
      selectionBox.style.width = w + "px"; selectionBox.style.height = h + "px";
    }
    function onMouseUp() {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      const rect = selectionBox.getBoundingClientRect();
      selectionOverlay.remove(); selectionOverlay = null; selectionBox = null;
      if (rect.width > 20 && rect.height > 20) {
        setBusy(true, "Analyzing...");
        setStatus("Analyzing selection...");
        chrome.runtime.sendMessage(
          {
            action: "sendChartForAnalysis",
            captureVisible: true,
            crop: {
              x: rect.x * window.devicePixelRatio,
              y: rect.y * window.devicePixelRatio,
              width: rect.width * window.devicePixelRatio,
              height: rect.height * window.devicePixelRatio,
            },
            context: location.href,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              addBotMessage("Error contacting extension background: " + chrome.runtime.lastError.message);
              setBusy(false);
              setStatus("Ready");
              return;
            }

            if (!response?.ok) {
              addBotMessage("Analysis failed: " + (response?.error || "Unknown error"));
              setBusy(false);
              setStatus("Ready");
              return;
            }

            const analysis = response.result;
            addBotMessage(formatBackendAnalysis(analysis, "selected area"));
            metricScans++; metricPortfolio++; updateMetrics();
            saveToPortfolio(analysis);
            setBusy(false);
            setStatus("Ready");
          }
        );
      } else { setStatus("Ready"); }
    }
    selectionOverlay.addEventListener("mousedown", onMouseDown);
  }

  function runScanEffect() {
    const line = document.createElement("div");
    line.className = "liqui-scan-line";
    document.body.appendChild(line);
    setTimeout(() => line.remove(), 2000);
  }

  function generateAnalysis() {
    const trends = [{ value: "📈 Bullish", s: "bullish" }, { value: "📉 Bearish", s: "bearish" }, { value: "➡️ Sideways", s: "neutral" }];
    const vols = ["Low", "Moderate", "High"];
    const risks = ["Low Risk", "Medium Risk", "High Risk"];
    const strengths = ["Weak", "Moderate", "Strong", "Very Strong"];
    const insights = [
      "Strong momentum with rising volume. Continuation likely.",
      "Price compressing near resistance. Expect volatility expansion.",
      "RSI/MACD show exhaustion. Wait for pullback.",
      "Institutional accumulation detected. Dips may be bought.",
      "Failed breakout attempts. Consider tighter stops."
    ];
    const trend = trends[Math.floor(Math.random() * trends.length)];
    const rec = trend.s === "bullish" ? "Biased upside. Consider buy with stop below support." :
                trend.s === "bearish" ? "Downside pressure. Avoid longs; consider hedging." :
                "Mixed structure. Hold or stay flat.";
    return {
      trend, strength: strengths[Math.floor(Math.random() * 4)],
      volatility: vols[Math.floor(Math.random() * 3)],
      risk: risks[Math.floor(Math.random() * 3)],
      confidence: Math.floor(Math.random() * 21) + 75,
      insight: insights[Math.floor(Math.random() * 5)], recommendation: rec
    };
  }

  function formatBackendAnalysis(a, scope) {
    const stockName = a?.stock_name || "UNKNOWN";
    const trend = a?.trend || "Sideways";
    const risk = a?.risk || "Medium";
    const confidence = typeof a?.confidence === "number" ? Math.round(a.confidence * 100) + "%" : "N/A";
    const explanation = a?.explanation || "";
    return "Here's what I see in the " + scope + ":\n\n" +
      "• Stock: " + stockName + "\n" +
      "• Trend: " + trend + "\n" +
      "• Risk: " + risk + "\n" +
      "• Confidence: " + confidence + "\n\n" +
      explanation;
  }

  function formatAnalysis(a, scope) {
    return "Here's what I see in the " + scope + ":\\n\\n• Trend: " + a.trend.value + "\\n• Strength: " + a.strength +
      "\\n• Volatility: " + a.volatility + "\\n• Risk: " + a.risk + "\\n• Confidence: " + a.confidence + "%\\n\\n" +
      a.insight + "\\n\\n" + a.recommendation;
  }

  function saveToPortfolio(analysis) {
    chrome.storage.local.get(["portfolio"], (r) => {
      const p = r.portfolio || [];
      p.push({ url: location.href, title: document.title, timestamp: new Date().toISOString(), analysis });
      chrome.storage.local.set({ portfolio: p });
    });
  }

  function showHistory() {
    chrome.storage.local.get(["portfolio"], (r) => {
      const p = r.portfolio || [];
      if (!p.length) { addBotMessage("No scans yet. Use \"Scan Page\" or \"Select Area\"."); return; }
      const last = p[p.length - 1];
      const trendText = last.analysis?.trend?.value || last.analysis?.trend || "Unknown";
      addBotMessage("Latest scan:\\n\\n• Page: " + last.title + "\\n• When: " + new Date(last.timestamp).toLocaleString() +
        "\n• Trend: " + trendText + "\n\nTotal: " + p.length + " scan(s).");
    });
  }
})();
