// =========================
// DOM ELEMENTS
// =========================

const gameModeBtns = document.querySelectorAll(".game-mode-btn");

const startGameBtns = document.querySelectorAll(".start-game-btn");

const boardCells = document.querySelectorAll(".board-cell");

const nextRoundBtn = document.querySelector(".next-round-btn");

const playAgainBtn = document.querySelector(".play-again-btn");

const mainMenuBtn = document.querySelector(".main-menu-btn");

const symbolBtns = document.querySelectorAll(".symbol-btn");

const playerOneNameInput = document.getElementById("player-one-name");

const playerTwoNameInput = document.getElementById("player-two-name");

const botPlayerNameInput = document.getElementById("bot-player-name");

const playerOneNameDisplay = document.getElementById("player-one-name-display");

const playerTwoNameDisplay = document.getElementById("player-two-name-display");

const playerOneSymbol = document.getElementById("player-one-symbol");

const playerTwoSymbol = document.getElementById("player-two-symbol");

const playerOneScore = document.getElementById("player-one-score");

const playerTwoScore = document.getElementById("player-two-score");

const roundNumber = document.getElementById("round-number");

const countdownNumber = document.getElementById("countdown-number");

const roundResult = document.getElementById("round-result");

const roundResultMessage = document.getElementById("round-result-message");

const messageModal = document.getElementById("message-modal");

const messageText = document.getElementById("message-text");

const messageBtn = document.getElementById("message-btn");


// =========================
// SCREENS
// =========================

const welcomeScreen = document.querySelector(".welcome-screen");

const modeScreen = document.querySelector(".mode-screen");

const friendSetup = document.querySelector(".friend-setup");

const botSetup = document.querySelector(".bot-setup");

const countdownScreen = document.querySelector(".countdown-screen");

const gameScreen = document.querySelector(".game-screen");

const resultScreen = document.querySelector(".result-screen");


// =========================
// GAMEBOARD
// =========================

let board = [
    "", "", "",
    "", "", "",
    "", "", ""
];
 
let gameMode = null;
let selectedSymbol = null;
let playerOneName = null;
let playerTowName = null;
let round = 1;
let currentPlayer = null;

let playerOne = null;
let playerTow = null;

let winner = null;







// =========================
// GAME MODE
// =========================

gameModeBtns.forEach(button => {
    button.addEventListener("click", function () {

        const mode = button.dataset.mode;

        gameMode = mode;

        if (mode === "friend") {
            friendSetup.style.display = "block";
            botSetup.style.display = "none";

        } else {
            botSetup.style.display = "block";
            friendSetup.style.display = "none";
        }

        modeScreen.style.display = "none";
    });
});


// =========================
// SYMBOL SELECTION
// =========================

symbolBtns.forEach(button => {
    button.addEventListener("click", function () {

        selectedSymbol = button.dataset.symbol;

        console.log(selectedSymbol);
    });
});


// =========================
// START GAME
// =========================

startGameBtns.forEach(button => {

    button.addEventListener("click", function () {
        
        playerOneName = playerOneNameInput.value;
        const symbol = selectedSymbol === "X" ? "O" : "X";
        
        if (gameMode === "friend") {

            playerTowName = playerTwoNameInput.value;

        } else {

            playerTowName = "Bot";
        };


        playerOne = createPlayer(playerOneName, selectedSymbol);
        playerTow = createPlayer(playerTowName, symbol);

        countdownScreen.style.display = "block";
        gameScreen.style.display = "none";

        let count = 3;

        const timer = setInterval(() => {

            if (count > 0) {
                countdownNumber.textContent = count;
                count--;

            } else {
                countdownNumber.textContent = "GO!";

                clearInterval(timer);

                setTimeout(() => {
                    countdownScreen.style.display = "none";
                    gameScreen.style.display = "block";
                }, 500);
            }

        }, 1000);

        
    });
});


// =========================
// BOARD
// =========================

boardCells.forEach(cell => {

    cell.addEventListener("click", function () {

        const index = Number(cell.dataset.index);

        Game(index);

        console.log("Clicked cell:", index);

    });
});


// =========================
// NEXT ROUND
// =========================

nextRoundBtn.addEventListener("click", function () {

    showMessage("Next Round");
    round ++;

});


// =========================
// PLAY AGAIN
// =========================

playAgainBtn.addEventListener("click", function () {

    showMessage("Play Again");

});


// =========================
// MAIN MENU
// =========================

mainMenuBtn.addEventListener("click", function () {

    showMessage("Main Menu");

});



function createPlayer(name,symbol){

    return{
        name,
        symbol
    }
}

   

function Game(index) {

    if (board[index] !== "") {
        return;
    }

    board[index] = currentPlayer.symbol;

    boardCells[index].textContent = currentPlayer.symbol;


    const winnerSymbol = checkWinner();

    if (winnerSymbol === playerOne.symbol) {
        winner = playerOne;
        return;
    }

    if (winnerSymbol === playerTow.symbol) {
        winner = playerTow;
        return;
    }


    currentPlayer = 
        currentPlayer === playerOne
            ? playerTwo
            : playerOne;

}


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


function showMessage(message){
   
    messageText.textContent = message;
    messageModal.style.display = "block";
    messageText.textContent = "";

}