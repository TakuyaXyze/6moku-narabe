import { BoardTrail } from "./BoardTrail";
import { Move, State, TrailStack } from "./Evaluate"
import { MoveCoordinate } from "./MoveCoordinate";
//import { ROWS, COLUMNS, checkBlackIsNext, calculate6, calculate5, calculate4, calculate3, calculate2 } from "../components/PlayGround"
import { ROWS, COLUMNS, checkBlackIsNext, detectSequence, SEQUENCE_LENGTH } from "../components/PlayGround"

export class BoardState extends State {

    public constructor(boxes: (string | null)[][], currentMove: number) {
        super(boxes, currentMove)
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
        const blackIsNext = checkBlackIsNext(this.currentMove);
        if (blackIsNext) {
            this.state[rowNo][columnNo] = "b"
        } else {
            this.state[rowNo][columnNo] = "w"
        }
        this.currentMove++;
        return trail;
    }
    undoMove(boardStack: BoardTrail): void {
        const trail: BoardTrail = boardStack;
        this.state[trail._rowNo][trail._columnNo] = null;
        this.currentMove--;
    }
    eval(): number {
        let sum = 0;
        const six = Math.max(SEQUENCE_LENGTH, 6);
        const five = Math.max(SEQUENCE_LENGTH, 5);
        const four = Math.max(SEQUENCE_LENGTH, 4);
        const three = Math.max(SEQUENCE_LENGTH, 3);
        const two = Math.max(SEQUENCE_LENGTH, 2);
        if (typeof detectSequence(this.state, six) === "string") sum += 100;
        if (typeof detectSequence(this.state, five) === "string") sum += 15;
        if (typeof detectSequence(this.state, four) === "string") sum += 10;
        if (typeof detectSequence(this.state, three) === "string") sum += 5;
        if (typeof detectSequence(this.state, two) === "string") sum += 1;
        return sum;
    }
}