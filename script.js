// ====================================
// DOM ELEMENTS
// ====================================
const boardElement = document.querySelector('.board');
const playerTurnElement = document.querySelector('.player-turn');
const resetButton = document.querySelector('.reset');

// ====================================
// GAME STATE
// ====================================
const board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

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

        // Update display
        renderBoard();

        // Check for winner
        const winner = checkWinner();
        if (winner) {
            // Game over - someone won!
            playerTurnElement.textContent = `Player ${winner} wins! 🎉`;
            gameActive = false;
            // Tie Check
        } else if (!board.includes('')) {
            // Board is full an no winner = tie
            playerTurnElement.textContent = `It's a tie! 🤝`;
            gameActive = false;
        } else {
            // No winner yet, switch players
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            playerTurnElement.textContent = `Player ${currentPlayer}'s turn`;
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
    playerTurnElement.textContent = `Player X's turn`;
}

// ====================================
// EVENT LISTENERS
// ====================================
resetButton.addEventListener('click', resetGame);

// ====================================
// INITIALIZE GAME
// ====================================
renderBoard();