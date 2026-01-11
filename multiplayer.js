// Firebase configuration loaded from firebase-config.js (generated from env vars)
// Initialize Firebase (only if config is valid)
let db = null;
let userId = null;
let currentMatchId = null;
let isPlayer1 = false;
let gameState = null;

// Load Firebase config - first try from Chrome storage (set via popup), then from firebase-config.js
async function loadFirebaseConfig() {
  return new Promise((resolve) => {
    // Try to load from Chrome storage first (set via popup settings)
    chrome.storage.local.get(['firebaseConfig'], (result) => {
      if (result.firebaseConfig && result.firebaseConfig.apiKey && result.firebaseConfig.apiKey !== "YOUR_API_KEY") {
        resolve(result.firebaseConfig);
        return;
      }
      
      // Fallback to firebase-config.js (generated from env vars)
      if (typeof firebaseConfig !== 'undefined' && firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
        resolve(firebaseConfig);
        return;
      }
      
      // No valid config found
      resolve(null);
    });
  });
}

// Initialize Firebase
(async () => {
  // Always generate userId (needed for demo mode too)
  userId = generateUserId();
  
  const config = await loadFirebaseConfig();
  
  if (config && config.apiKey && config.apiKey !== "YOUR_API_KEY") {
    try {
      if (typeof firebase !== 'undefined') {
        firebase.initializeApp(config);
        db = firebase.database();
        console.log("✅ Firebase initialized successfully");
      } else {
        console.warn("⚠️ Firebase SDK not loaded");
        db = null;
      }
    } catch (error) {
      console.error("❌ Firebase initialization error:", error);
      db = null;
    }
  } else {
    // Fallback mode for demo (no Firebase)
    console.warn("⚠️ Firebase not configured. Using demo mode.");
    db = null;
  }
})();

// Generate unique user ID
function generateUserId() {
  return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// Generic question bank
const questions = [
  { question: "What is the capital of France?", answer: "paris" },
  { question: "How many continents are there?", answer: "7" },
  { question: "What is the largest planet in our solar system?", answer: "jupiter" },
  { question: "Who painted the Mona Lisa?", answer: "leonardo da vinci" },
  { question: "What is 15 × 8?", answer: "120" },
  { question: "What is the smallest prime number?", answer: "2" },
  { question: "In what year did World War II end?", answer: "1945" },
  { question: "What is the chemical symbol for gold?", answer: "au" },
  { question: "How many sides does a hexagon have?", answer: "6" },
  { question: "What is the square root of 64?", answer: "8" },
  { question: "Who wrote 'Romeo and Juliet'?", answer: "william shakespeare" },
  { question: "What is the speed of light in vacuum (approximately)?", answer: "300000" },
  { question: "What is the largest ocean?", answer: "pacific" },
  { question: "How many minutes are in an hour?", answer: "60" },
  { question: "What is the capital of Japan?", answer: "tokyo" },
  { question: "What is 25% of 80?", answer: "20" },
  { question: "What is the hardest natural substance?", answer: "diamond" },
  { question: "How many legs does a spider have?", answer: "8" },
  { question: "What is the capital of Australia?", answer: "canberra" },
  { question: "What is 12 × 12?", answer: "144" },
  { question: "Who invented the telephone?", answer: "alexander graham bell" },
  { question: "What is the freezing point of water in Celsius?", answer: "0" },
  { question: "How many chambers does a human heart have?", answer: "4" },
  { question: "What is the capital of Brazil?", answer: "brasilia" },
  { question: "What is 100 - 37?", answer: "63" },
  { question: "What is the largest mammal?", answer: "blue whale" },
  { question: "How many days are in a leap year?", answer: "366" },
  { question: "What is the capital of Egypt?", answer: "cairo" },
  { question: "What is 3 to the power of 3?", answer: "27" },
  { question: "Who discovered gravity?", answer: "isaac newton" }
];

let currentQuestion = null;
let yourScore = 0;
let opponentScore = 0;
let roundNumber = 1;
let hasAnswered = false;
let matchmakingInterval = null;

// DOM elements
const matchmakingScreen = document.getElementById('matchmakingScreen');
const gameScreen = document.getElementById('gameScreen');
const resultsScreen = document.getElementById('resultsScreen');
const matchmakingText = document.getElementById('matchmakingText');
const cancelMatchmakingBtn = document.getElementById('cancelMatchmaking');
const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const submitBtn = document.getElementById('submitBtn');
const yourScoreEl = document.getElementById('yourScore');
const opponentScoreEl = document.getElementById('opponentScore');
const opponentNameEl = document.getElementById('opponentName');
const roundNumberEl = document.getElementById('roundNumber');
const winsEl = document.getElementById('wins');
const messageEl = document.getElementById('message');
const continueBtn = document.getElementById('continueBtn');

// Normalize answer for comparison
function normalizeAnswer(answer) {
  return answer.toString().toLowerCase().trim();
}

// Get random question
function getRandomQuestion() {
  return questions[Math.floor(Math.random() * questions.length)];
}

// Show message
function showMessage(text, isSuccess) {
  messageEl.textContent = text;
  messageEl.className = `alert visible ${isSuccess ? 'alert-success' : 'alert-error'}`;
  setTimeout(() => {
    messageEl.classList.remove('visible');
  }, 3000);
}

// Start matchmaking
async function startMatchmaking() {
  // Wait a bit for Firebase to initialize if needed
  if (!db) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const config = await loadFirebaseConfig();
    if (config && config.apiKey !== "YOUR_API_KEY") {
      try {
        if (typeof firebase !== 'undefined') {
          if (!firebase.apps || !firebase.apps.length) {
            firebase.initializeApp(config);
          }
          db = firebase.database();
          userId = generateUserId();
          console.log("✅ Firebase initialized in delayed start");
        } else {
          console.warn("⚠️ Firebase SDK still not available; continuing in demo mode.");
        }
      } catch (e) {
        console.error("Firebase init error:", e);
        db = null;
      }
    }
  }
  
  if (!db) {
    // Demo mode - simulate matchmaking
    matchmakingText.textContent = "Demo mode: Starting match...";
    setTimeout(() => {
      startDemoGame();
    }, 2000);
    return;
  }

  matchmakingText.textContent = "Searching for opponent...";
  
  // Join matchmaking queue
  const queueRef = db.ref('matchmaking');
  queueRef.push({
    userId: userId,
    timestamp: Date.now()
  });

  // Listen for matches
  queueRef.on('child_added', (snapshot) => {
    const data = snapshot.val();
    if (data.userId !== userId) {
      // Found opponent
      const opponentId = data.userId;
      createMatch(userId, opponentId);
      queueRef.off();
    }
  });

  // Check if we can create a match
  queueRef.once('value', (snapshot) => {
    const queue = snapshot.val() || {};
    const queueArray = Object.values(queue);
    
    if (queueArray.length >= 2) {
      const [player1, player2] = queueArray.slice(0, 2);
      if (player1.userId === userId || player2.userId === userId) {
        createMatch(player1.userId, player2.userId);
        // Clear queue
        queueRef.remove();
      }
    }
  });
}

// Create match
function createMatch(player1Id, player2Id) {
  const matchId = 'match_' + Date.now();
  currentMatchId = matchId;
  isPlayer1 = player1Id === userId;

  const matchRef = db.ref(`matches/${matchId}`);
  matchRef.set({
    player1: player1Id,
    player2: player2Id,
    player1Score: 0,
    player2Score: 0,
    round: 1,
    question: null,
    player1Answered: false,
    player2Answered: false,
    winner: null,
    status: 'waiting'
  });

  // Set opponent name
  opponentNameEl.textContent = isPlayer1 ? 'Player 2' : 'Player 1';

  // Start listening to match
  listenToMatch(matchRef);
  
  // Start game
  matchRef.update({ status: 'playing' });
  startGame();
}

// Listen to match updates
function listenToMatch(matchRef) {
  matchRef.on('value', (snapshot) => {
    gameState = snapshot.val();
    if (!gameState) return;

    if (gameState.status === 'playing') {
      updateGameState();
    } else if (gameState.status === 'finished') {
      endGame(gameState.winner === userId);
    }
  });
}

// Update game state from Firebase
function updateGameState() {
  if (!gameState) return;

  const myScore = isPlayer1 ? gameState.player1Score : gameState.player2Score;
  const oppScore = isPlayer1 ? gameState.player2Score : gameState.player1Score;
  const myAnswered = isPlayer1 ? gameState.player1Answered : gameState.player2Answered;
  const oppAnswered = isPlayer1 ? gameState.player2Answered : gameState.player1Answered;

  yourScore = myScore;
  opponentScore = oppScore;
  yourScoreEl.textContent = yourScore;
  opponentScoreEl.textContent = opponentScore;
  winsEl.textContent = yourScore;
  roundNumberEl.textContent = gameState.round || 1;

  // Update question if it changed
  if (gameState.question && gameState.question.text !== questionEl.textContent) {
    currentQuestion = gameState.question;
    questionEl.textContent = currentQuestion.text;
    answerEl.value = '';
    answerEl.focus();
    hasAnswered = false;
  }

  // Check if opponent answered
  if (oppAnswered && !myAnswered) {
    showMessage("Opponent answered! Hurry up! ⚡", false);
  }

  // Check if round ended
  if (myAnswered && oppAnswered) {
    setTimeout(() => {
      if (gameState.status === 'playing') {
        nextRound();
      }
    }, 2000);
  }
}

// Start game
function startGame() {
  matchmakingScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  yourScore = 0;
  opponentScore = 0;
  roundNumber = 0; // Will be incremented in nextRound
  winsEl.textContent = yourScore;
  nextRound();
}

// Start demo game (no Firebase)
function startDemoGame() {
  matchmakingScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  opponentNameEl.textContent = 'Demo Opponent';
  yourScore = 0;
  opponentScore = 0;
  roundNumber = 0; // Will be incremented in nextRoundDemo
  winsEl.textContent = yourScore;
  nextRoundDemo();
}

// Next round
function nextRound() {
  if (!db || !currentMatchId) {
    nextRoundDemo();
    return;
  }

  roundNumber++;
  hasAnswered = false;
  const question = getRandomQuestion();
  currentQuestion = question;

  const matchRef = db.ref(`matches/${currentMatchId}`);
  matchRef.update({
    round: roundNumber,
    question: question,
    player1Answered: false,
    player2Answered: false
  });
}

// Next round (demo mode)
function nextRoundDemo() {
  if (roundNumber >= 5) {
    // End game after 5 rounds
    endGame(yourScore > opponentScore);
    return;
  }
  
  roundNumber++;
  hasAnswered = false;
  const question = getRandomQuestion();
  currentQuestion = question;
  questionEl.textContent = question.text;
  answerEl.value = '';
  answerEl.focus();
  roundNumberEl.textContent = roundNumber;
  
  // Simulate opponent answering (for demo)
  setTimeout(() => {
    if (!hasAnswered && Math.random() > 0.3) {
      // Opponent answers correctly 70% of the time
      opponentScore++;
      opponentScoreEl.textContent = opponentScore;
      showMessage("Opponent answered first! 😔", false);
      setTimeout(() => {
        if (roundNumber < 5) {
          nextRoundDemo();
        } else {
          endGame(yourScore > opponentScore);
        }
      }, 2000);
    }
  }, 3000 + Math.random() * 2000);
}

// Check answer
function checkAnswer() {
  if (hasAnswered) return;
  
  const userAnswer = normalizeAnswer(answerEl.value);
  const correctAnswer = normalizeAnswer(currentQuestion.answer);
  
  if (userAnswer === correctAnswer) {
    hasAnswered = true;
    yourScore++;
    yourScoreEl.textContent = yourScore;
    
    if (db && currentMatchId) {
      // Update Firebase
      const matchRef = db.ref(`matches/${currentMatchId}`);
      const updateData = {};
      if (isPlayer1) {
        updateData.player1Score = yourScore;
        updateData.player1Answered = true;
      } else {
        updateData.player2Score = yourScore;
        updateData.player2Answered = true;
      }
      matchRef.update(updateData);

      // Check if we won
      matchRef.once('value', (snapshot) => {
        const state = snapshot.val();
        const myScore = isPlayer1 ? state.player1Score : state.player2Score;
        const oppScore = isPlayer1 ? state.player2Score : state.player1Score;
        const myAnswered = isPlayer1 ? state.player1Answered : state.player2Answered;
        const oppAnswered = isPlayer1 ? state.player2Answered : state.player1Answered;

        // If opponent hasn't answered yet, we win this round
        if (myAnswered && !oppAnswered) {
          showMessage("🎉 Correct! Waiting for opponent...", true);
        } else if (myAnswered && oppAnswered) {
          // Both answered - check who was faster
          if (myScore > oppScore) {
            showMessage("🎉 You won this round!", true);
          } else if (myScore < oppScore) {
            showMessage("😔 Opponent won this round", false);
          } else {
            showMessage("🤝 Tie! Next round...", true);
          }
        }
      });
    } else {
      // Demo mode
      showMessage("🎉 Correct! You earned a point!", true);
      setTimeout(() => {
        if (roundNumber >= 5) {
          endGame(yourScore > opponentScore);
        } else {
          nextRoundDemo();
        }
      }, 2000);
    }
  } else {
    showMessage("❌ Wrong answer! Try again.", false);
    answerEl.value = '';
    answerEl.focus();
  }
}

// End game
function endGame(youWon) {
  gameScreen.classList.add('hidden');
  resultsScreen.classList.remove('hidden');

  const resultTitle = document.getElementById('resultTitle');
  const resultSubtitle = document.getElementById('resultSubtitle');
  const resultEmoji = document.getElementById('resultEmoji');
  const finalYourScore = document.getElementById('finalYourScore');
  const finalOpponentScore = document.getElementById('finalOpponentScore');
  const timeReward = document.getElementById('timeReward');

  finalYourScore.textContent = yourScore;
  finalOpponentScore.textContent = opponentScore;

  if (youWon) {
    resultTitle.textContent = "VICTORY! 🏆";
    resultSubtitle.textContent = "You won the battle!";
    resultEmoji.textContent = "🏆";
    timeReward.textContent = "+10 minutes";
    
    // Grant time reward
    chrome.runtime.sendMessage({ 
      type: 'challengeComplete',
      rewardTime: 600 // 10 minutes
    }, (response) => {
      setTimeout(() => {
        const blockedSiteUrl = response && response.blockedSiteUrl;
        if (blockedSiteUrl) {
          window.location.href = blockedSiteUrl;
        } else {
          window.history.back();
        }
      }, 2000);
    });
  } else {
    resultTitle.textContent = "DEFEAT 😔";
    resultSubtitle.textContent = "Better luck next time!";
    resultEmoji.textContent = "😔";
    timeReward.textContent = "+2 minutes (consolation)";
    
    // Small consolation reward
    chrome.runtime.sendMessage({ 
      type: 'challengeComplete',
      rewardTime: 120 // 2 minutes
    }, (response) => {
      setTimeout(() => {
        const blockedSiteUrl = response && response.blockedSiteUrl;
        if (blockedSiteUrl) {
          window.location.href = blockedSiteUrl;
        } else {
          window.history.back();
        }
      }, 2000);
    });
  }
}

// Event listeners
submitBtn.addEventListener('click', checkAnswer);
answerEl.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') checkAnswer();
});

cancelMatchmakingBtn.addEventListener('click', () => {
  if (db) {
    const queueRef = db.ref('matchmaking');
    queueRef.orderByChild('userId').equalTo(userId).once('value', (snapshot) => {
      snapshot.forEach((child) => {
        child.ref.remove();
      });
    });
  }
  window.history.back();
});

continueBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'challengeComplete' }, (response) => {
    const blockedSiteUrl = response && response.blockedSiteUrl;
    if (blockedSiteUrl) {
      window.location.href = blockedSiteUrl;
    } else {
      window.history.back();
    }
  });
});

// Start matchmaking on load (wait for DOM and Firebase init)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => startMatchmaking(), 500);
  });
} else {
  // DOM already loaded
  setTimeout(() => startMatchmaking(), 500);
}
