import { Depth1Search } from "./Depth1Search";
import { MoveCoordinate } from "./MoveCoordinate";

export function computerTurnDepth1Search(boxes: string[][], blackIsNext: boolean, currentMove: number) {
    console.log("computerDepth1Search");
    //setComputingTime(Date.now() - computingStartTime);
    const move = new Depth1Search;
    const data = move.bestMove(boxes, blackIsNext, currentMove);
    if (data === null) return;
    const coordinate = new MoveCoordinate(data.rowNo, data.columnNo);
    return coordinate;
} 