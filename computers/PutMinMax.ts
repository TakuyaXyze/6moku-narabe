import { MoveCoordinate } from "./MoveCoordinate";

export function computerTurnMinMax(boxes: string[][]) {
    console.log("computerMinMax");
    //setComputingTime(Date.now() - computingStartTime);
    let rowNo: number;
    let columnNo: number;
    do {
        rowNo = Math.floor(Math.random() * 19.0);
        columnNo = Math.floor(Math.random() * 19.0);
    } while (boxes[rowNo][columnNo])
    let coordinate = new MoveCoordinate(rowNo, columnNo);
    return coordinate;
}