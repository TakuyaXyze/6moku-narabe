import { BoardState } from "./BoardState";
import { Depth1Search } from "./Depth1Search";
import { MoveCoordinate } from "./Evaluate";

export function computerTurnDepth1Search(boxes: (string | null)[][], currentMove: number) {
    console.log("computerTurnDepth1Search");
    //setComputingTime(Date.now() - computingStartTime);
    const value = undefined;
    const move = new Depth1Search;
    //const data = move.bestMove(boxes, currentMove);
    const bstate = new BoardState(boxes, currentMove, 1); //depth=1
    const data = move.bestMove(bstate);
    if (data === null) throw new Error("Depth1SearchのbestMoveからの戻り値がnull");
    const coordinate = new MoveCoordinate(data.rowNo, data.columnNo, value);
    return coordinate;
} 