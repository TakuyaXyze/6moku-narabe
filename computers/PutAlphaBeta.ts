import { AlphaBetaSearch } from "./AlphaBetaSearch";
import { MoveCoordinate } from "./MoveCoordinate";

export function computerTurnAlphaBetaSearch(boxes: string[][], blackIsNext: boolean, currentMove: number, depth: number) {
    console.log("computerTurnMinMaxSearch-start");
    //setComputingTime(Date.now() - computingStartTime);
    const move = new AlphaBetaSearch(depth);
    const data = move.bestMove(boxes, blackIsNext, currentMove, depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
    console.log("computerTurnMinMaxSearch-finish");
    if (data === null) return null;
    const coordinate = new MoveCoordinate(data.rowNo, data.columnNo);
    return coordinate;
} 