import { BeamSearch } from "./BeamSearch";
import { BoardState } from "./BoardState";
import { MoveCoordinate, DoubleMoveCoordinate } from "./Evaluate";
import { computerTurnRandom } from "./PutRandom";

export function computerTurnBeamSearch(boxes: (string | null)[][], currentMove: number, size: number, depth: number): DoubleMoveCoordinate {
    console.log("computerTurnBeamSearch-start");
    //setComputingTime(Date.now() - computingStartTime);
    if (currentMove === 1) {
        const randomMove = computerTurnRandom(boxes, 1);
        const randomCoordinate = new DoubleMoveCoordinate(randomMove.value, randomMove.rowNo, randomMove.columnNo);
        return randomCoordinate;
    }
    const value = undefined;
    const move = new BeamSearch(size);
    const bstate = new BoardState(boxes, currentMove, depth);
    const data = move.bestMove(bstate);
    if (data === null) throw new Error("BeamSearchのbestMoveからの戻り値がnull");
    console.log("computerTurnBeamSearch-finish (" + data.firstRowNo + "," + data.firstColumnNo + "),(" + data.secondRowNo + "," + data.secondColumnNo + ")");
    const coordinate = new DoubleMoveCoordinate(value, data.firstRowNo, data.firstColumnNo, data.secondRowNo, data.secondColumnNo);
    return coordinate;
}