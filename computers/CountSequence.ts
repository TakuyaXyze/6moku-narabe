import { ROWS, COLUMNS, SEQUENCE_LENGTH } from "../components/PlayGround";

export function detectSequence(boxes: (string | null)[][], color: string): number[] {
    if (!(color === "b" || color === "w")) throw new Error(`入力できるcolor:stringは"b"と"w"のいずれか一つです`)
    let againstColor;
    if (color === "b") {
        againstColor = "w"
    } else {
        againstColor = "b"
    }
    //横並びの連続の判定
    let blockCount = new Array<number>(SEQUENCE_LENGTH - 1).fill(0); //塊の個数を保持

    for (let i = 0; i < ROWS; i++) { // i:行数番号
        for (let j = 0; j < COLUMNS - SEQUENCE_LENGTH + 1; j++) { // j:列数番号
            let sequencyCount = 0;
            let colorCount = 0;
            for (let k = 0; k < SEQUENCE_LENGTH; k++) { // k:連続個数のカウンター
                if (boxes[i][j + k] === againstColor) break; //SEQUENCE_LENGTH個連続でcolor OR null。そうでなければ棄却
                if (boxes[i][j + k] === color) colorCount++; //充填個数のカウント
                sequencyCount++;
            }
            if (sequencyCount >= SEQUENCE_LENGTH) {
                if (colorCount >= 2) {
                    blockCount[colorCount - 2]++;
                }
            }
        }
    }
    for (let i = 0; i < ROWS - SEQUENCE_LENGTH + 1; i++) { //縦並びの連続の判定
        for (let j = 0; j < COLUMNS; j++) {
            let sequencyCount = 0;
            let colorCount = 0;
            for (let k = 0; k < SEQUENCE_LENGTH; k++) {
                if (boxes[i + k][j] === againstColor) break;
                if (boxes[i + k][j] === color) colorCount++;
                sequencyCount++;
            }
            if (sequencyCount >= SEQUENCE_LENGTH) {
                if (colorCount >= 2) {
                    blockCount[colorCount - 2]++;
                }
            }
        }
    }
    for (let i = 0; i < ROWS - SEQUENCE_LENGTH + 1; i++) {
        for (let j = 0; j < COLUMNS - SEQUENCE_LENGTH + 1; j++) {
            let sequencyCount = 0;
            let colorCount = 0;
            for (let k = 0; k < SEQUENCE_LENGTH; k++) {
                if (boxes[i + k][j + k] === againstColor) break;
                if (boxes[i + k][j + k] === color) colorCount++;
                sequencyCount++;
            }
            if (sequencyCount >= SEQUENCE_LENGTH) {
                if (colorCount >= 2) {
                    blockCount[colorCount - 2]++;
                }
            }
        }
    }
    for (let i = 0; i < ROWS - SEQUENCE_LENGTH + 1; i++) {
        for (let j = SEQUENCE_LENGTH - 1; j < COLUMNS; j++) {
            let sequencyCount = 0;
            let colorCount = 0;
            for (let k = 0; k < SEQUENCE_LENGTH; k++) {
                if (boxes[i + k][j - k] === againstColor) break;
                if (boxes[i + k][j - k] === color) colorCount++;
                sequencyCount++;
            }
            if (sequencyCount >= SEQUENCE_LENGTH) {
                if (colorCount >= 2) {
                    blockCount[colorCount - 2]++;
                }
            }
        }
    }
    return blockCount;
}

/*

- SEQUENCE_LENGTHマス確保（colorとnullのマスがSEQUENCE_LENGTHマス連続）
- SEQUENCE_LENGTHマスのうち何マスが埋まっているのかをカウント
- 確保したマスの充填率(2 ~ `min(SEQUENCE_LENGTH,6)`マス)について、塊の個数を返す

*/