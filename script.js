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
  const getValue = () => value;
  return { addToken, getValue };
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
    },
    {
      name: playerTwoName,
      token: "O",
    },
  ];
  let activePlayer = players[0];
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;
  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };
  const playRound = (column, row) => {
    board.selectSquare(column, row, getActivePlayer().token);
    const boardState = board
      .getBoard()
      .map((row) => row.map((cell) => cell.getValue()));
    console.log(boardState);

    const winConditions = [
      [
        boardState[0][0] === boardState[0][1] &&
          boardState[0][1] === boardState[0][2] &&
          boardState[0][2] !== "",
      ],
      [
        boardState[1][0] === boardState[1][1] &&
          boardState[1][1] === boardState[1][2] &&
          boardState[1][2] !== "",
      ],
      [
        boardState[0][0] === boardState[1][0] &&
          boardState[1][0] === boardState[2][0] &&
          boardState[2][0] !== "",
      ],
      [
        boardState[0][1] === boardState[1][1] &&
          boardState[1][1] === boardState[2][1] &&
          boardState[2][1] !== "", 
      ],
      [
        boardState[2][0] === boardState[2][1] &&
          boardState[2][1] === boardState[2][2] &&
          boardState[2][2] !== "", 
      ],
      [
        boardState[0][2] === boardState[1][2] &&
          boardState[2][1] === boardState[2][2] &&
          boardState[2][2] !== "", 
      ],
      [
        boardState[0][0] === boardState[1][1] &&
          boardState[1][1] === boardState[2][2] &&
          boardState[2][2] !== "", 
      ],
      [
        boardState[0][2] === boardState[1][1] &&
          boardState[1][1] === boardState[2][0] &&
          boardState[2][0] !== "", 
      ],
    ];
    console.log(winConditions);

    for (let index = 0; index < winConditions.length; index++) {
      if (winConditions[index].every(Boolean) == true) {
        alert(`${getActivePlayer()} wins!`);
      }
    }
    printNewRound();
    switchPlayerTurn();
  };
  printNewRound();
  return { playRound, getActivePlayer, getBoard: board.getBoard };
}

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector(".turn-updater");
  const boardDiv = document.querySelector(".board");
  const updateBar = document.querySelector(".notifications");

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

  updateScreen();
}

ScreenController();
