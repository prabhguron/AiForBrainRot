// Load settings
chrome.storage.local.get(['settings', 'timeRemaining', 'challengeMode', 'firebaseConfig'], (result) => {
  const settings = result.settings || { questionInterval: 300, rewardTime: 300 };
  const challengeMode = result.challengeMode || 'multiplayer';
  const firebaseConfig = result.firebaseConfig || {};
  
  document.getElementById('questionInterval').value = settings.questionInterval / 60;
  document.getElementById('rewardTime').value = settings.rewardTime / 60;
  document.getElementById('challengeMode').value = challengeMode;
  
  // Load Firebase config if exists
  if (firebaseConfig.apiKey) document.getElementById('firebaseApiKey').value = firebaseConfig.apiKey;
  if (firebaseConfig.projectId) document.getElementById('firebaseProjectId').value = firebaseConfig.projectId;
  if (firebaseConfig.databaseURL) document.getElementById('firebaseDatabaseUrl').value = firebaseConfig.databaseURL;
  if (firebaseConfig.messagingSenderId) document.getElementById('firebaseMessagingSenderId').value = firebaseConfig.messagingSenderId;
  if (firebaseConfig.appId) document.getElementById('firebaseAppId').value = firebaseConfig.appId;
  
  updateTimeDisplay(result.timeRemaining || 0);
});

// Update time display every second
setInterval(() => {
  chrome.storage.local.get(['timeRemaining'], (result) => {
    updateTimeDisplay(result.timeRemaining || 0);
  });
}, 1000);

// Render blocked sites list in the popup
function renderBlockedSites(sites) {
  const list = document.getElementById('blockedList');
  if (!list) return;
  list.innerHTML = '';
  const arr = Array.isArray(sites) ? sites : [];
  if (arr.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No blocked sites yet';
    li.style.textAlign = 'center';
    li.style.opacity = '0.6';
    list.appendChild(li);
    return;
  }

  arr.forEach(site => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${site}</span>
      <button data-site="${site}" class="remove-btn">Remove</button>
    `;
    list.appendChild(li);
  });
}

function updateTimeDisplay(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  document.getElementById('timeDisplay').textContent = 
    `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Save settings
document.getElementById('saveBtn').addEventListener('click', () => {
  const questionInterval = parseInt(document.getElementById('questionInterval').value) * 60;
  const rewardTime = parseInt(document.getElementById('rewardTime').value) * 60;
  const challengeMode = document.getElementById('challengeMode').value;
  const blockedInput = document.getElementById('blockedSite').value.trim();
  
  // Get Firebase config
  const firebaseApiKey = document.getElementById('firebaseApiKey').value.trim();
  const firebaseProjectId = document.getElementById('firebaseProjectId').value.trim();
  const firebaseDatabaseUrl = document.getElementById('firebaseDatabaseUrl').value.trim();
  const firebaseMessagingSenderId = document.getElementById('firebaseMessagingSenderId').value.trim();
  const firebaseAppId = document.getElementById('firebaseAppId').value.trim();
  
  chrome.storage.local.get(['settings'], (result) => {
    const settings = result.settings || {};
    settings.questionInterval = questionInterval;
    settings.rewardTime = rewardTime;
    // Ensure blockedSites exists
    if (!Array.isArray(settings.blockedSites)) settings.blockedSites = [];
    console.log('Current blocked sites:', settings.blockedSites);

    // If user entered a domain, normalize and add it
    if (blockedInput) {
      let domain = blockedInput.toLowerCase();
          console.log('Current blocked sites:', settings.blockedSites);

      domain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      if (domain && !settings.blockedSites.includes(domain)) {
        settings.blockedSites.push(domain);
      }
    }
    
    // Build Firebase config if any fields are filled
    let firebaseConfig = null;
    if (firebaseApiKey && firebaseApiKey !== 'YOUR_API_KEY') {
      firebaseConfig = {
        apiKey: firebaseApiKey,
        authDomain: firebaseProjectId ? `${firebaseProjectId}.firebaseapp.com` : undefined,
        databaseURL: firebaseDatabaseUrl || (firebaseProjectId ? `https://${firebaseProjectId}-default-rtdb.firebaseio.com/` : undefined),
        projectId: firebaseProjectId,
        storageBucket: firebaseProjectId ? `${firebaseProjectId}.appspot.com` : undefined,
        messagingSenderId: firebaseMessagingSenderId,
        appId: firebaseAppId
      };
    }
    
    chrome.storage.local.set({ 
      settings,
      challengeMode,
      firebaseConfig: firebaseConfig
    }, () => {
      // Clear the blockedSite input after saving
      document.getElementById('blockedSite').value = '';

      // Re-render the blocked list
      renderBlockedSites(settings.blockedSites);

      const msg = document.getElementById('saveMessage');
      msg.textContent = '✅ Settings saved!';
      msg.className = 'save-message visible save-message-success';
      
      setTimeout(() => {
        msg.classList.remove('visible');
      }, 2000);
    });
  });
});

// Listen for remove clicks from the blocked list
document.addEventListener('click', (e) => {
  if (!e.target.matches || !e.target.matches('.remove-btn')) return;
  const site = e.target.dataset.site;
  if (!site) return;

  chrome.storage.local.get(['settings'], (result) => {
    const settings = result.settings || {};
    settings.blockedSites = (settings.blockedSites || []).filter(s => s !== site);
    chrome.storage.local.set({ settings }, () => {
      renderBlockedSites(settings.blockedSites);
      const msg = document.getElementById('saveMessage');
      msg.textContent = '✅ ' + site + ' removed!';
      msg.className = 'save-message visible save-message-success';
      setTimeout(() => msg.classList.remove('visible'), 1500);
    });
  });
});

// Initial render of blocked sites when popup opens
chrome.storage.local.get(['settings', 'timeRemaining'], (result) => {
  const settings = result.settings || { questionInterval: 300, rewardTime: 300 };
  renderBlockedSites(settings.blockedSites);
});