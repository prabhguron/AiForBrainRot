// Check time remaining periodically
setInterval(async () => {
  const result = await chrome.storage.local.get(['timeRemaining', 'settings']);
  const timeRemaining = result.timeRemaining || 0;
  const settings = result.settings || {};
  
  // Check if current site is blocked
  const isBlocked = settings.blockedSites?.some(site => window.location.href.includes(site));
  
  if (isBlocked && timeRemaining <= 0) {
    window.location.href = chrome.runtime.getURL('challenge.html');
  }
}, 2000);