import { MinMaxSearch } from "./MinMaxSearch";
import { MoveCoordinate } from "./MoveCoordinate";

export function computerTurnMinMaxSearch(boxes: string[][], blackIsNext: boolean, currentMove: number) {
    console.log("computerTurnMinMaxSearch");
    //setComputingTime(Date.now() - computingStartTime);
    const move = new MinMaxSearch;
    const data = move.bestMove(boxes, blackIsNext, currentMove);
    if (data === null) return null;
    const coordinate = new MoveCoordinate(data.rowNo, data.columnNo);
    return coordinate;
} 