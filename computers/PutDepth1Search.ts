import { Depth1Search } from "./Depth1Search";
import { MoveCoordinate } from "./Evaluate";

export function computerTurnDepth1Search(boxes: (string | null)[][], currentMove: number) {
    console.log("computerTurnDepth1Search");
    //setComputingTime(Date.now() - computingStartTime);
    const value = undefined;
    const move = new Depth1Search;
    const data = move.bestMove(boxes, currentMove);
    if (data === null) return null;
    const coordinate = new MoveCoordinate(data.rowNo, data.columnNo, value);
    return coordinate;
} 