let currentQuestion = null;
let score = parseInt(localStorage.getItem('brainrot_score') || '0');
let streak = parseInt(localStorage.getItem('brainrot_streak') || '0');

// Update display
document.getElementById('score').textContent = score;
document.getElementById('streak').textContent = streak;

// Generate math question
function generateQuestion() {
  const operations = ['+', '-', '*'];
  const op = operations[Math.floor(Math.random() * operations.length)];
  let num1, num2, answer;

  if (op === '*') {
    num1 = Math.floor(Math.random() * 12) + 1;
    num2 = Math.floor(Math.random() * 12) + 1;
    answer = num1 * num2;
  } else if (op === '+') {
    num1 = Math.floor(Math.random() * 50) + 1;
    num2 = Math.floor(Math.random() * 50) + 1;
    answer = num1 + num2;
  } else {
    num2 = Math.floor(Math.random() * 30) + 1;
    num1 = num2 + Math.floor(Math.random() * 50);
    answer = num1 - num2;
  }

  return { text: `${num1} ${op} ${num2} = ?`, answer };
}

// Show message
function showMessage(text, isSuccess) {
  const msgEl = document.getElementById('message');
  msgEl.textContent = text;
  msgEl.className = `alert visible ${isSuccess ? 'alert-success' : 'alert-error'}`;
  
  // React emoji
  const emoji = document.getElementById('emojiFace');
  emoji.textContent = isSuccess ? '😊' : '😠';
  
  setTimeout(() => {
        loadQuestion();
    msgEl.classList.remove('visible');
    if (isSuccess) {
      emoji.textContent = '😊';
    } 
  }, 2000);
}

// Load new question
function loadQuestion() {
  currentQuestion = generateQuestion();
  document.getElementById('question').textContent = currentQuestion.text;
  document.getElementById('answer').value = '';
  document.getElementById('answer').focus();
  document.getElementById('emojiFace').textContent = '🤔';
}

// Check answer
function checkAnswer() {
  const userAnswer = parseInt(document.getElementById('answer').value);
  
  if (userAnswer === currentQuestion.answer) {
    score++;
    streak++;
    localStorage.setItem('brainrot_score', score);
    localStorage.setItem('brainrot_streak', streak);
    
    document.getElementById('score').textContent = score;
    document.getElementById('streak').textContent = streak;
    
    showMessage('🎉 Correct! You earned 5 minutes!', true);
    
    // Tell background script to grant time
    chrome.runtime.sendMessage({ type: 'challengeComplete' }, (response) => {
      setTimeout(() => {
        const blockedSiteUrl = response && response.blockedSiteUrl;
        if (blockedSiteUrl) {
          // Redirect back to the blocked site
          window.location.href = blockedSiteUrl;
        } else {
          // Fallback: go back in history
          window.history.back();
        }
      }, 1500);
    });
  } else if  (userAnswer != currentQuestion.answer) {
    streak = 0;
    localStorage.setItem('brainrot_streak', streak);
    document.getElementById('streak').textContent = streak;
    showMessage('workinginginging', false);
  }
}

// Event listeners
document.getElementById('submitBtn').addEventListener('click', checkAnswer);
document.getElementById('answer').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') checkAnswer();
});

// Initialize
loadQuestion();