import { MinMaxSearch } from "./MinMaxSearch";
import { MoveCoordinate } from "./MoveCoordinate";

export function computerTurnDepth1Search(boxes: string[][], blackIsNext: boolean, currentMove: number) {
    console.log("computerDepth1Search");
    //setComputingTime(Date.now() - computingStartTime);
    const move = new MinMaxSearch;
    const data = move.bestMove(boxes, blackIsNext, currentMove);
    if (data === null) return;
    const coordinate = new MoveCoordinate(data.rowNo, data.columnNo);
    return coordinate;
} 