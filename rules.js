export default class Rules {
  constructor(moves) {
    if (moves.length < 3 || moves.length % 2 !== 1) {
      throw new Error(
        "Invalid number of moves. Please provide an odd number greater than or equal to 3. \nExample: node game.js Rock Scissors Paper\n"
      );
    }

    this.moves = moves;
  }

  play(userMove, computerMove) {
    console.log(`Your move: ${userMove}`);
    console.log(`Computer's move: ${computerMove}`);

    if (this.moves.indexOf(userMove) === -1) {
      throw new Error("Invalid move. Please enter a valid move.");
    }

    const loseWinPositions = this.calculateWinLoseMoves(this.moves, userMove);

    if (loseWinPositions.win.includes(computerMove)) {
      console.log("You win!");
    } else if (loseWinPositions.lose.includes(computerMove)) {
      console.log("You lose!");
    } else {
      console.log("It's a tie!");
    }
  }

  getRandomMove() {
    const randomIndex = Math.floor(Math.random() * this.moves.length);
    return this.moves[randomIndex];
  }

  calculateWinLoseMoves(arr, selectedElement) {
    const selectedIndex = arr.indexOf(selectedElement);

    if (selectedIndex === -1) {
      console.log("Selected element is not found in the array.");
      return;
    }

    const firstHalf = arr
      .slice(selectedIndex + 1)
      .concat(arr.slice(0, selectedIndex));

    return {
      lose: firstHalf,
      win: firstHalf.splice(0, Math.floor(arr.length / 2)),
    };
  }
}
