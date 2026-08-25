const gameModeBtns = document.querySelectorAll(".game-mode-btn");
const difficultyBtns = document.querySelectorAll(".difficulty-btn");
const startGameBtns = document.querySelectorAll(".setup-content .start-game-btn");
const openModeBtn = document.querySelector(".open-mode-btn");
const boardCells = document.querySelectorAll(".board-cell");
const nextRoundBtn = document.querySelector(".next-round-btn");
const playAgainBtn = document.querySelector(".play-again-btn");
const mainMenuBtn = document.querySelector(".main-menu-btn");
const symbolBtns = document.querySelectorAll(".symbol-btn");
const backBtns = document.querySelectorAll(".back-btn:not(.game-exit-btn)");
const exitGameBtn = document.getElementById("exit-game-btn");
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
const finalPlayerOneName = document.getElementById("final-player-one-name");
const finalPlayerTwoName = document.getElementById("final-player-two-name");
const finalPlayerOneScore = document.getElementById("final-player-one-score");
const finalPlayerTwoScore = document.getElementById("final-player-two-score");
const finalResult = document.getElementById("final-result");
const messageModal = document.getElementById("message-modal");
const messageText = document.getElementById("message-text");
const messageBtn = document.getElementById("message-btn");
const messageCancelBtn = document.getElementById("message-cancel-btn");
const welcomeScreen = document.querySelector(".welcome-screen");
const modeScreen = document.querySelector(".mode-screen");
const friendSetup = document.querySelector(".friend-setup");
const botSetup = document.querySelector(".bot-setup");
const difficultyScreen = document.querySelector(".difficulty-screen");
const countdownScreen = document.querySelector(".countdown-screen");
const gameScreen = document.querySelector(".game-screen");
const resultScreen = document.querySelector(".result-screen");

let board = ["", "", "", "", "", "", "", "", ""];
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
let countdownTimer = null;
let countdownTimeout = null;
let botTimer = null;
let roundResultTimer = null;
let finalResultTimer = null;
let pendingMessageAction = null;

const TOTAL_ROUNDS = 3;
const RESULT_REVEAL_DELAY = 1000;
const FINAL_RESULT_DELAY = 1200;

const mobileBackStyles = document.createElement("style");
mobileBackStyles.textContent = `
@media (max-width: 700px) {
    .screen-shell .back-btn { width:38px; height:38px; top:-6px; left:0; font-size:1.15rem; }
    .game-screen .game-exit-btn { width:38px; height:38px; top:8px; left:0; font-size:1.15rem; }
}
@media (max-width:460px) {
    .screen-shell .back-btn { width:34px; height:34px; top:-10px; left:0; font-size:1rem; }
    .game-screen .game-exit-btn { width:34px; height:34px; top:5px; font-size:1rem; }
}`;
document.head.appendChild(mobileBackStyles);

/* Every screen is a separate full-page view. The welcome page starts visible;
   all other screens are hidden until showScreen() explicitly opens them. */
welcomeScreen.style.display = "flex";
modeScreen.style.display = "none";
friendSetup.style.display = "none";
botSetup.style.display = "none";
difficultyScreen.style.display = "none";
countdownScreen.style.display = "none";
gameScreen.style.display = "none";
resultScreen.style.display = "none";
roundResult.style.display = "none";
messageModal.style.display = "none";

function hideAllScreens() {
    welcomeScreen.style.display = "none";
    modeScreen.style.display = "none";
    friendSetup.style.display = "none";
    botSetup.style.display = "none";
    difficultyScreen.style.display = "none";
    countdownScreen.style.display = "none";
    gameScreen.style.display = "none";
    resultScreen.style.display = "none";
    roundResult.style.display = "none";
}

function showScreen(screen) {
    hideAllScreens();
    screen.style.display = "flex";
}

function clearTimers() {
    clearInterval(countdownTimer);
    clearTimeout(countdownTimeout);
    clearTimeout(botTimer);
    clearTimeout(roundResultTimer);
    clearTimeout(finalResultTimer);
    countdownTimer = null;
    countdownTimeout = null;
    botTimer = null;
    roundResultTimer = null;
    finalResultTimer = null;
}

openModeBtn.addEventListener("click", () => showScreen(modeScreen));

gameModeBtns.forEach(button => {
    button.addEventListener("click", () => {
        gameMode = button.dataset.mode;
        showScreen(gameMode === "friend" ? friendSetup : difficultyScreen);
    });
});

difficultyBtns.forEach(button => {
    button.addEventListener("click", () => {
        difficultyBtns.forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
        difficulty = button.dataset.difficulty;
        showScreen(botSetup);
    });
});

symbolBtns.forEach(button => {
    button.addEventListener("click", () => {
        const setup = button.closest(".setup-content");
        setup.querySelectorAll(".symbol-btn").forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
        selectedSymbol = button.dataset.symbol;
    });
});

backBtns.forEach(button => {
    button.addEventListener("click", () => {
        const target = button.dataset.back;
        if (target === "welcome") showScreen(welcomeScreen);
        if (target === "mode") showScreen(modeScreen);
        if (target === "difficulty") showScreen(difficultyScreen);
    });
});

startGameBtns.forEach(button => {
    button.addEventListener("click", () => {
        if (!gameMode) return showMessage("Please choose a game mode first.");
        if (!selectedSymbol) return showMessage("Please choose X or O.");
        playerOneName = gameMode === "bot" ? botPlayerNameInput.value.trim() : playerOneNameInput.value.trim();
        if (!playerOneName) return showMessage("Please enter your name.");
        if (gameMode === "friend") {
            playerTwoName = playerTwoNameInput.value.trim();
            if (!playerTwoName) return showMessage("Please enter Player 2 name.");
        } else {
            playerTwoName = "Bot";
            if (!difficulty) return showMessage("Please choose a difficulty first.");
        }
        const secondSymbol = selectedSymbol === "X" ? "O" : "X";
        playerOne = createPlayer(playerOneName, selectedSymbol);
        playerTwo = createPlayer(playerTwoName, secondSymbol);
        round = 1;
        playerOneScoreValue = 0;
        playerTwoScoreValue = 0;
        playerOneScore.textContent = "0";
        playerTwoScore.textContent = "0";
        playerOneNameDisplay.textContent = playerOne.name;
        playerTwoNameDisplay.textContent = playerTwo.name;
        playerOneSymbol.textContent = playerOne.symbol;
        playerTwoSymbol.textContent = playerTwo.symbol;
        winner = null;
        gameEnded = false;
        startRound();
    });
});

function startRound() {
    clearTimers();
    resetBoard();
    gameEnded = false;
    winner = null;
    currentPlayer = playerOne;
    roundNumber.textContent = round;
    nextRoundBtn.style.display = round < TOTAL_ROUNDS ? "inline-flex" : "none";
    showScreen(countdownScreen);
    let count = 3;
    countdownNumber.textContent = count;
    countdownTimer = setInterval(() => {
        count--;
        countdownNumber.textContent = count > 0 ? count : "GO!";
        if (count <= 0) {
            clearInterval(countdownTimer);
            countdownTimer = null;
            countdownTimeout = setTimeout(() => {
                showScreen(gameScreen);
                currentPlayer = playerOne;
            }, 350);
        }
    }, 800);
}

boardCells.forEach(cell => {
    cell.addEventListener("click", () => {
        if (gameEnded || !currentPlayer) return;
        if (gameMode === "bot" && currentPlayer === playerTwo) return;
        Game(Number(cell.dataset.index));
    });
});

function Game(index) {
    if (gameEnded || board[index] !== "") return;
    board[index] = currentPlayer.symbol;
    boardCells[index].textContent = currentPlayer.symbol;
    boardCells[index].classList.remove("x", "o");
    boardCells[index].classList.add(currentPlayer.symbol.toLowerCase());
    const winnerSymbol = checkWinner();
    if (winnerSymbol !== null) return endRound(winnerSymbol);
    if (board.every(cell => cell !== "")) return endRound("draw");
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    if (gameMode === "bot" && currentPlayer === playerTwo) botTimer = setTimeout(makeBotMove, 300);
}

function checkWinner() {
    const winningCombinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const [a,b,c] of winningCombinations) if (board[a] && board[a] === board[b] && board[b] === board[c]) return board[a];
    return null;
}

function makeBotMove() {
    botTimer = null;
    if (gameEnded || currentPlayer !== playerTwo) return;
    const move = difficulty === "hard" ? getHardBotMove() : getEasyBotMove();
    if (move !== null) Game(move);
}
function getEasyBotMove() { const cells = getEmptyCells(); return cells.length ? cells[Math.floor(Math.random()*cells.length)] : null; }
function getHardBotMove() {
    const winningMove = findWinningMove(playerTwo.symbol);
    if (winningMove !== null) return winningMove;
    const blockingMove = findWinningMove(playerOne.symbol);
    if (blockingMove !== null) return blockingMove;
    if (board[4] === "") return 4;
    return getEasyBotMove();
}
function findWinningMove(symbol) {
    for (const index of getEmptyCells()) {
        board[index] = symbol;
        const result = checkWinner();
        board[index] = "";
        if (result === symbol) return index;
    }
    return null;
}
function getEmptyCells() { return board.reduce((cells,cell,index) => { if (cell === "") cells.push(index); return cells; }, []); }

function endRound(result) {
    gameEnded = true;
    clearTimeout(botTimer);
    botTimer = null;
    let message;
    if (result === "draw") { winner = null; message = "It's a Draw!"; }
    else if (result === playerOne.symbol) { winner = playerOne; playerOneScoreValue++; playerOneScore.textContent = playerOneScoreValue; message = `${playerOne.name} Wins the Round!`; }
    else { winner = playerTwo; playerTwoScoreValue++; playerTwoScore.textContent = playerTwoScoreValue; message = `${playerTwo.name} Wins the Round!`; }
    roundResultTimer = setTimeout(() => {
        showRoundResult(message);
        if (round >= TOTAL_ROUNDS) finalResultTimer = setTimeout(showFinalResult, FINAL_RESULT_DELAY);
    }, RESULT_REVEAL_DELAY);
}

function showRoundResult(message) {
    roundResultMessage.textContent = message;
    nextRoundBtn.style.display = round < TOTAL_ROUNDS ? "inline-flex" : "none";
    roundResult.style.display = "flex";
}
nextRoundBtn.addEventListener("click", () => { if (round >= TOTAL_ROUNDS) return; round++; startRound(); });

function showFinalResult() {
    clearTimers();
    gameEnded = true;
    roundResult.style.display = "none";
    finalPlayerOneName.textContent = playerOne.name;
    finalPlayerTwoName.textContent = playerTwo.name;
    finalPlayerOneScore.textContent = playerOneScoreValue;
    finalPlayerTwoScore.textContent = playerTwoScoreValue;
    if (playerOneScoreValue > playerTwoScoreValue) finalResult.textContent = `${playerOne.name} Wins the Match!`;
    else if (playerTwoScoreValue > playerOneScoreValue) finalResult.textContent = `${playerTwo.name} Wins the Match!`;
    else finalResult.textContent = "The Match Ends in a Draw!";
    showScreen(resultScreen);
}

playAgainBtn.addEventListener("click", () => { round=1; playerOneScoreValue=0; playerTwoScoreValue=0; playerOneScore.textContent="0"; playerTwoScore.textContent="0"; startRound(); });
mainMenuBtn.addEventListener("click", () => { clearTimers(); showScreen(modeScreen); });
exitGameBtn.addEventListener("click", () => showMessage("Are you sure you want to leave the game?", () => { clearTimers(); gameEnded=true; showScreen(welcomeScreen); }, true));
function resetBoard() { board=["","","","","","","","",""]; boardCells.forEach(cell => { cell.textContent=""; cell.classList.remove("x","o"); }); }
function createPlayer(name,symbol) { return {name,symbol}; }
function showMessage(message,action=null,isConfirmation=false) { messageText.textContent=message; pendingMessageAction=action; messageBtn.textContent=isConfirmation?"Yes":"OK"; messageCancelBtn.style.display=isConfirmation?"inline-flex":"none"; messageModal.style.display="flex"; }
function closeMessage() { messageModal.style.display="none"; pendingMessageAction=null; }
messageBtn.addEventListener("click", () => { const action=pendingMessageAction; closeMessage(); if(action) action(); });
messageCancelBtn.addEventListener("click", closeMessage);