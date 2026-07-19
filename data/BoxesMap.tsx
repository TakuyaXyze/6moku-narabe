import { ROW, COLUMN } from "../components/GameBoard"

type BoxesStatus = {
    rowNo: number,
    columnNo: number,
    status: string      //碁石の情報。["void","white","black"]をとる。
}

const boxesMap = new Map<number, BoxesStatus>();
let count: number = 0;
while (count < ROW * COLUMN) {
    for (let i: number = 0; i < ROW; i++) {
        for (let j: number = 0; j < COLUMN; j++) {
            boxesMap.set(count, { rowNo: i + 1, columnNo: j + 1, status: "void" })
            count++;
        }
    }
}