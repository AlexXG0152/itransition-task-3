import { Table } from "console-table-printer";
import Rules from "./rules.js";

export default class TableP {
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

    const columns = [...this.arr];

    const columnNames = [
      { name: "User \u2B07 vs. PC \u27A1", alignment: "left" },
    ];

    columns.forEach((i) => {
      columnNames.push({
        name: i.toUpperCase(),
        alignment: "left",
      });
    });

    const rows = tableTemplate.map((scoreRow, i) => {
      const obj = {};

      columns.forEach((column, j) => {
        const label = column.toUpperCase();
        const score = scoreRow[j];

        obj[label] = score;
      });

      obj["User \u2B07 vs. PC \u27A1"] = columns[i].toUpperCase();
      return obj;
    });

    const print = new Table({
      columns: columnNames,
      rows: rows,
    });

    print.printTable();
  }
}
