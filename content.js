// Check time remaining periodically
setInterval(async () => {
  const result = await chrome.storage.local.get(['timeRemaining', 'settings', 'challengeMode']);
  const timeRemaining = result.timeRemaining || 0;
  const settings = result.settings || {};
  const challengeMode = result.challengeMode || 'multiplayer'; // Default to multiplayer
  
  // Check if current site is blocked
  const isBlocked = settings.blockedSites?.some(site => window.location.href.includes(site));
  
  if (isBlocked && timeRemaining <= 0) {
    // Redirect to multiplayer by default (more impressive for hackathon)
    const challengePage = challengeMode === 'single' ? 'challenge.html' : 'multiplayer.html';
    window.location.href = chrome.runtime.getURL(challengePage);
  }
}, 2000);