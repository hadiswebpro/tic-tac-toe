// =========================
// DOM ELEMENTS
// =========================

const gameModeBtns =
    document.querySelectorAll(".game-mode-btn");

const difficultyBtns =
    document.querySelectorAll(".difficulty-btn");

const startGameBtns =
    document.querySelectorAll(".setup-content .start-game-btn");

const openModeBtn =
    document.querySelector(".open-mode-btn");

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
// FINAL RESULT DISPLAY
// =========================

const finalPlayerOneName =
    document.getElementById("final-player-one-name");

const finalPlayerTwoName =
    document.getElementById("final-player-two-name");

const finalPlayerOneScore =
    document.getElementById("final-player-one-score");

const finalPlayerTwoScore =
    document.getElementById("final-player-two-score");

const finalResult =
    document.getElementById("final-result");


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

const WINNING_SCORE = 3;


// =========================
// INITIAL SCREEN STATE
// =========================

welcomeScreen.style.display = "block";
modeScreen.style.display = "none";
friendSetup.style.display = "none";
botSetup.style.display = "none";
difficultyScreen.style.display = "none";
countdownScreen.style.display = "none";
gameScreen.style.display = "none";
resultScreen.style.display = "none";
roundResult.style.display = "none";
messageModal.style.display = "none";


// =========================
// OPEN GAME MODE
// =========================

openModeBtn.addEventListener("click", function () {

    welcomeScreen.style.display = "none";
    modeScreen.style.display = "block";
});


// =========================
// GAME MODE
// =========================

gameModeBtns.forEach(button => {

    button.addEventListener("click", function () {

        gameMode = button.dataset.mode;

        modeScreen.style.display = "none";

        if (gameMode === "friend") {

            friendSetup.style.display = "block";
            botSetup.style.display = "none";
            difficultyScreen.style.display = "none";

        } else {

            friendSetup.style.display = "none";
            botSetup.style.display = "none";
            difficultyScreen.style.display = "block";
        }
    });
});


// =========================
// DIFFICULTY
// =========================

difficultyBtns.forEach(button => {

    button.addEventListener("click", function () {

        difficultyBtns.forEach(btn => {
            btn.classList.remove("selected");
        });

        button.classList.add("selected");

        difficulty = button.dataset.difficulty;

        difficultyScreen.style.display = "none";
        botSetup.style.display = "block";
    });
});


// =========================
// SYMBOL SELECTION
// =========================

symbolBtns.forEach(button => {

    button.addEventListener("click", function () {

        const setup = button.closest(".setup-content");
        const setupSymbols = setup.querySelectorAll(".symbol-btn");

        setupSymbols.forEach(btn => {
            btn.classList.remove("selected");
        });

        button.classList.add("selected");

        selectedSymbol = button.dataset.symbol;
    });
});


// =========================
// START GAME
// =========================

startGameBtns.forEach(button => {

    button.addEventListener("click", function () {

        // -------------------------
        // VALIDATION
        // -------------------------

        if (!gameMode) {
            showMessage("Please choose a game mode first.");
            return;
        }

        if (!selectedSymbol) {
            showMessage("Please choose X or O.");
            return;
        }


        // -------------------------
        // PLAYER ONE
        // -------------------------

        if (gameMode === "bot") {

            playerOneName =
                botPlayerNameInput.value.trim();

        } else {

            playerOneName =
                playerOneNameInput.value.trim();
        }

        if (!playerOneName) {
            showMessage("Please enter your name.");
            return;
        }


        // -------------------------
        // PLAYER TWO
        // -------------------------

        if (gameMode === "friend") {

            playerTwoName =
                playerTwoNameInput.value.trim();

            if (!playerTwoName) {
                showMessage("Please enter Player 2 name.");
                return;
            }

        } else {

            playerTwoName = "Bot";

            if (!difficulty) {
                showMessage("Please choose a difficulty first.");
                return;
            }
        }


        // -------------------------
        // PLAYER SYMBOLS
        // -------------------------

        const secondSymbol =
            selectedSymbol === "X" ? "O" : "X";


        // -------------------------
        // CREATE PLAYERS
        // -------------------------

        playerOne = createPlayer(
            playerOneName,
            selectedSymbol
        );

        playerTwo = createPlayer(
            playerTwoName,
            secondSymbol
        );


        // -------------------------
        // RESET GAME
        // -------------------------

        round = 1;
        playerOneScoreValue = 0;
        playerTwoScoreValue = 0;
        playerOneScore.textContent = "0";
        playerTwoScore.textContent = "0";

        resetBoard();

        currentPlayer = playerOne;
        winner = null;
        gameEnded = false;


        // -------------------------
        // UPDATE UI
        // -------------------------

        playerOneNameDisplay.textContent = playerOne.name;
        playerTwoNameDisplay.textContent = playerTwo.name;

        playerOneSymbol.textContent = playerOne.symbol;
        playerTwoSymbol.textContent = playerTwo.symbol;

        roundNumber.textContent = `Round ${round}`;


        // -------------------------
        // HIDE SETUP
        // -------------------------

        friendSetup.style.display = "none";
        botSetup.style.display = "none";
        difficultyScreen.style.display = "none";


        // -------------------------
        // COUNTDOWN
        // -------------------------

        startCountdown();
    });
});


// =========================
// START COUNTDOWN
// =========================

function startCountdown() {

    countdownScreen.style.display = "block";
    gameScreen.style.display = "none";
    roundResult.style.display = "none";

    let count = 3;

    countdownNumber.textContent = count;

    const timer = setInterval(() => {

        if (count > 1) {

            count--;
            countdownNumber.textContent = count;

        } else {

            countdownNumber.textContent = "GO!";

            clearInterval(timer);

            setTimeout(() => {

                countdownScreen.style.display = "none";
                gameScreen.style.display = "block";
                currentPlayer = playerOne;

            }, 500);
        }

    }, 1000);
}


// =========================
// BOARD CLICK
// =========================

boardCells.forEach(cell => {

    cell.addEventListener("click", function () {

        if (gameEnded || !currentPlayer) {
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

    if (gameEnded || board[index] !== "") {
        return;
    }

    board[index] = currentPlayer.symbol;

    boardCells[index].textContent =
        currentPlayer.symbol;

    boardCells[index].classList.remove("x", "o");
    boardCells[index].classList.add(
        currentPlayer.symbol.toLowerCase()
    );


    // -------------------------
    // CHECK WINNER
    // -------------------------

    const winnerSymbol = checkWinner();

    if (winnerSymbol !== null) {
        endRound(winnerSymbol);
        return;
    }


    // -------------------------
    // CHECK DRAW
    // -------------------------

    const isBoardFull =
        board.every(cell => cell !== "");

    if (isBoardFull) {
        endRound("draw");
        return;
    }


    // -------------------------
    // CHANGE PLAYER
    // -------------------------

    currentPlayer =
        currentPlayer === playerOne
            ? playerTwo
            : playerOne;


    // -------------------------
    // BOT MOVE
    // -------------------------

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

    for (const combination of winningCombinations) {

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

    const randomIndex =
        Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex];
}


// =========================
// HARD BOT
// =========================

function getHardBotMove() {

    const winningMove =
        findWinningMove(playerTwo.symbol);

    if (winningMove !== null) {
        return winningMove;
    }

    const blockingMove =
        findWinningMove(playerOne.symbol);

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
        playerOneScore.textContent =
            playerOneScoreValue;

        showRoundResult(
            `${playerOne.name} Wins!`
        );

    } else if (result === playerTwo.symbol) {

        winner = playerTwo;

        playerTwoScoreValue++;
        playerTwoScore.textContent =
            playerTwoScoreValue;

        showRoundResult(
            `${playerTwo.name} Wins!`
        );
    }


    // -------------------------
    // GAME OVER
    // -------------------------

    if (
        playerOneScoreValue >= WINNING_SCORE ||
        playerTwoScoreValue >= WINNING_SCORE
    ) {

        setTimeout(() => {
            showFinalResult();
        }, 900);
    }
}


// =========================
// SHOW ROUND RESULT
// =========================

function showRoundResult(message) {

    roundResultMessage.textContent = message;

    roundResult.style.display = "block";
}


// =========================
// SHOW FINAL RESULT
// =========================

function showFinalResult() {

    gameEnded = true;

    roundResult.style.display = "none";
    gameScreen.style.display = "none";
    countdownScreen.style.display = "none";


    finalPlayerOneName.textContent =
        playerOne.name;

    finalPlayerTwoName.textContent =
        playerTwo.name;

    finalPlayerOneScore.textContent =
        playerOneScoreValue;

    finalPlayerTwoScore.textContent =
        playerTwoScoreValue;


    if (
        playerOneScoreValue > playerTwoScoreValue
    ) {

        finalResult.textContent =
            `${playerOne.name} Wins the Game!`;

    } else if (
        playerTwoScoreValue > playerOneScoreValue
    ) {

        finalResult.textContent =
            `${playerTwo.name} Wins the Game!`;

    } else {

        finalResult.textContent =
            "It's a Draw!";
    }


    resultScreen.style.display = "block";
}


// =========================
// NEXT ROUND
// =========================

nextRoundBtn.addEventListener("click", function () {

    if (
        playerOneScoreValue >= WINNING_SCORE ||
        playerTwoScoreValue >= WINNING_SCORE
    ) {
        return;
    }

    round++;

    resetBoard();

    gameEnded = false;
    winner = null;
    currentPlayer = playerOne;

    roundNumber.textContent =
        `Round ${round}`;

    startCountdown();
});


// =========================
// PLAY AGAIN
// =========================

playAgainBtn.addEventListener("click", function () {

    round = 1;

    playerOneScoreValue = 0;
    playerTwoScoreValue = 0;

    playerOneScore.textContent = "0";
    playerTwoScore.textContent = "0";

    resultScreen.style.display = "none";

    resetBoard();

    currentPlayer = playerOne;
    gameEnded = false;
    winner = null;

    roundNumber.textContent =
        `Round ${round}`;

    startCountdown();
});


// =========================
// MAIN MENU
// =========================

mainMenuBtn.addEventListener("click", function () {

    gameScreen.style.display = "none";
    resultScreen.style.display = "none";
    countdownScreen.style.display = "none";
    roundResult.style.display = "none";
    friendSetup.style.display = "none";
    botSetup.style.display = "none";
    difficultyScreen.style.display = "none";

    modeScreen.style.display = "block";
});


// =========================
// RESET BOARD
// =========================

function resetBoard() {

    board = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];

    boardCells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove("x", "o");
    });
}


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
});