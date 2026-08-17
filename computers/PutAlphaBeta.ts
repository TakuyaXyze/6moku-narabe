import { AlphaBetaSearch } from "./AlphaBetaSearch";
import { MoveCoordinate } from "./Evaluate";
import { computerTurnRandom } from "./PutRandom";

export function computerTurnAlphaBetaSearch(boxes: (string | null)[][], currentMove: number, depth: number): MoveCoordinate {
    console.log("computerTurnAlphaBetaSearch-start");
    //setComputingTime(Date.now() - computingStartTime);
    if (currentMove === 1) {
        return computerTurnRandom(boxes);
    }
    const value = undefined;
    const move = new AlphaBetaSearch(depth);
    const data = move.bestMove(boxes, currentMove, depth);
    console.log("computerTurnAlphaBetaSearch-finish");
    if (data === null) throw new Error("AlphaBetaSearchのbestMoveからの戻り値がnull");
    const coordinate = new MoveCoordinate(data.rowNo, data.columnNo, value);
    return coordinate;
}   