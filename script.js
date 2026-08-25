// =========================
// DOM ELEMENTS
// =========================

const gameModeBtns =
    document.querySelectorAll(".game-mode-btn");

const difficultyBtns =
    document.querySelectorAll(".difficulty-btn");

const startGameBtns =
    document.querySelectorAll(".start-game-btn");

const boardCells =
    document.querySelectorAll(".board-cell");

const nextRoundBtn =
    document.querySelector(".next-round-btn");

const playAgainBtn =
    document.querySelector(".play-again-btn");

const mainMenuBtn =
    document.querySelector(".main-menu-btn");

const symbolBtns =
    document.querySelectorAll(".symbol-btn");


// =========================
// INPUTS
// =========================

const playerOneNameInput =
    document.getElementById("player-one-name");

const playerTwoNameInput =
    document.getElementById("player-two-name");

const botPlayerNameInput =
    document.getElementById("bot-player-name");


// =========================
// PLAYER DISPLAY
// =========================

const playerOneNameDisplay =
    document.getElementById("player-one-name-display");

const playerTwoNameDisplay =
    document.getElementById("player-two-name-display");

const playerOneSymbol =
    document.getElementById("player-one-symbol");

const playerTwoSymbol =
    document.getElementById("player-two-symbol");

const playerOneScore =
    document.getElementById("player-one-score");

const playerTwoScore =
    document.getElementById("player-two-score");


// =========================
// GAME DISPLAY
// =========================

const roundNumber =
    document.getElementById("round-number");

const countdownNumber =
    document.getElementById("countdown-number");

const roundResult =
    document.getElementById("round-result");

const roundResultMessage =
    document.getElementById("round-result-message");


// =========================
// MESSAGE MODAL
// =========================

const messageModal =
    document.getElementById("message-modal");

const messageText =
    document.getElementById("message-text");

const messageBtn =
    document.getElementById("message-btn");


// =========================
// SCREENS
// =========================

const welcomeScreen =
    document.querySelector(".welcome-screen");

const modeScreen =
    document.querySelector(".mode-screen");

const friendSetup =
    document.querySelector(".friend-setup");

const botSetup =
    document.querySelector(".bot-setup");

const difficultyScreen =
    document.querySelector(".difficulty-screen");

const countdownScreen =
    document.querySelector(".countdown-screen");

const gameScreen =
    document.querySelector(".game-screen");

const resultScreen =
    document.querySelector(".result-screen");


// =========================
// GAMEBOARD
// =========================

let board = [
    "", "", "",
    "", "", "",
    "", "", ""
];


// =========================
// GAME STATE
// =========================

let gameMode = null;

let difficulty = null;

let selectedSymbol = null;

let playerOneName = null;

let playerTwoName = null;

let round = 1;

let currentPlayer = null;

let playerOne = null;

let playerTwo = null;

let winner = null;

let playerOneScoreValue = 0;

let playerTwoScoreValue = 0;

let gameEnded = false;


// =========================
// GAME MODE
// =========================

gameModeBtns.forEach(button => {

    button.addEventListener("click", function () {

        const mode = button.dataset.mode;

        gameMode = mode;

        modeScreen.style.display = "none";

        if (mode === "friend") {

            friendSetup.style.display = "block";
            botSetup.style.display = "none";

        } else {

            botSetup.style.display = "block";
            friendSetup.style.display = "none";
        }
    });
});


// =========================
// DIFFICULTY
// =========================

difficultyBtns.forEach(button => {

    button.addEventListener("click", function () {

        difficulty = button.dataset.difficulty;

        console.log("Difficulty:", difficulty);

        difficultyScreen.style.display = "none";

        botSetup.style.display = "block";
    });
});


// =========================
// SYMBOL SELECTION
// =========================

symbolBtns.forEach(button => {

    button.addEventListener("click", function () {

        selectedSymbol = button.dataset.symbol;

        console.log("Selected symbol:", selectedSymbol);
    });
});


// =========================
// START GAME
// =========================

startGameBtns.forEach(button => {

    button.addEventListener("click", function () {

        // -------------------------
        // PLAYER ONE
        // -------------------------

        playerOneName =
            playerOneNameInput.value.trim();

        // -------------------------
        // PLAYER TWO
        // -------------------------

        if (gameMode === "friend") {

            playerTwoName =
                playerTwoNameInput.value.trim();

        } else {

            playerTwoName = "Bot";
        }



        const secondSymbol =selectedSymbol === "X"? "O": "X";

        playerOne =
            createPlayer(
                playerOneName,
                selectedSymbol
            );

        playerTwo =
            createPlayer(
                playerTwoName,
                secondSymbol
            );


        board = [
            "", "", "",
            "", "", "",
            "", "", ""
        ];

        currentPlayer = playerOne;

        winner = null;

        gameEnded = false;


        boardCells.forEach(cell => {

            cell.textContent = "";
        });


        playerOneNameDisplay.textContent = playerOne.name;

        playerTwoNameDisplay.textContent = playerTwo.name;

        playerOneSymbol.textContent = playerOne.symbol;

        playerTwoSymbol.textContent = playerTwo.symbol;

        roundNumber.textContent =`Round ${round}`;


        countdownScreen.style.display = "block";

        gameScreen.style.display = "none";


        let count = 3;

        countdownNumber.textContent = count;

        const timer = setInterval(() => {

            if (count > 1) {

                count--;

                countdownNumber.textContent =
                    count;

            } else {

                countdownNumber.textContent =
                    "GO!";

                clearInterval(timer);


                setTimeout(() => {

                    countdownScreen.style.display =
                        "none";

                    gameScreen.style.display =
                        "block";

                }, 500);
            }

        }, 1000);
    });
});


// =========================
// BOARD CLICK
// =========================

boardCells.forEach(cell => {

    cell.addEventListener("click", function () {

       
        if (gameEnded) {
            return;
        }

        if (
            gameMode === "bot" &&
            currentPlayer === playerTwo
        ) {
            return;
        }


        const index = Number(cell.dataset.index);


        Game(index);
    });
});


// =========================
// GAME
// =========================

function Game(index) {

    
    if (board[index] !== "") {
        return;
    }


   
    board[index] = currentPlayer.symbol;

    boardCells[index].textContent = currentPlayer.symbol;



    const winnerSymbol = checkWinner();


    if (winnerSymbol !== null) {

        endRound(winnerSymbol);

        return;
    }



    const isBoardFull = board.every(cell => cell !== "");


    if (isBoardFull) {

        endRound("draw");

        return;
    }



    currentPlayer =
        currentPlayer === playerOne
            ? playerTwo
            : playerOne;



    if (
        gameMode === "bot" &&
        currentPlayer === playerTwo
    ) {

        setTimeout(() => {

            makeBotMove();

        }, 500);
    }
}


// =========================
// CHECK WINNER
// =========================

function checkWinner() {

    const winningCombinations = [

        [0, 1, 2],

        [3, 4, 5],

        [6, 7, 8],

        [0, 3, 6],

        [1, 4, 7],

        [2, 5, 8],

        [0, 4, 8],

        [2, 4, 6]
    ];


    for (const combination
        of winningCombinations) {

        const [a, b, c] = combination;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {

            return board[a];
        }
    }


    return null;
}


// =========================
// BOT MOVE
// =========================

function makeBotMove() {

    if (gameEnded) {
        return;
    }

    let move;


    if (difficulty === "hard") {

        move = getHardBotMove();

    } else {

        move = getEasyBotMove();
    }


    if (move === null) {
        return;
    }


    Game(move);
}


// =========================
// EASY BOT
// =========================

function getEasyBotMove() {

    const emptyCells = getEmptyCells();


    if (emptyCells.length === 0) {

        return null;
    }


    const randomIndex = Math.floor( Math.random() * emptyCells.length);

    return emptyCells[randomIndex];
}


// =========================
// HARD BOT
// =========================

function getHardBotMove() {


    const winningMove = findWinningMove(playerTwo.symbol);

    if (winningMove !== null) {

        return winningMove;
    }



    const blockingMove = findWinningMove( playerOne.symbol);

    if (blockingMove !== null) {

        return blockingMove;
    }


    return getEasyBotMove();
}


// =========================
// FIND WINNING MOVE
// =========================

function findWinningMove(symbol) {

    const emptyCells = getEmptyCells();


    for (const index of emptyCells) {

        board[index] = symbol;

        const winnerSymbol = checkWinner();

        board[index] = "";

        if (winnerSymbol === symbol) {

            return index;
        }
    }


    return null;
}


// =========================
// GET EMPTY CELLS
// =========================

function getEmptyCells() {

    const emptyCells = [];


    board.forEach((cell, index) => {

        if (cell === "") {

            emptyCells.push(index);
        }
    });


    return emptyCells;
}


// =========================
// END ROUND
// =========================

function endRound(result) {

    gameEnded = true;


    if (result === "draw") {

        winner = null;

        showRoundResult("It's a Draw!");

        return;
    }


    if (result === playerOne.symbol) {

        winner = playerOne;

        playerOneScoreValue++;

        playerOneScore.textContent = playerOneScoreValue;

        showRoundResult(`${playerOne.name} Wins!`);

        return;
    }


    if (result === playerTwo.symbol) {

        winner = playerTwo;

        playerTwoScoreValue++;

        playerTwoScore.textContent = playerTwoScoreValue;

        showRoundResult(`${playerTwo.name} Wins!`);
    }
}


// =========================
// SHOW ROUND RESULT
// =========================

function showRoundResult(message) {

    roundResultMessage.textContent = message;

    roundResult.style.display ="block";
}


// =========================
// NEXT ROUND
// =========================

nextRoundBtn.addEventListener("click", function () {

        round++;

        board = [
            "", "", "",
            "", "", "",
            "", "", ""
        ];

        gameEnded = false;

        winner = null;

        currentPlayer = playerOne;


        boardCells.forEach(cell => {

            cell.textContent = "";
        });


        roundNumber.textContent =
            `Round ${round}`;


        roundResult.style.display =
            "none";
    }
);


// =========================
// PLAY AGAIN
// =========================

playAgainBtn.addEventListener("click", function () {

        round = 1;

        playerOneScoreValue = 0;

        playerTwoScoreValue = 0;

        playerOneScore.textContent = "0";

        playerTwoScore.textContent = "0";


        resultScreen.style.display =
            "none";

        gameScreen.style.display =
            "block";


        board = [
            "", "", "",
            "", "", "",
            "", "", ""
        ];

        currentPlayer = playerOne;

        gameEnded = false;


        boardCells.forEach(cell => {

            cell.textContent = "";
        });
    }
);


// =========================
// MAIN MENU
// =========================

mainMenuBtn.addEventListener("click", function () {

        gameScreen.style.display =
            "none";

        resultScreen.style.display =
            "none";

        friendSetup.style.display =
            "none";

        botSetup.style.display =
            "none";

        modeScreen.style.display =
            "block";
    }
);


// =========================
// CREATE PLAYER
// =========================

function createPlayer(name, symbol) {

    return {
        name,
        symbol
    };
}


// =========================
// MESSAGE
// =========================

function showMessage(message) {

    messageText.textContent = message;

    messageModal.style.display = "block";
}


// =========================
// CLOSE MESSAGE
// =========================

messageBtn.addEventListener("click", function () {

        messageModal.style.display = "none";
    }
);