import { ROWS, COLUMNS, SEQUENCE_LENGTH } from "./GameRule";
import { MoveCoordinate } from "./Evaluate";

export function detectWinLine(boxes: (string | null)[][]): MoveCoordinate[] {
    const result: MoveCoordinate[] = [];
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS - SEQUENCE_LENGTH + 1; j++) {
            if (!boxes[i][j]) continue;
            let count = 0;
            for (let k = 0; k < SEQUENCE_LENGTH; k++) {
                if (boxes[i][j + k] !== boxes[i][j]) break;
                count++;
            }
            if (count === SEQUENCE_LENGTH) {
                for (let l = 0; l < SEQUENCE_LENGTH; l++) {
                    result.push(new MoveCoordinate(i, j + l, undefined));
                }
            }
        }
    }
    for (let i = 0; i < ROWS - SEQUENCE_LENGTH + 1; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            if (!boxes[i][j]) continue;
            let count = 0;
            for (let k = 0; k < SEQUENCE_LENGTH; k++) {
                if (boxes[i + k][j] !== boxes[i][j]) break;
                count++;
            }
            if (count === SEQUENCE_LENGTH) {
                for (let l = 0; l < SEQUENCE_LENGTH; l++) {
                    result.push(new MoveCoordinate(i + l, j, undefined));
                }
            }
        }
    }
    for (let i = 0; i < ROWS - SEQUENCE_LENGTH + 1; i++) {
        for (let j = 0; j < COLUMNS - SEQUENCE_LENGTH + 1; j++) {
            if (!boxes[i][j]) continue;
            let count = 0;
            for (let k = 0; k < SEQUENCE_LENGTH; k++) {
                if (boxes[i + k][j + k] !== boxes[i][j]) break;
                count++;
            }
            if (count === SEQUENCE_LENGTH) {
                for (let l = 0; l < SEQUENCE_LENGTH; l++) {
                    result.push(new MoveCoordinate(i + l, j + l, undefined));
                }
            }
        }
    }
    for (let i = 0; i < ROWS - SEQUENCE_LENGTH + 1; i++) {
        for (let j = SEQUENCE_LENGTH - 1; j < COLUMNS; j++) {
            if (!boxes[i][j]) continue;
            let count = 0;
            for (let k = 0; k < SEQUENCE_LENGTH; k++) {
                if (boxes[i + k][j - k] !== boxes[i][j]) break;
                count++;
            }
            if (count === SEQUENCE_LENGTH) {
                for (let l = 0; l < SEQUENCE_LENGTH; l++) {
                    result.push(new MoveCoordinate(i + l, j - l, undefined));
                }
            }
        }
    }
    return result;
}