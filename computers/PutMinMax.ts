import { MinMaxSearch } from "./MinMaxSearch";
import { MoveCoordinate } from "./Evaluate";

export function computerTurnMinMaxSearch(boxes: (string | null)[][], currentMove: number, depth: number) {
    console.log("computerTurnMinMaxSearch-start");
    //setComputingTime(Date.now() - computingStartTime);
    const value = undefined;
    const move = new MinMaxSearch(depth);
    const data = move.bestMove(boxes, currentMove, depth);
    console.log("computerTurnMinMaxSearch-finish");
    if (data === null) throw new Error("MinMaxSearchのbestMoveからの戻り値がnull");
    const coordinate = new MoveCoordinate(data.rowNo, data.columnNo, value);
    return coordinate;
} 