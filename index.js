// Game state
let currentWord = '';
let attemptsLeft = 2;
let score = 0;
let gameStarted = false;

// Word bank for the game
const words = ['MONEY', 'VAULT', 'GOLD', 'CASH', 'BANK', 'SAFE', 'CODE', 'LOCK'];

// DOM elements
const lockerImg = document.getElementById('locker-img');
const speaker = document.getElementById('speaker');
const wordInputArea = document.getElementById('word-input-area');
const wordDisplay = document.getElementById('word-display');
const wordInput = document.getElementById('word-input');
const submitBtn = document.getElementById('submit-word');
const playWordBtn = document.getElementById('play-word');
const attemptsDisplay = document.getElementById('attempts');
const messageDisplay = document.getElementById('message');
const scoreDisplay = document.getElementById('score');
const newGameBtn = document.getElementById('new-game');

// Initialize game
function initGame() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    attemptsLeft = 2;
    gameStarted = false;
    
    // Reset UI
    lockerImg.src = 'locker2.webp';
    speaker.classList.add('hidden');
    wordInputArea.classList.add('hidden');
    newGameBtn.classList.add('hidden');
    wordInput.value = '';
    messageDisplay.textContent = '';
    attemptsDisplay.textContent = 'Attempts remaining: 2';
    
    console.log('Secret word:', currentWord); // For testing - remove in production
}

// Create dashed display for word
function createWordDisplay() {
    wordDisplay.innerHTML = currentWord.split('').map(() => '_').join(' ');
}

// Play word sound (simulated)
function playWord() {
    messageDisplay.textContent = `Listen carefully... the word is "${currentWord}"`;
    messageDisplay.style.color = '#FFD700';
    
    // In a real implementation, you would use Web Speech API or audio files
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(currentWord);
        utterance.rate = 0.7;
        utterance.pitch = 0.8;
        speechSynthesis.speak(utterance);
    }
    
    setTimeout(() => {
        if (messageDisplay.textContent.includes('Listen carefully')) {
            messageDisplay.textContent = '';
        }
    }, 3000);
}

// Handle locker click
lockerImg.addEventListener('click', () => {
    if (!gameStarted) {
        gameStarted = true;
        speaker.classList.remove('hidden');
        wordInputArea.classList.remove('hidden');
        createWordDisplay();
        messageDisplay.textContent = 'Click the speaker to hear the password, then type it below!';
        messageDisplay.style.color = '#FFFFFF';
    }
});

// Handle play word button
playWordBtn.addEventListener('click', playWord);

// Handle word submission
function submitWord() {
    const userInput = wordInput.value.toUpperCase().trim();
    
    if (!userInput) {
        messageDisplay.textContent = 'Please enter a word!';
        messageDisplay.style.color = '#FF6B6B';
        return;
    }
    
    if (userInput === currentWord) {
        // Success!
        score += 10;
        scoreDisplay.textContent = score;
        lockerImg.src = 'image.png';
        messageDisplay.textContent = '🎉 SUCCESS! You cracked the safe! 🎉';
        messageDisplay.style.color = '#00FF00';
        endGame();
    } else {
        // Wrong answer
        attemptsLeft--;
        attemptsDisplay.textContent = `Attempts remaining: ${attemptsLeft}`;
        
        if (attemptsLeft > 0) {
            messageDisplay.textContent = `Wrong! Try again. The word was "${currentWord}"`;
            messageDisplay.style.color = '#FF6B6B';
            wordInput.value = '';
        } else {
            // Game over
            lockerImg.src = 'stone.png';
            messageDisplay.textContent = `💥 BUSTED! The correct word was "${currentWord}". You got stones instead!`;
            messageDisplay.style.color = '#FF0000';
            endGame();
        }
    }
}

// End game
function endGame() {
    wordInput.disabled = true;
    submitBtn.disabled = true;
    playWordBtn.disabled = true;
    newGameBtn.classList.remove('hidden');
}

// Event listeners
submitBtn.addEventListener('click', submitWord);

wordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitWord();
    }
});

newGameBtn.addEventListener('click', () => {
    initGame();
    wordInput.disabled = false;
    submitBtn.disabled = false;
    playWordBtn.disabled = false;
});

// Initialize the game
initGame();