// Load settings
chrome.storage.local.get(['settings', 'timeRemaining'], (result) => {
  const settings = result.settings || { questionInterval: 300, rewardTime: 300 };
  
  document.getElementById('questionInterval').value = settings.questionInterval / 60;
  document.getElementById('rewardTime').value = settings.rewardTime / 60;
  
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
    li.className = 'blocked-item-empty';
    li.textContent = 'No blocked sites';
    list.appendChild(li);
    return;
  }

  arr.forEach(site => {
    const li = document.createElement('li');
    li.className = 'blocked-item';
    li.innerHTML = `
      <span class="blocked-item-text">${site}</span>
      <button data-site="${site}" class="removeBtn btn btn-danger">Remove</button>
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
  const blockedInput = document.getElementById('blockedSite').value.trim();
  
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
    
    chrome.storage.local.set({ settings }, () => {
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
  if (!e.target.matches || !e.target.matches('.removeBtn')) return;
  const site = e.target.dataset.site;
  if (!site) return;

  chrome.storage.local.get(['settings'], (result) => {
    const settings = result.settings || {};
    settings.blockedSites = (settings.blockedSites || []).filter(s => s !== site);
    chrome.storage.local.set({ settings }, () => {
      renderBlockedSites(settings.blockedSites);
      const msg = document.getElementById('saveMessage');
      msg.textContent = 'Removed ' + site;
      msg.className = 'p-2 rounded-lg text-sm text-center bg-yellow-100 text-yellow-800';
      msg.classList.remove('hidden');
      setTimeout(() => msg.classList.add('hidden'), 1500);
    });
  });
});

// Initial render of blocked sites when popup opens
chrome.storage.local.get(['settings', 'timeRemaining'], (result) => {
  const settings = result.settings || { questionInterval: 300, rewardTime: 300 };
  renderBlockedSites(settings.blockedSites);
});