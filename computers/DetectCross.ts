import { ROWS, COLUMNS } from "./GameRule";
import { MoveCoordinate } from "./Evaluate";

const CROSS_SHAPES: number[][][] = [
    [[-1, 0], [1, 0], [0, -1], [0, 1]],
    [[-1, -1], [-1, 1], [1, -1], [1, 1]],
];

export function detectCross(boxes: (string | null)[][], color: string): MoveCoordinate[] {
    const result: MoveCoordinate[] = [];
    for (let rowNo = 1; rowNo < ROWS - 1; rowNo++) {
        for (let columnNo = 1; columnNo < COLUMNS - 1; columnNo++) {
            if (boxes[rowNo][columnNo] !== color) continue;
            for (let shapeNo = 0; shapeNo < CROSS_SHAPES.length; shapeNo++) {
                const shape = CROSS_SHAPES[shapeNo];
                let filled = true;
                for (const offset of shape) {
                    if (boxes[rowNo + offset[0]][columnNo + offset[1]] !== color) {
                        filled = false;
                        break;
                    }
                }
                if (filled) result.push(new MoveCoordinate(rowNo, columnNo, shapeNo));
            }
        }
    }
    return result;
}

export function crossKey(cross: MoveCoordinate): string {
    return cross.rowNo + "-" + cross.columnNo + "-" + cross.value;
}

export function crossCells(cross: MoveCoordinate): MoveCoordinate[] {
    const shape = CROSS_SHAPES[cross.value ?? 0];
    const cells: MoveCoordinate[] = [new MoveCoordinate(cross.rowNo, cross.columnNo, undefined)];
    for (const offset of shape) {
        cells.push(new MoveCoordinate(cross.rowNo + offset[0], cross.columnNo + offset[1], undefined));
    }
    return cells;
}
