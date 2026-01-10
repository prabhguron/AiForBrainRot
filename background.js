// Default settings
const DEFAULT_SETTINGS = {
  questionInterval: 300, // 5 minutes
  rewardTime: 300,
  blockedSites: ['youtube.com', 'instagram.com', 'tiktok.com', 'twitter.com', 'reddit.com', 'facebook.com'],
  isActive: true
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['settings', 'timeRemaining', 'lastUpdate'], (result) => {
    if (!result.settings) {
      chrome.storage.local.set({ 
        settings: DEFAULT_SETTINGS,
        timeRemaining: 0,
        lastUpdate: Date.now(),
        needsChallenge: true
      });
    }
  });
});

function isBlocked(url) {
  return new Promise((resolve) => {
    chrome.storage.local.get(['settings'], (result) => {
      const settings = result.settings || DEFAULT_SETTINGS;
      const blocked = settings.blockedSites.some(site => url.includes(site));
      resolve(blocked);
    });
  });
}

// Listen for navigation to blocked sites
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0) return; // Only main frame
  
  const blocked = await isBlocked(details.url);
  if (!blocked) return;

  chrome.storage.local.get(['timeRemaining', 'needsChallenge', 'settings'], (result) => {
    const timeRemaining = result.timeRemaining || 0;
    const needsChallenge = result.needsChallenge !== false;
    
    // If time is up or first visit, redirect to challenge
    if (timeRemaining <= 0 || needsChallenge) {
      // Store the blocked site URL to redirect back after challenge
      chrome.storage.local.set({ blockedSiteUrl: details.url });
      chrome.tabs.update(details.tabId, {
        url: chrome.runtime.getURL('challenge.html')
      });
    }
  });
});

// Timer countdown
setInterval(() => {
  chrome.storage.local.get(['timeRemaining', 'settings'], (result) => {
    let timeRemaining = result.timeRemaining || 0;
    
    if (timeRemaining > 0) {
      timeRemaining--;
      chrome.storage.local.set({ 
        timeRemaining,
        needsChallenge: timeRemaining <= 0
      });
    }
  });
}, 1000);

// Listen for messages from challenge page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'challengeComplete') {
    chrome.storage.local.get(['settings', 'blockedSiteUrl'], (result) => {
      const settings = result.settings || DEFAULT_SETTINGS;
      const blockedSiteUrl = result.blockedSiteUrl || null;
      chrome.storage.local.set({
        timeRemaining: settings.rewardTime,
        needsChallenge: false,
        blockedSiteUrl: null
      }, () => {
        sendResponse({ success: true, blockedSiteUrl });
      });
    });
    return true; // Keep channel open for async response
  }
  
  if (message.type === 'getTimeRemaining') {
    chrome.storage.local.get(['timeRemaining'], (result) => {
      sendResponse({ timeRemaining: result.timeRemaining || 0 });
    });
    return true;
  }
});