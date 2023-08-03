import { createInterface } from "readline";

import Rules from "./rules.js";
import TableP from "./table.js";
import GenerateKey from "./generateKey.js";

export default class Game {
  main() {
    try {
      const args = process.argv.slice(2);

      if (args.length < 3) {
        throw new Error(
          "Invalid number of moves. Please provide at least 3 moves. \nExample: node game.js Rock Scissors Paper\n"
        );
      }

      if (!this.checkDuplicates(args)) {
        throw new Error(
          "Duplicates moves. Please provide at least 3 different moves. \nExample: node game.js Rock Scissors Paper\n"
        );
      }

      const game = new Rules(args);

      const randomKeyGenerator = new GenerateKey(256);
      const randomKey = randomKeyGenerator.generateRandomKey();

      const computerMove = game.getRandomMove();

      const hmac = randomKeyGenerator.calculateHMAC(computerMove, randomKey);
      console.log("HMAC:", hmac);

      const rl = createInterface({
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
            const table = new TableP(args, args[0]);
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

  checkDuplicates(args) {
    return args.length === [...new Set(args)].length;
  }
}
