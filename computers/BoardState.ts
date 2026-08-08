import { BoardTrail } from "./BoardTrail";
import { Move, State, TrailStack } from "./Evaluate"
import { MoveCoordinate } from "./MoveCoordinate";
//import { ROWS, COLUMNS, checkBlackIsNext, calculate6, calculate5, calculate4, calculate3, calculate2 } from "../components/PlayGround"
import { ROWS, COLUMNS, checkBlackIsNext, detectSequence } from "../components/PlayGround"

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
        if (typeof detectSequence(this.state, 6) === "string") sum += 100;
        if (typeof detectSequence(this.state, 5) === "string") sum += 15;
        if (typeof detectSequence(this.state, 4) === "string") sum += 10;
        if (typeof detectSequence(this.state, 3) === "string") sum += 5;
        if (typeof detectSequence(this.state, 2) === "string") sum += 1;
        return sum;
    }
}