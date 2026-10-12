import { ROWS, COLUMNS, SEQUENCE_LENGTH } from "./GameRule";

export type WinMove = {
    rowNo: number;
    columnNo: number;
    order: number;      //列の中で何番目に光るか。0から数える
};

const DIRECTIONS: [number, number][] = [[0, 1], [1, 0], [1, 1], [1, -1]];

export function detectWinLine(boxes: (string | null)[][]): WinMove[] {
    const result: WinMove[] = [];
    for (const [rowStep, columnStep] of DIRECTIONS) {
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLUMNS; j++) {
                const color = boxes[i][j];
                if (!color) continue;
                if (stoneAt(boxes, i - rowStep, j - columnStep) === color) continue;     //列の途中からは数えない
                let length = 1;
                while (stoneAt(boxes, i + rowStep * length, j + columnStep * length) === color) length++;
                if (length < SEQUENCE_LENGTH) continue;
                for (let k = 0; k < length; k++) {
                    result.push({ rowNo: i + rowStep * k, columnNo: j + columnStep * k, order: k });
                }
            }
        }
    }
    return result;
}

function stoneAt(boxes: (string | null)[][], rowNo: number, columnNo: number): string | null {
    if (rowNo < 0 || rowNo >= ROWS || columnNo < 0 || columnNo >= COLUMNS) return null;
    return boxes[rowNo][columnNo];
}
