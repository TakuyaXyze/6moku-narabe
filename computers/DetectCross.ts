import { ROWS, COLUMNS } from "./GameRule";
import { MoveCoordinate } from "./Evaluate";

export function detectCross(boxes: (string | null)[][], color: string): MoveCoordinate[] {
    const result: MoveCoordinate[] = [];
    for (let rowNo = 1; rowNo < ROWS - 1; rowNo++) {
        for (let columnNo = 1; columnNo < COLUMNS - 1; columnNo++) {
            if (boxes[rowNo][columnNo] !== color) continue;
            if (boxes[rowNo - 1][columnNo] === color
                && boxes[rowNo + 1][columnNo] === color
                && boxes[rowNo][columnNo - 1] === color
                && boxes[rowNo][columnNo + 1] === color
            ) {
                result.push(new MoveCoordinate(rowNo, columnNo, undefined));
            }
            if (boxes[rowNo - 1][columnNo - 1] === color
                && boxes[rowNo - 1][columnNo + 1] === color
                && boxes[rowNo + 1][columnNo - 1] === color
                && boxes[rowNo + 1][columnNo + 1] === color
            ) {
                result.push(new MoveCoordinate(rowNo, columnNo, undefined));
            }
        }
    }
    return result;
}
