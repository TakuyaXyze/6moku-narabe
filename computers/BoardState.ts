import { BoardTrail } from "./BoardTrail";
import { Move, State, TrailStack } from "./Evaluate"
import { MoveCoordinate } from "./MoveCoordinate";
import { ROWS, COLUMNS, checkBlackIsNext } from "../components/PlayGround"

export class BoardState extends State {

    public constructor(boxes: (string | null)[][], blackIsNext: boolean, currentMove: number) {
        super(boxes, blackIsNext, currentMove)
    }
    legalMoves(boxes: (string | null)[][]): (Array<MoveCoordinate> | null) {
        const ret = new Array<MoveCoordinate>;
        for (let rowNo = 0; rowNo < ROWS; rowNo++) {
            for (let columnNo = 0; columnNo < COLUMNS; columnNo++) {
                if (!boxes[rowNo][columnNo])
                    ret.push(new MoveCoordinate(rowNo, columnNo));
            }
        }
        return ret;
    }
    doMove(move: MoveCoordinate): BoardTrail {
        const rowNo = move.rowNo;
        const columnNo = move.columnNo;
        const trail = new BoardTrail(rowNo, columnNo);
        if (this.blackIsNext) {
            this.state[rowNo][columnNo] = "b"
        } else {
            this.state[rowNo][columnNo] = "w"
        }
        this.blackIsNext = checkBlackIsNext(this.currentMove);
        this.currentMove++;
        return trail;
    }
    undoMove(boardStack: BoardTrail): void {
        const trail: BoardTrail = boardStack;
        this.state[trail._rowNo][trail._columnNo] = null;
        this.currentMove--;
        this.blackIsNext = checkBlackIsNext(this.currentMove);
    }
    eval(): number {
        let sum = 0;
        return sum;
    }
}