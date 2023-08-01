const crypto = require("crypto");
const readline = require("readline");

class Table {
  constructor(arr) {
    this.arr = arr;
  }

  drawTable() {
    const tableTemplate = this.arr.map(() => Array(this.arr.length).fill());

    tableTemplate.forEach((row, rowIndex) => {
      const { win, lose } = new Rules(this.arr).calculateWinLoseMoves(
        this.arr,
        this.arr[rowIndex]
      );

      row.forEach((_cell, cellIndex) => {
        if (win.includes(this.arr[cellIndex])) {
          tableTemplate[rowIndex][cellIndex] = "Win";
        } else if (lose.includes(this.arr[cellIndex])) {
          tableTemplate[rowIndex][cellIndex] = "Lose";
        } else {
          tableTemplate[rowIndex][cellIndex] = "Draft";
        }
      });
    });

    const columnNames = [...this.arr];

    const tableDataWithColNames = tableTemplate.map((row, secondIndex) => {
      const rowData = {
        "User \u2B07 vs. PC \u27A1": columnNames[secondIndex],
      };

      columnNames.forEach((columnName, index) => {
        rowData[columnName] = row[index];
      });

      return rowData;
    });

    console.table(tableDataWithColNames);
  }
}

class Rules {
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

class GenerateKey {
  constructor(keyLength, algorithm = "sha3-256") {
    if (keyLength < 256) {
      throw new Error("The key length should be at least 256 bits.");
    }

    this.keyLength = keyLength;
    this.algorithm = algorithm;
  }

  generateRandomKey() {
    const byteLength = Math.ceil(this.keyLength / 8);
    const buffer = crypto.randomBytes(byteLength);
    return buffer.toString("hex");
  }

  calculateHMAC(message, key) {
    const hmac = crypto.createHmac(this.algorithm, key);
    hmac.update(message);
    const hmacHex = hmac.digest("hex");
    return hmacHex;
  }
}

class Game {
  main() {
    try {
      const args = process.argv.slice(2);

      if (args.length < 3) {
        throw new Error(
          "Invalid number of arguments. Please provide at least 3 moves. \nExample: node game.js Rock Scissors Paper\n"
        );
      }

      const game = new Rules(args);

      const randomKeyGenerator = new GenerateKey(256);
      const randomKey = randomKeyGenerator.generateRandomKey();

      const computerMove = game.getRandomMove();

      const hmac = randomKeyGenerator.calculateHMAC(computerMove, randomKey);
      console.log("HMAC:", hmac);

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const moves = this.createTextForMenuMoves(args);

      this.menu(rl, moves, args, game, computerMove, randomKey);
    } catch (error) {
      console.error(error.message);
    }
  }

  menu(rl, moves, args, game, computerMove, randomKey) {
    rl.question(
      `Available moves:\n${moves}\n0 - exit \n? - help\nEnter your move `,
      (userMove) => {
        switch (userMove) {
          case "0":
            console.log("You exited the game!");
            rl.close();
            break;
          case "?":
            const table = new Table(args, args[0]);
            table.drawTable();
            rl.close();
            break;
          default:
            const numericMove = Number(userMove);
            if (numericMove >= 1 && numericMove <= args.length) {
              game.play(args[numericMove - 1], computerMove);
              rl.close();
              console.log("HMAC key:", randomKey);
            } else {
              this.menu(rl, moves, args, game, computerMove, randomKey);
            }
            break;
        }
      }
    );
  }

  createTextForMenuMoves(args) {
    return args.map((move, index) => `${index + 1} - ${move}`).join("\n");
  }
}

const start = new Game();
start.main();
