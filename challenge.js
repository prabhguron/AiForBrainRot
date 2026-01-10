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
  msgEl.className = `mb-4 p-4 rounded-lg ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`;
  msgEl.classList.remove('hidden');
  
  setTimeout(() => {
    msgEl.classList.add('hidden');
  }, 3000);
}

// Load new question
function loadQuestion() {
  currentQuestion = generateQuestion();
  document.getElementById('question').textContent = currentQuestion.text;
  document.getElementById('answer').value = '';
  document.getElementById('answer').focus();
}

// Check answer
function checkAnswer() {
  const userAnswer = parseInt(document.getElementById('answer').value);
  
  if (isNaN(userAnswer)) {
    showMessage('Please enter a number!', false);
    return;
  }

  if (userAnswer === currentQuestion.answer) {
    score++;
    streak++;
    localStorage.setItem('brainrot_score', score);
    localStorage.setItem('brainrot_streak', streak);
    
    document.getElementById('score').textContent = score;
    document.getElementById('streak').textContent = streak;
    
    showMessage('🎉 Correct! You earned 5 minutes!', true);
    
    // Tell background script to grant time
    chrome.runtime.sendMessage({ type: 'challengeComplete' }, () => {
      setTimeout(() => {
        window.close();
        window.history.back();
      }, 1500);
    });
  } else {
    streak = 0;
    localStorage.setItem('brainrot_streak', streak);
    document.getElementById('streak').textContent = streak;
    
    showMessage(`❌ Wrong! The answer was ${currentQuestion.answer}. Try again!`, false);
    loadQuestion();
  }
}

// Event listeners
document.getElementById('submitBtn').addEventListener('click', checkAnswer);
document.getElementById('answer').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') checkAnswer();
});

// Initialize
loadQuestion();