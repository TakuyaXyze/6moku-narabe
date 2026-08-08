import { MinMaxSearch } from "./MinMaxSearch";
import { MoveCoordinate } from "./MoveCoordinate";

export function computerTurnMinMaxSearch(boxes: string[][], blackIsNext: boolean, currentMove: number, depth: number) {
    console.log("computerTurnMinMaxSearch-start");
    //setComputingTime(Date.now() - computingStartTime);
    const move = new MinMaxSearch(depth);
    const data = move.bestMove(boxes, blackIsNext, currentMove, depth);
    console.log("computerTurnMinMaxSearch-finish");
    if (data === null) return null;
    const coordinate = new MoveCoordinate(data.rowNo, data.columnNo);
    return coordinate;
} 