import { AlphaBetaSearch } from "./AlphaBetaSearch";
import { MoveCoordinate } from "./Evaluate";

export function computerTurnAlphaBetaSearch(boxes: (string | null)[][], currentMove: number, depth: number) {
    console.log("computerTurnAlphaBetaSearch-start");
    //setComputingTime(Date.now() - computingStartTime);
    const value = undefined;
    const move = new AlphaBetaSearch(depth);
    const data = move.bestMove(boxes, currentMove, depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
    console.log("computerTurnAlphaBetaSearch-finish");
    if (data === null) return null;
    const coordinate = new MoveCoordinate(data.rowNo, data.columnNo, value);
    return coordinate;
}