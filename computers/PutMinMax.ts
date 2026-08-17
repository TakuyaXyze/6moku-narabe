import { MinMaxSearch } from "./MinMaxSearch";
import { MoveCoordinate } from "./Evaluate";
import { BoardState } from "./BoardState";

export function computerTurnMinMaxSearch(boxes: (string | null)[][], currentMove: number, depth: number) {
    console.log("computerTurnMinMaxSearch-start");
    //setComputingTime(Date.now() - computingStartTime);
    const value = undefined;
    const move = new MinMaxSearch();
    //const data = move.bestMove(boxes, currentMove, depth);
    const bstate = new BoardState(boxes, currentMove, depth);
    const data = move.bestMove(bstate);
    console.log("computerTurnMinMaxSearch-finish");
    if (data === null) throw new Error("MinMaxSearchのbestMoveからの戻り値がnull");
    const coordinate = new MoveCoordinate(data.rowNo, data.columnNo, value);
    return coordinate;
} 