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
// GAME STATE
// ====================================
const board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

// score tracking
let playerXScore = 0;
let playerOScore = 0;

const WINNING_SCORE = 3;
let gameOver = false;

// ====================================
// RENDER BOARD
// ====================================
function renderBoard() {
    // Clear the board element first
    boardElement.innerHTML = '';


// Create 9 cells
for (let i = 0; i < 9; i++) {
    // create cell div
    const cell = document.createElement('div');
    cell.classList.add('cell');

    // Add the marker (X or O) if this cell is taken
    cell.textContent = board[i];

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
    if (board[index] === '' && gameActive) {
        // Update board array
        board[index] = currentPlayer;

        // Check for winner
        const winner = checkWinner();
        if (winner) {
            // Update Scores
            if (winner === 'X') {
                playerXScore++;
                scoreXElement.textContent = playerXScore;
            } else {
                playerOScore++;
                scoreOElement.textContent = playerOScore;
            }

            // Check if someone won the MATCH
            if (playerXScore === WINNING_SCORE) {
                playerTurnElement.textContent = `🏆 PLAYER X WINS THE MATCH! 🏆`;
                gameActive = false;
                gameOver = true;
            } else if (playerOScore === WINNING_SCORE) {
                playerTurnElement.textContent = `🏆 PLAYER O WINS THE MATCH! 🏆`;
                gameActive = false;
                gameOver = true;
            } else {
                // Just a game win, not match win
                playerTurnElement.textContent = `Player ${winner} wins this round! 🎉`;
                gameActive = false; // Game ends, but match continues
            }
            
            // Update display AFTER all logic
            renderBoard();
        } 
        // Tie Check
        else if (!board.includes('')) {
            // Board is full and no winner = tie
            playerTurnElement.textContent = `It's a tie! 🤝`;
            gameActive = false;
            
            // Update display AFTER all logic
            renderBoard();
        } 
        else {
            // No winner yet, switch players
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            playerTurnElement.textContent = `Player ${currentPlayer}'s turn`;
            
            // Update display AFTER all logic
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

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;

        // Check if all three positions have the same marker and aren't empty
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return null;
}

// ====================================
// RESET GAME
// ====================================
function resetGame() {
    // Clear board array
    for (let i = 0; i < 9; i++) {
        board[i] = '';
    }

    // Reset game state
    currentPlayer = 'X';
    gameActive = true;

    // Update display
    renderBoard();
   
    // Check if match is over
    if (gameOver) {
        // Match is over - reset everything
        playerXScore = 0;
        playerOScore = 0;
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