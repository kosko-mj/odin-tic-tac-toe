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
// DISPLAY CONTROLLER MODULE
// ====================================
const DisplayController = (function() {
    // DOM elements (moved from global scope)
    const boardElement = document.querySelector('.board');
    const playerTurnElement = document.querySelector('.player-turn');
    const resetButton = document.querySelector('.reset');
    const scoreXElement = document.getElementById('score-x');
    const scoreOElement = document.getElementById('score-o');

    // Private render function
    function renderBoard() {
        boardElement.innerHTML = '';
        const currentBoard = Gameboard.getBoard();

        // Create 9 cells
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.textContent = currentBoard[i];

            cell.addEventListener('click', () => {
                Game.cellClicked(i);
            });

            boardElement.appendChild(cell);
        }
    }

    // Public interface
    return {
        updateBoard: function() {
            renderBoard();
        },

        updatePlayerTurn: function(message) {
            playerTurnElement.textContent = message;
        },

        updateScores: function(xScore, oScore) {
            scoreXElement.textContent = xScore;
            scoreOElement.textContent = oScore;
        },

        setResetCallback: function(callback) {
            resetButton.addEventListener('click', callback);
        },
    };
})();

// ====================================
// GAME CONTROLLER MODULE
// ====================================
const Game = (function() {
    // Private game state
    let currentPlayer = 'X';
    let gameActive = true;
    let gameOver = false;
    const WINNING_SCORE = 3;

    // Private win detection
    function checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        const currentBoard = Gameboard.getBoard();

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                return currentBoard[a];
            }
        }
        return null;
    }

    // Private move handler
    function handleMove(index) {
        // Check if cell is empty and game is active
        if (Gameboard.getCell(index) === '' && gameActive) {
            
            // Make the move
            Gameboard.makeMove(index, currentPlayer);

            // Check for winner
            const winner = checkWinner();
            if (winner) {
                // Update scores
                if (winner === 'X') {
                    playerX.increaseScore();
                } else {
                    playerO.increaseScore();
                }

                // Check for match win
                if (playerX.getScore() === WINNING_SCORE) {
                    DisplayController.updatePlayerTurn(`🏆 PLAYER X WINS THE MATCH! 🏆`);
                    gameActive = false;
                    gameOver = true;
                } else if (playerO.getScore() === WINNING_SCORE) {
                    DisplayController.updatePlayerTurn(`🏆 PLAYER O WINS THE MATCH! 🏆`);
                    gameActive = false;
                    gameOver = true;
                } else {
                    DisplayController.updatePlayerTurn(`Player ${winner} wins this round! 🎉`);
                    gameActive = false;
                }
                
                // Update scores display
                DisplayController.updateScores(playerX.getScore(), playerO.getScore());
                DisplayController.updateBoard();
            } 
            // Tie check
            else if (Gameboard.isFull()) {
                DisplayController.updatePlayerTurn(`It's a tie! 🤝`);
                gameActive = false;
                DisplayController.updateBoard();
            } 
            else {
                // No winner, switch players
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                DisplayController.updatePlayerTurn(`Player ${currentPlayer}'s turn`);
                DisplayController.updateBoard();
            }
        }
    }

    // Private reset
    function resetGame() {
        Gameboard.reset();
        currentPlayer = 'X';
        gameActive = true;

        if (gameOver) {
            // Match is over - reset scores
            playerX.resetScore();
            playerO.resetScore();
            DisplayController.updateScores(0, 0);
            gameOver = false;
            DisplayController.updatePlayerTurn(`New match! Player X's turn`);
        } else {
            DisplayController.updatePlayerTurn(`Player X's turn (Best of ${WINNING_SCORE})`);
        }
        
        DisplayController.updateBoard();
    }

    // Public interface
    return {
        // Called when a cell is clicked
        cellClicked: function(index) {
            handleMove(index);
        },

        // Called when reset button is clicked
        resetGame: function() {
            resetGame();
        },

        // Initialize the game
        init: function() {
            DisplayController.updateBoard();
            DisplayController.updatePlayerTurn(`Player X's turn (Best of ${WINNING_SCORE})`);
            DisplayController.updateScores(0, 0);
            
            // Set up reset button callback
            DisplayController.setResetCallback(function() {
                resetGame();
            });
        }
    };
})();

// ====================================
// START THE GAME
// ====================================
Game.init();