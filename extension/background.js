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

const BACKEND_ANALYZE_URL = "http://127.0.0.1:8000/analyze";
const BACKEND_CHAT_URL = "http://127.0.0.1:8000/chat";

function captureVisibleTabPng(windowId) {
  return new Promise((resolve, reject) => {
    chrome.tabs.captureVisibleTab(
      windowId,
      { format: "png", quality: 100 },
      (dataUrl) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message || "Failed to capture tab"));
          return;
        }
        if (!dataUrl) {
          reject(new Error("Failed to capture tab"));
          return;
        }
        resolve(dataUrl);
      }
    );
  });
}

async function dataUrlToBlob(dataUrl) {
  const response = await fetch(dataUrl);
  return await response.blob();
}

async function cropImageBlob(blob, crop) {
  if (!crop) return blob;

  const x = Math.max(0, Math.floor(crop.x || 0));
  const y = Math.max(0, Math.floor(crop.y || 0));
  const width = Math.max(1, Math.floor(crop.width || 0));
  const height = Math.max(1, Math.floor(crop.height || 0));

  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(width) || !Number.isFinite(height)) {
    throw new Error("Invalid crop rectangle");
  }

  // MV3 service worker: use ImageBitmap + OffscreenCanvas
  const imageBitmap = await createImageBitmap(blob);
  const safeWidth = Math.min(width, Math.max(1, imageBitmap.width - x));
  const safeHeight = Math.min(height, Math.max(1, imageBitmap.height - y));

  if (safeWidth <= 0 || safeHeight <= 0) {
    throw new Error("Crop rectangle is outside the captured image");
  }

  const canvas = new OffscreenCanvas(safeWidth, safeHeight);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(imageBitmap, x, y, safeWidth, safeHeight, 0, 0, safeWidth, safeHeight);
  imageBitmap.close?.();

  return await canvas.convertToBlob({ type: "image/png" });
}

/**
 * sendChartForAnalysis
 *
 * - Captures a screenshot OR accepts an image blob/dataUrl
 * - Sends multipart/form-data to POST http://127.0.0.1:8000/analyze
 * - Uses field name `file` for the image
 * - Optionally sends a `context` string
 * - Returns the backend JSON response without modifying it
 * - Handles network errors gracefully
 *
 * NOTE: This function is the ONLY place the extension should talk to the backend.
 */
async function sendChartForAnalysis({
  blob,
  dataUrl,
  tabId,
  captureVisible = false,
  crop,
  context,
  timeoutMs = 120000,
} = {}) {
  let imageBlob = blob;

  if (!imageBlob && dataUrl) {
    imageBlob = await dataUrlToBlob(dataUrl);
  }

  if (!imageBlob && captureVisible) {
    const tab = tabId ? await chrome.tabs.get(tabId) : (await chrome.tabs.query({ active: true, currentWindow: true }))[0];
    if (!tab?.windowId) {
      throw new Error("No tab/window available for screenshot capture");
    }
    const screenshotDataUrl = await captureVisibleTabPng(tab.windowId);
    imageBlob = await dataUrlToBlob(screenshotDataUrl);
  }

  if (imageBlob && crop) {
    imageBlob = await cropImageBlob(imageBlob, crop);
  }

  if (!imageBlob) {
    throw new Error("No image provided for analysis");
  }

  const contentType = imageBlob.type || "image/png";
  const filename = contentType.includes("jpeg") ? "chart.jpg" : "chart.png";

  const formData = new FormData();
  formData.append("file", imageBlob, filename);
  if (typeof context === "string" && context.trim().length > 0) {
    formData.append("context", context);
  }

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

  try {
    console.debug("[LiquiSight] sendChartForAnalysis ->", BACKEND_ANALYZE_URL);
    const response = await fetch(BACKEND_ANALYZE_URL, {
      method: "POST",
      body: formData,
      signal: abortController.signal,
    });

    console.debug("[LiquiSight] sendChartForAnalysis <- status", response.status);

    if (!response.ok) {
      let errorDetail = "";
      try {
        const errorJson = await response.json();
        errorDetail = typeof errorJson?.detail === "string" ? errorJson.detail : JSON.stringify(errorJson);
      } catch {
        try {
          errorDetail = await response.text();
        } catch {
          errorDetail = "";
        }
      }
      const suffix = errorDetail ? `: ${errorDetail}` : "";
      throw new Error(`Backend error (${response.status})${suffix}`);
    }

    return await response.json();
  } catch (err) {
    console.debug("[LiquiSight] sendChartForAnalysis error", err);
    if (err?.name === "AbortError") {
      throw new Error("Analysis request timed out. Is the backend running on http://127.0.0.1:8000?");
    }
    if (err instanceof TypeError) {
      throw new Error("Network error contacting backend. Is it running on http://127.0.0.1:8000?");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * sendChatMessage
 *
 * Sends a chat message to the backend, which in turn uses OpenRouter.
 * Returns `{ reply: string }` JSON without modifying it.
 */
async function sendChatMessage({
  message,
  context,
  imageBase64,
  imageMime = "image/png",
  timeoutMs = 60000,
} = {}) {
  if (typeof message !== "string" || message.trim().length === 0) {
    throw new Error("Message is required");
  }

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

  try {
    console.debug("[LiquiSight] sendChatMessage ->", BACKEND_CHAT_URL);
    const response = await fetch(BACKEND_CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        context,
        image_base64: imageBase64,
        image_mime: imageMime,
      }),
      signal: abortController.signal,
    });

    console.debug("[LiquiSight] sendChatMessage <- status", response.status);

    if (!response.ok) {
      let errorDetail = "";
      try {
        const errorJson = await response.json();
        errorDetail = typeof errorJson?.detail === "string" ? errorJson.detail : JSON.stringify(errorJson);
      } catch {
        try {
          errorDetail = await response.text();
        } catch {
          errorDetail = "";
        }
      }
      const suffix = errorDetail ? `: ${errorDetail}` : "";
      throw new Error(`Backend error (${response.status})${suffix}`);
    }

    return await response.json();
  } catch (err) {
    console.debug("[LiquiSight] sendChatMessage error", err);
    if (err?.name === "AbortError") {
      throw new Error("Chat request timed out. Is the backend running on http://127.0.0.1:8000?");
    }
    if (err instanceof TypeError) {
      throw new Error("Network error contacting backend. Is it running on http://127.0.0.1:8000?");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request?.action === "sendChartForAnalysis") {
    (async () => {
      try {
        const result = await sendChartForAnalysis({
          blob: request.blob,
          dataUrl: request.dataUrl,
          tabId: sender?.tab?.id,
          captureVisible: !!request.captureVisible,
          crop: request.crop,
          context: request.context,
        });
        sendResponse({ ok: true, result });
      } catch (e) {
        sendResponse({ ok: false, error: e?.message || "Unknown error" });
      }
    })();

    return true;
  }

  if (request?.action === "sendChatMessage") {
    (async () => {
      try {
        const result = await sendChatMessage({
          message: request.message,
          context: request.context,
          imageBase64: request.imageBase64,
          imageMime: request.imageMime,
        });
        sendResponse({ ok: true, result });
      } catch (e) {
        sendResponse({ ok: false, error: e?.message || "Unknown error" });
      }
    })();

    return true;
  }
});