function GameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }
  // returns board state for UI rendering
  const getBoard = () => board;
  const selectSquare = (column, row, player) => {
    board[row][column].addToken(player);
  };
  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
  };

  return { getBoard, selectSquare, printBoard };
}

function Cell() {
  let value = "";
  const addToken = (player) => {
    value = player;
  };
  const resetValue = () => value = '';  
  const getValue = () => value;
  return { addToken, getValue, resetValue };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = GameBoard();
  const players = [
    {
      name: playerOneName,
      token: "X",
      score: 0,
    },
    {
      name: playerTwoName,
      token: "O",
      score: 0,
    },
  ];
  let activePlayer = players[0];
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const playerCreator = (player, number) => {
    players[number].name = player;
  };
  const getActivePlayer = () => activePlayer;
  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const winChecker = () => {
    const boardState = board
      .getBoard()
      .map((row) => row.map((cell) => cell.getValue()));
    const winConditions = [
      boardState[0][0] === boardState[0][1] &&
        boardState[0][1] === boardState[0][2] &&
        boardState[0][2] !== "",
      boardState[1][0] === boardState[1][1] &&
        boardState[1][1] === boardState[1][2] &&
        boardState[1][2] !== "",
      boardState[0][0] === boardState[1][0] &&
        boardState[1][0] === boardState[2][0] &&
        boardState[2][0] !== "",
      boardState[0][1] === boardState[1][1] &&
        boardState[1][1] === boardState[2][1] &&
        boardState[2][1] !== "",
      boardState[2][0] === boardState[2][1] &&
        boardState[2][1] === boardState[2][2] &&
        boardState[2][2] !== "",
      boardState[0][2] === boardState[1][2] &&
        boardState[2][1] === boardState[2][2] &&
        boardState[2][2] !== "",
      boardState[0][0] === boardState[1][1] &&
        boardState[1][1] === boardState[2][2] &&
        boardState[2][2] !== "",
      boardState[0][2] === boardState[1][1] &&
        boardState[1][1] === boardState[2][0] &&
        boardState[2][0] !== "",
    ];
    for (let index = 0; index < winConditions.length; index++) {
      if (winConditions[index] == true) {
        console.log(activePlayer.name + " wins!");
        return true;
      }
    }
  };

  const tieChecker = () => {
    const boardState = board
    .getBoard()
    .map((row) => row.map((cell) => cell.getValue()));
    if (boardState[0].every((cellVal) => cellVal !== "")) {
      if (boardState[1].every((cellVal) => cellVal !== "")) {
        if (boardState[2].every((cellVal) => cellVal !== "")) {
          return true;
        }
      }
    }
  };

  const playRound = (column, row) => {
    board.selectSquare(column, row, getActivePlayer().token);
    if (winChecker() !== true) {
      switchPlayerTurn();
      printNewRound();
    }
  };
  printNewRound();
  return { playerCreator, players, playRound, getActivePlayer, tieChecker, winChecker, getBoard: board.getBoard };
}

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector(".turn-updater");
  const boardDiv = document.querySelector(".board");
  const playerNameForm0 = document.querySelector('#form-0');
  const playerNameForm1 = document.querySelector('#form-1');
  const playerScore0 = document.querySelector('.player-0-scorecard');
  const playerScore1 = document.querySelector('.player-1-scorecard');
  const updateBar = document.querySelector(".notifications");
  updateBar.textContent = "who wins??";
  
  const updateScreen = () => {
    boardDiv.textContent = "";
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    playerTurnDiv.textContent = `${activePlayer.name}'s turn`;
    board.forEach((row) => {
      row.forEach((cell, index) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.column = index;
        cellButton.dataset.row = board.indexOf(row);
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
    if (game.winChecker() == true) {
      updateBar.textContent = activePlayer.name + " wins!";
      activePlayer.score += 1;
    }
    playerScore0.textContent = game.players[0].score;
    playerScore1.textContent = game.players[1].score;
    if (game.tieChecker() == true) {
      updateBar.textContent = 'TIE! Play again :)';
    }
  };
  
  function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;
    if (!selectedColumn) return;
    if (e.target.textContent !== "") {
      alert("CHOOSE ANOTHER SQUARE");
      return;
    }
    game.playRound(selectedColumn, selectedRow);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);
  playerNameForm0.addEventListener('submit', (e) => {
    e.preventDefault();
    const playerName = document.querySelector('#player-name-0').value;
    game.playerCreator(playerName, 0);
    updateScreen();
  })
  playerNameForm1.addEventListener('submit', (e) => {
    e.preventDefault();
    const playerName = document.querySelector('#player-name-1').value;
    game.playerCreator(playerName, 1);
    updateScreen();
  })

  updateScreen();
}

ScreenController();
