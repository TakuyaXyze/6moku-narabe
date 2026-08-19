import { ROWS, COLUMNS } from "@/components/PlayGround";
import { MoveCoordinate } from "./Evaluate";
import { BoardState } from "./BoardState";

export function computerTurnRandom(boxes: (string | null)[][], currentMove: number) {
    console.log("computerTurnRandom");
    //setComputingTime(Date.now() - computingStartTime);
    const bstate = new BoardState(boxes, currentMove, 0); //探索しないのでdepth=0
    const value = undefined;
    const moves = bstate.legalMoves(bstate.state);
    if (moves == null) throw new Error("bstate.legalMoves()がnull");
    const size = moves.length;
    const i = Math.floor(Math.random() * size);
    const randomMove = moves[i];
    const coordinate = new MoveCoordinate(randomMove.rowNo, randomMove.columnNo, value);
    return coordinate;
}