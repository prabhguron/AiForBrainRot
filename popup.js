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
  
  chrome.storage.local.get(['settings'], (result) => {
    const settings = result.settings || {};
    settings.questionInterval = questionInterval;
    settings.rewardTime = rewardTime;
    
    chrome.storage.local.set({ settings }, () => {
      const msg = document.getElementById('saveMessage');
      msg.textContent = '✅ Settings saved!';
      msg.className = 'p-2 rounded-lg text-sm text-center bg-green-100 text-green-800';
      msg.classList.remove('hidden');
      
      setTimeout(() => {
        msg.classList.add('hidden');
      }, 2000);
    });
  });
});