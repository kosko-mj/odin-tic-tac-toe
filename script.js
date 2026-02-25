// ====================================
// DOM ELEMENTS
// ====================================
const boardElement = document.querySelector('.board');
const playerTurnElement = document.querySelector('.player-turn');
const resetButton = document.querySelector('.reset');

// Score Elements
const scoreXElement = document.getElementById('score-x');
const scoreOElement = document.getElementById('score-o');

// ====================================
// PLAYER FACTORY
// ====================================
function createPlayer(name, marker) {
    return {
        name: name,
        marker: marker,
        score: 0,

        // Methods (functions attached to this player)
        increaseScore: function() {
            this.score++;
        },

        resetScore: function() {
            this.score = 0;
        },

        getScore: function() {
            return this.score;
        }
    };
}

// Create Players
const playerX = createPlayer('Player X', 'X');
const playerO = createPlayer('Player O', 'O');

// ====================================
// GAMEBOARD MODULE
// ====================================
const Gameboard = (function() {
    // Private board - can't touch this from outside!
    const board = ['', '', '', '', '', '', '', '', ''];
    
    // Public interface
    return {
        // Get a copy of the board (so outside can't modify original)
        getBoard: function() {
            return [...board]; // Spread operator creates a new array
        },
        
        // Make a move - returns true if successful, false if not
        makeMove: function(index, marker) {
            if (board[index] === '') {
                board[index] = marker;
                return true;
            }
            return false;
        },
        
        // Reset the board
        reset: function() {
            for (let i = 0; i < 9; i++) {
                board[i] = '';
            }
        },
        
        // Check if board is full
        isFull: function() {
            return !board.includes('');
        },
        
        // Get value at specific position
        getCell: function(index) {
            return board[index];
        }
    };
})();


// ====================================
// GAME STATE
// ====================================
let currentPlayer = 'X';
let gameActive = true;

const WINNING_SCORE = 3;
let gameOver = false;

// ====================================
// RENDER BOARD
// ====================================
function renderBoard() {
    // Clear the board element first
    boardElement.innerHTML = '';

    // Get current board state from the module
    const currentBoard = Gameboard.getBoard();


// Create 9 cells
for (let i = 0; i < 9; i++) {
    // create cell div
    const cell = document.createElement('div');
    cell.classList.add('cell');

    // Add the marker (X or O) if this cell is taken
    cell.textContent = currentBoard[i];

    // Add click handler
    cell.addEventListener('click', () => handleCellClick(i));

    // Add to board
    boardElement.appendChild(cell);
   }
}

// ====================================
// GAME LOGIC
// ====================================
function handleCellClick(index) {
    // check if cell is empty and game is active
    // Use Gameboard.getCell() to check if empty
    if (Gameboard.getCell(index) === '' && gameActive) {
        
        // Make the move using the module
        Gameboard.makeMove(index, currentPlayer);

        // Check for winner
        const winner = checkWinner();  // We'll update this next
        if (winner) {
            // Update Scores
            if (winner === 'X') {
                playerX.increaseScore();
                scoreXElement.textContent = playerX.getScore();
            } else {
                playerO.increaseScore();
                scoreOElement.textContent = playerO.getScore();
            }

            // Check if someone won the MATCH
            if (playerX.getScore() === WINNING_SCORE) {
                playerTurnElement.textContent = `🏆 PLAYER X WINS THE MATCH! 🏆`;
                gameActive = false;
                gameOver = true;
            } else if (playerO.getScore() === WINNING_SCORE) {
                playerTurnElement.textContent = `🏆 PLAYER O WINS THE MATCH! 🏆`;
                gameActive = false;
                gameOver = true;
            } else {
                // Just a game win, not match win
                playerTurnElement.textContent = `Player ${winner} wins this round! 🎉`;
                gameActive = false;
            }
            
            // Update display
            renderBoard();
        } 
        // Tie Check
        else if (Gameboard.isFull()) {  // Use the module's isFull method
            playerTurnElement.textContent = `It's a tie! 🤝`;
            gameActive = false;
            renderBoard();
        } 
        else {
            // No winner yet, switch players
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            playerTurnElement.textContent = `Player ${currentPlayer}'s turn`;
            renderBoard();
        }
    }
}

// ====================================
// WIN DETECTION
// ====================================
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Get current board from module
    const currentBoard = Gameboard.getBoard();

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;

        // Check if all three positions have the same marker and aren't empty
        if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
            return currentBoard[a];
        }
    }

    return null;
}

// ====================================
// RESET GAME
// ====================================
function resetGame() {
    // Use the module to reset the board
    Gameboard.reset();

    // Reset game state
    currentPlayer = 'X';
    gameActive = true;

    // Update display
    renderBoard();
    
    // Check if match is over
    if (gameOver) {
        // Match is over - reset everything
        playerX.resetScore();
        playerO.resetScore();
        scoreXElement.textContent = '0';
        scoreOElement.textContent = '0';
        gameOver = false;
        playerTurnElement.textContent = `New match! Player X's turn`;
    } else {
        // Just starting a new round in the same match
        playerTurnElement.textContent = `Player X's turn (Best of ${WINNING_SCORE})`;
    }
}

// ====================================
// EVENT LISTENERS
// ====================================
resetButton.addEventListener('click', resetGame);

// ====================================
// INITIALIZE GAME
// ====================================
renderBoard();