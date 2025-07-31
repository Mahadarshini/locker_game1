let selectedThief = null;
let currentDialogue = 0;
let currentWord = '';
let attemptsLeft = 2;
let score = 0;
let gameStarted = false;

// Thief data
const thiefData = {
    1: {
        name: "Shadow Jack",
        image: "male.png",
        dialogues: [
            "Welcome to the heist, partner! I'm Shadow Jack, and we're about to pull off the biggest bank job of the century!",
            "Here's how this works: See that safe over there? Click on it to start our operation. But be quiet about it!",
            "Once you click the safe, you'll hear a speaker icon appear. That's our inside source giving us the secret password!",
            "Listen carefully and type the password exactly as you hear it. We only get 2 chances before the alarm goes off!",
            "Get it right, and we'll be swimming in gold coins! Get it wrong twice... well, let's just say we'll be cracking rocks instead of safes. Ready to make some money?"
        ],
        encouragements: [
            "Click the safe to start the heist!",
            "Listen carefully, partner!",
            "You've got this! Crack that code!",
            "Two attempts left - make them count!",
            "One more chance - don't blow it!",
            "JACKPOT! We're rich!",
            "Ah man, we got caught! Better luck next heist!"
        ]
    },
    2: {
        name: "Clever Kate",
        image: "female.png",
        dialogues: [
            "Hey there, rookie! Clever Kate's the name, and safe-cracking is my game. Ready for your first big score?",
            "First lesson: Click that beautiful safe to begin. Every good heist starts with the right target!",
            "When you click it, a speaker will pop up. That's our audio clue - the secret word we need to crack this baby open!",
            "Type the word you hear, but be smart about it. We get exactly 2 shots at this before security shows up!",
            "Nail it, and we walk away with a fortune in coins! Miss both times, and we're stuck with worthless rocks. Think you can handle the pressure?"
        ],
        encouragements: [
            "Click the safe to start the heist!",
            "Use those ears, rookie!",
            "Come on, crack it like a pro!",
            "Two shots left - stay focused!",
            "Last chance - make it count!",
            "Perfect! We struck gold!",
            "Busted! Time to plan our next heist!"
        ]
    }
};

// Word bank for the game
const words = ['MONEY', 'VAULT', 'GOLD', 'CASH', 'BANK', 'SAFE', 'CODE', 'LOCK'];

// DOM elements
const thiefSelectionPage = document.getElementById('thief-selection');
const tutorialPage = document.getElementById('tutorial');
const gamePage = document.getElementById('game-page');

// Tutorial elements
const tutorialThiefImg = document.getElementById('tutorial-thief-img');
const dialogueText = document.getElementById('dialogue-text');
const nextBtn = document.getElementById('next-btn');
const skipBtn = document.getElementById('skip-btn');

// Game elements
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
const gameThiefImg = document.getElementById('game-thief-img');
const thiefComment = document.getElementById('thief-comment');

// Thief selection
document.querySelectorAll('.select-thief-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        selectedThief = parseInt(e.target.closest('.thief-card').dataset.thief);
        startTutorial();
    });
});

// Start tutorial
function startTutorial() {
    thiefSelectionPage.classList.add('hidden');
    tutorialPage.classList.remove('hidden');
    
    currentDialogue = 0;
    tutorialThiefImg.src = thiefData[selectedThief].image;
    showDialogue();
}

// Show current dialogue
function showDialogue() {
    const dialogues = thiefData[selectedThief].dialogues;
    dialogueText.textContent = dialogues[currentDialogue];
    
    if (currentDialogue === dialogues.length - 1) {
        nextBtn.textContent = 'START HEIST!';
    }
}

// Next dialogue
nextBtn.addEventListener('click', () => {
    const dialogues = thiefData[selectedThief].dialogues;
    
    if (currentDialogue < dialogues.length - 1) {
        currentDialogue++;
        showDialogue();
    } else {
        startGame();
    }
});

// Skip tutorial
skipBtn.addEventListener('click', startGame);

// Start game
function startGame() {
    tutorialPage.classList.add('hidden');
    gamePage.classList.remove('hidden');
    
    // Set up thief in sidebar
    gameThiefImg.src = thiefData[selectedThief].image;
    thiefComment.textContent = thiefData[selectedThief].encouragements[0];
    
    initGame();
}

// Initialize game
function initGame() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    attemptsLeft = 2;
    gameStarted = false;
    
    // Reset UI
    lockerImg.src = 't2.png';
    speaker.classList.add('hidden');
    wordInputArea.classList.add('hidden');
    newGameBtn.classList.add('hidden');
    wordInput.value = '';
    messageDisplay.textContent = '';
    attemptsDisplay.textContent = 'Attempts remaining: 2';
    thiefComment.textContent = thiefData[selectedThief].encouragements[0];
    
    console.log('Secret word:', currentWord); // For testing
}

// Update thief encouragement
function updateThiefComment(index) {
    thiefComment.textContent = thiefData[selectedThief].encouragements[index];
}

// Create dashed display for word
function createWordDisplay() {
    wordDisplay.innerHTML = currentWord.split('').map(() => '_').join(' ');
}

// Play word sound
function playWord() {
    messageDisplay.textContent = `Listen carefully... the word is "${currentWord}"`;
    messageDisplay.style.color = '#FFD700';
    updateThiefComment(1); // "Listen carefully" comment
    
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(currentWord);
        utterance.rate = 0.7;
        utterance.pitch = 0.8;
        speechSynthesis.speak(utterance);
    }
    
    setTimeout(() => {
        if (messageDisplay.textContent.includes('Listen carefully')) {
            messageDisplay.textContent = '';
            updateThiefComment(2); // "You've got this" comment
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
        messageDisplay.textContent = 'Click the speaker to hear the password!';
        messageDisplay.style.color = '#FFFFFF';
        updateThiefComment(1); // Encourage to listen
    }
});

// Handle play word button
playWordBtn.addEventListener('click', playWord);

// Handle word submission
function submitWord() {
    const userInput = wordInput.value.toUpperCase().trim();
    
    if (!userInput) {
        messageDisplay.textContent = 'Type the password first!';
        messageDisplay.style.color = '#FF6B6B';
        return;
    }
    
    if (userInput === currentWord) {
        // Success!
        score += 10;
        scoreDisplay.textContent = score;
        lockerImg.src = 't1.png';
        messageDisplay.textContent = '🎉 HEIST SUCCESSFUL! The safe is cracked! 🎉';
        messageDisplay.style.color = '#00FF00';
        updateThiefComment(5); // Success comment
        endGame();
    } else {
        // Wrong answer
        attemptsLeft--;
        attemptsDisplay.textContent = `Attempts remaining: ${attemptsLeft}`;
        
        if (attemptsLeft > 0) {
            messageDisplay.textContent = `Wrong password! Try again!`;
            messageDisplay.style.color = '#FF6B6B';
            wordInput.value = '';
            updateThiefComment(attemptsLeft === 1 ? 4 : 3); // Attempt-based encouragement
        } else {
            // Game over
            lockerImg.src = 't3.png';
            messageDisplay.textContent = `💥 CAUGHT! The password was "${currentWord}". We got rocks instead of riches!`;
            messageDisplay.style.color = '#FF0000';
            updateThiefComment(6); // Failure comment
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