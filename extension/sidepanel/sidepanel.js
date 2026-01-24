// LiquiSight Side Panel Controller

class LiquiSightPanel {
  constructor() {
    this.chatContainer = document.getElementById('chatContainer');
    this.userInput = document.getElementById('userInput');
    this.sendBtn = document.getElementById('sendBtn');
    this.scanPageBtn = document.getElementById('scanPageBtn');
    this.captureBtn = document.getElementById('captureBtn');
    this.attachBtn = document.getElementById('attachBtn');
    this.clearChatBtn = document.getElementById('clearChatBtn');
    this.settingsBtn = document.getElementById('settingsBtn');
    this.tabTitle = document.getElementById('tabTitle');
    
    this.isProcessing = false;
    this.currentScreenshot = null;
    
    this.init();
  }

  async init() {
    this.bindEvents();
    this.loadChatHistory();
    this.updateCurrentTab();
    this.autoResizeTextarea();
  }

  bindEvents() {
    // Send message
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    
    // Enter to send, Shift+Enter for new line
    this.userInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Auto-resize textarea
    this.userInput.addEventListener('input', () => this.autoResizeTextarea());

    // Quick action buttons
    this.scanPageBtn.addEventListener('click', () => this.scanPage());
    this.captureBtn.addEventListener('click', () => this.captureScreen());
    this.attachBtn.addEventListener('click', () => this.captureScreen());

    // Header buttons
    this.clearChatBtn.addEventListener('click', () => this.clearChat());
    this.settingsBtn.addEventListener('click', () => this.showSettings());

    // Listen for tab changes
    chrome.tabs.onActivated.addListener(() => this.updateCurrentTab());
    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
      if (changeInfo.title) this.updateCurrentTab();
    });
  }

  async updateCurrentTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        this.tabTitle.textContent = tab.title || 'Current Tab';
      }
    } catch (e) {
      this.tabTitle.textContent = 'Current Tab';
    }
  }

  autoResizeTextarea() {
    this.userInput.style.height = 'auto';
    this.userInput.style.height = Math.min(this.userInput.scrollHeight, 120) + 'px';
  }

  async sendMessage() {
    const message = this.userInput.value.trim();
    if (!message || this.isProcessing) return;

    this.addMessage('user', message);
    this.userInput.value = '';
    this.autoResizeTextarea();
    
    await this.getAIResponse(message);
  }

  addMessage(role, content, isHtml = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    
    if (role === 'assistant') {
      avatar.innerHTML = `
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 28L15 18L22 24L32 12" stroke="#00D4FF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="32" cy="12" r="4" fill="#00D4FF"/>
        </svg>
      `;
    } else {
      avatar.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      `;
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (isHtml) {
      contentDiv.innerHTML = content;
    } else {
      contentDiv.innerHTML = `<p>${this.formatMessage(content)}</p>`;
    }
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    this.chatContainer.appendChild(messageDiv);
    
    this.scrollToBottom();
    this.saveChatHistory();
  }

  formatMessage(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
      <div class="message-avatar">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 28L15 18L22 24L32 12" stroke="#00D4FF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="32" cy="12" r="4" fill="#00D4FF"/>
        </svg>
      </div>
      <div class="message-content">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    this.chatContainer.appendChild(typingDiv);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  }

  scrollToBottom() {
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
  }

  setButtonLoading(btn, loading) {
    if (loading) {
      btn.classList.add('loading');
      btn.disabled = true;
    } else {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  }

  async getAIResponse(message, imageBase64 = null) {
    this.isProcessing = true;
    this.showTypingIndicator();

    try {
      // Create the prompt
      const systemContext = `You are LiquiSight, an AI Financial Copilot assistant. You help users analyze financial content, stock charts, market data, and provide insights. Be concise, helpful, and use bullet points when listing multiple items. Format important numbers and percentages clearly.`;
      
      const prompt = imageBase64 
        ? `${systemContext}\n\nThe user has shared a screenshot. Analyze this image and identify any financial information, stock data, charts, prices, tickers, or market indicators visible. Provide clear insights and observations. If no financial data is found, describe what you see and offer to help with financial questions.\n\nUser message: ${message || 'What can you tell me about this?'}`
        : `${systemContext}\n\nUser: ${message}`;

      const data = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
          {
            action: 'sendChatMessage',
            message: prompt,
            context: this.tabTitle?.textContent || undefined,
            imageBase64: imageBase64 || undefined,
            imageMime: 'image/png'
          },
          (response) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
              return;
            }
            if (!response?.ok) {
              reject(new Error(response?.error || 'Chat request failed'));
              return;
            }
            resolve(response.result);
          }
        );
      });

      const aiMessage = data?.reply || 'Sorry, I could not process that request.';
      
      this.hideTypingIndicator();
      this.addMessage('assistant', aiMessage);

    } catch (error) {
      console.error('AI Response Error:', error);
      this.hideTypingIndicator();
      this.addMessage('assistant', `
        <div class="error-message">
          <strong>⚠️ Error:</strong> ${error.message}<br><br>
          <small>Please check that the backend is running on http://127.0.0.1:8000 and that OPENROUTER_API_KEY is set in the root .env.</small>
        </div>
      `, true);
    }

    this.isProcessing = false;
  }

  async scanPage() {
    if (this.isProcessing) return;
    
    this.setButtonLoading(this.scanPageBtn, true);
    this.addMessage('user', '📊 Scan this page for financial data');
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      chrome.tabs.captureVisibleTab(null, { format: 'png', quality: 90 }, async (dataUrl) => {
        this.setButtonLoading(this.scanPageBtn, false);
        
        if (chrome.runtime.lastError) {
          this.addMessage('assistant', `
            <div class="error-message">
              Could not capture page: ${chrome.runtime.lastError.message}
            </div>
          `, true);
          return;
        }
        
        const imageBase64 = dataUrl.split(',')[1];
        
        // Show the captured image
        this.addMessage('assistant', `
          <p>📸 <strong>Page captured!</strong> Analyzing for financial data...</p>
          <img src="${dataUrl}" class="message-image" alt="Page screenshot" style="max-height: 180px; object-fit: contain; width: 100%;">
        `, true);
        
        // Analyze with AI
        await this.getAIResponse('Analyze this page and identify any stocks, tickers, prices, charts, financial data, or market information. Provide a summary of key insights.', imageBase64);
      });
    } catch (error) {
      this.setButtonLoading(this.scanPageBtn, false);
      this.addMessage('assistant', `<div class="error-message">Error: ${error.message}</div>`, true);
    }
  }

  async captureScreen() {
    if (this.isProcessing) return;
    
    this.setButtonLoading(this.captureBtn, true);
    this.addMessage('user', '📷 Take a screenshot and analyze');
    
    try {
      chrome.tabs.captureVisibleTab(null, { format: 'png', quality: 90 }, async (dataUrl) => {
        this.setButtonLoading(this.captureBtn, false);
        
        if (chrome.runtime.lastError) {
          this.addMessage('assistant', `
            <div class="error-message">
              Could not capture: ${chrome.runtime.lastError.message}
            </div>
          `, true);
          return;
        }
        
        const imageBase64 = dataUrl.split(',')[1];
        
        this.addMessage('assistant', `
          <p>📷 <strong>Screenshot captured!</strong></p>
          <img src="${dataUrl}" class="message-image" alt="Screenshot" style="max-height: 180px; object-fit: contain; width: 100%;">
          <p class="message-hint" style="margin-top: 10px;">Analyzing the content...</p>
        `, true);
        
        await this.getAIResponse('What do you see in this screenshot? If there is any financial, stock, or market data, analyze it and provide insights.', imageBase64);
      });
    } catch (error) {
      this.setButtonLoading(this.captureBtn, false);
      this.addMessage('assistant', `<div class="error-message">Error: ${error.message}</div>`, true);
    }
  }

  clearChat() {
    // Keep only the welcome message
    this.chatContainer.innerHTML = `
      <div class="message assistant">
        <div class="message-avatar">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 28L15 18L22 24L32 12" stroke="#00D4FF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="32" cy="12" r="4" fill="#00D4FF"/>
          </svg>
        </div>
        <div class="message-content">
          <p>Chat cleared! How can I help you with financial analysis?</p>
        </div>
      </div>
    `;
    chrome.storage.local.set({ chatHistory: [] });
  }

  showSettings() {
    this.addMessage('assistant', `
      <div class="analysis-section">
        <h4>⚙️ LiquiSight Settings</h4>
        <ul>
          <li><strong>Version:</strong> 1.0.0</li>
          <li><strong>AI Model:</strong> Gemini 1.5 Flash</li>
          <li><strong>API Status:</strong> <span style="color: #00FF88;">Connected</span></li>
          <li><strong>Shortcut:</strong> Alt + L to open panel</li>
        </ul>
      </div>
      <p class="message-hint">More settings coming soon!</p>
    `, true);
  }

  saveChatHistory() {
    const messages = Array.from(this.chatContainer.querySelectorAll('.message')).map(msg => ({
      role: msg.classList.contains('user') ? 'user' : 'assistant',
      content: msg.querySelector('.message-content').innerHTML
    }));
    
    // Keep only last 30 messages
    const historyToSave = messages.slice(-30);
    chrome.storage.local.set({ chatHistory: historyToSave });
  }

  async loadChatHistory() {
    try {
      const result = await chrome.storage.local.get(['chatHistory']);
      if (result.chatHistory && result.chatHistory.length > 1) {
        // Clear default welcome and restore history
        this.chatContainer.innerHTML = '';
        
        result.chatHistory.forEach(msg => {
          const messageDiv = document.createElement('div');
          messageDiv.className = `message ${msg.role}`;
          
          const avatar = document.createElement('div');
          avatar.className = 'message-avatar';
          
          if (msg.role === 'assistant') {
            avatar.innerHTML = `
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 28L15 18L22 24L32 12" stroke="#00D4FF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="32" cy="12" r="4" fill="#00D4FF"/>
              </svg>
            `;
          } else {
            avatar.innerHTML = `
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            `;
          }
          
          const contentDiv = document.createElement('div');
          contentDiv.className = 'message-content';
          contentDiv.innerHTML = msg.content;
          
          messageDiv.appendChild(avatar);
          messageDiv.appendChild(contentDiv);
          this.chatContainer.appendChild(messageDiv);
        });
        
        this.scrollToBottom();
      }
    } catch (e) {
      console.log('Could not load chat history');
    }
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  new LiquiSightPanel();
});
