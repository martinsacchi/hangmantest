document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const wordEl = document.getElementById('word');
    const messageEl = document.getElementById('message');
    const keyboardEl = document.getElementById('keyboard');
    const newGameBtn = document.getElementById('new-game-btn');
    const difficultySelect = document.getElementById('difficulty');
    const figureParts = document.querySelectorAll('.figure-part');
    
    // Game variables
    let selectedWord = '';
    let correctLetters = [];
    let wrongLetters = [];
    let maxWrongAttempts = 6;
    let gameOver = false;
    
    // Word lists by difficulty
    const wordLists = {
        easy: [
            'cat', 'dog', 'sun', 'hat', 'run', 'map', 'cup', 'pen', 'car', 'box',
            'fish', 'bird', 'book', 'ball', 'tree', 'door', 'star', 'moon', 'cake', 'milk'
        ],
        medium: [
            'apple', 'beach', 'chair', 'dance', 'earth', 'flame', 'ghost', 'hotel',
            'juice', 'knife', 'lemon', 'music', 'ocean', 'piano', 'queen', 'river',
            'snake', 'tiger', 'uncle', 'video', 'water', 'zebra', 'cloud', 'bread'
        ],
        hard: [
            'algorithm', 'boulevard', 'chemistry', 'dinosaur', 'education',
            'frequency', 'gymnasium', 'hurricane', 'invisible', 'journalist',
            'knowledge', 'landscape', 'mechanism', 'nutrition', 'orchestra',
            'psychology', 'quadruple', 'revolution', 'submarine', 'telescope',
            'university', 'vocabulary', 'watermelon', 'xylophone', 'yesterday'
        ]
    };
    
    // Initialize keyboard
    function initKeyboard() {
        keyboardEl.innerHTML = '';
        const keys = 'abcdefghijklmnopqrstuvwxyz'.split('');
        
        keys.forEach(key => {
            const button = document.createElement('button');
            button.classList.add('key');
            button.textContent = key;
            button.id = `key-${key}`;
            button.addEventListener('click', () => handleLetterClick(key));
            keyboardEl.appendChild(button);
        });
    }
    
    // Get random word based on difficulty
    function getRandomWord() {
        const difficulty = difficultySelect.value;
        const words = wordLists[difficulty];
        return words[Math.floor(Math.random() * words.length)];
    }
    
    // Display word with correct letters and placeholders
    function displayWord() {
        wordEl.innerHTML = '';
        selectedWord.split('').forEach(letter => {
            const letterEl = document.createElement('div');
            letterEl.classList.add('letter');
            letterEl.textContent = correctLetters.includes(letter) ? letter : '';
            wordEl.appendChild(letterEl);
        });
        
        // Check if player won
        const wordDisplay = selectedWord.split('').map(letter => 
            correctLetters.includes(letter) ? letter : '_').join('');
            
        if (wordDisplay === selectedWord) {
            messageEl.innerHTML = '<span class="success">Congratulations! You won! 🎉</span>';
            gameOver = true;
            updateKeyboardState();
        }
    }
    
    // Update hangman figure
    function updateFigure() {
        // Show figure parts based on wrong attempts
        figureParts.forEach((part, index) => {
            if (index < wrongLetters.length) {
                part.classList.remove('hidden');
            } else {
                part.classList.add('hidden');
            }
        });
        
        // Check if player lost
        if (wrongLetters.length === maxWrongAttempts) {
            messageEl.innerHTML = `<span class="error">Game over! The word was: ${selectedWord}</span>`;
            gameOver = true;
            updateKeyboardState();
        }
    }
    
    // Update keyboard state
    function updateKeyboardState() {
        const keys = document.querySelectorAll('.key');
        keys.forEach(key => {
            const letter = key.textContent.toLowerCase();
            
            // Reset all classes first
            key.classList.remove('used', 'correct', 'wrong');
            
            if (correctLetters.includes(letter)) {
                key.classList.add('used', 'correct');
            } else if (wrongLetters.includes(letter)) {
                key.classList.add('used', 'wrong');
            }
            
            // Disable all keys if game is over
            if (gameOver) {
                key.disabled = true;
                key.classList.add('used');
            } else {
                key.disabled = correctLetters.includes(letter) || wrongLetters.includes(letter);
            }
        });
    }
    
    // Handle letter click
    function handleLetterClick(letter) {
        if (gameOver) return;
        
        if (!correctLetters.includes(letter) && !wrongLetters.includes(letter)) {
            if (selectedWord.includes(letter)) {
                correctLetters.push(letter);
            } else {
                wrongLetters.push(letter);
                updateFigure();
            }
            
            displayWord();
            updateKeyboardState();
        }
    }
    
    // Handle keyboard input
    function handleKeyDown(e) {
        if (gameOver) return;
        
        const letter = e.key.toLowerCase();
        if (/^[a-z]$/.test(letter)) {
            handleLetterClick(letter);
        }
    }
    
    // Initialize new game
    function initGame() {
        // Reset game state
        selectedWord = getRandomWord();
        correctLetters = [];
        wrongLetters = [];
        gameOver = false;
        messageEl.textContent = '';
        
        // Reset hangman figure
        figureParts.forEach(part => {
            if (!part.classList.contains('stand-top') && 
                !part.classList.contains('stand-rope') && 
                !part.classList.contains('stand-main') && 
                !part.classList.contains('stand-bottom')) {
                part.classList.add('hidden');
            }
        });
        
        // Initialize keyboard and display word
        initKeyboard();
        displayWord();
        
        // Add keyboard event listener
        document.addEventListener('keydown', handleKeyDown);
    }
    
    // Event listeners
    newGameBtn.addEventListener('click', initGame);
    difficultySelect.addEventListener('change', () => {
        if (!gameOver) {
            const confirmChange = confirm('Changing difficulty will start a new game. Continue?');
            if (confirmChange) {
                initGame();
            } else {
                difficultySelect.value = difficultySelect.dataset.currentValue;
            }
        } else {
            initGame();
        }
    });
    
    // Save current difficulty value
    difficultySelect.dataset.currentValue = difficultySelect.value;
    
    // Start the game
    initGame();
});
