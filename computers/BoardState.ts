import { BoardTrail } from "./BoardTrail";
import { State } from "./Evaluate"
import { MoveCoordinate } from "./Evaluate";
import { ROWS, COLUMNS, checkBlackIsNext, SEQUENCE_LENGTH } from "../components/PlayGround"
import { detectSequence } from "./CountSequence";

export class BoardState extends State {

    public constructor(boxes: (string | null)[][], currentMove: number, level: number) {
        super(boxes, currentMove, level)
    }
    legalMoves(boxes: (string | null)[][]): (Array<MoveCoordinate> | null) {
        const ret = new Array<MoveCoordinate>;
        const value = undefined;
        for (let rowNo = 0; rowNo < ROWS; rowNo++) {
            for (let columnNo = 0; columnNo < COLUMNS; columnNo++) {
                if (!boxes[rowNo][columnNo])
                    ret.push(new MoveCoordinate(rowNo, columnNo, value));
            }
        }
        return ret;
    }
    doMove(move: MoveCoordinate): BoardTrail {
        const rowNo = move.rowNo;
        const columnNo = move.columnNo;
        const trail = new BoardTrail(rowNo, columnNo);
        const blackIsNext = checkBlackIsNext(this.currentMove);
        //console.log("this.currentMove" + this.currentMove + " this.blackIsNext-before-this.currentMove++;" + this.blackIsNext);
        this.currentMove++;
        this.level--;
        //console.log("this.currentMove" + this.currentMove + " this.blackIsNext-after-this.currentMove++;" + this.blackIsNext);
        //if (this.blackIsNext) {
        if (blackIsNext) {
            this.state[rowNo][columnNo] = "b"
        } else {
            this.state[rowNo][columnNo] = "w"
        }
        return trail;
    }
    undoMove(boardStack: BoardTrail): void {
        const trail: BoardTrail = boardStack;
        this.state[trail._rowNo][trail._columnNo] = null;
        this.currentMove--;
        this.level++;
    }
    eval(): number {
        let sum = 0;
        const black = "b";
        const white = "w";
        const six = Math.min(SEQUENCE_LENGTH, 6);
        const five = Math.min(SEQUENCE_LENGTH, 5);
        const four = Math.min(SEQUENCE_LENGTH, 4);
        const three = Math.min(SEQUENCE_LENGTH, 3);
        const two = Math.min(SEQUENCE_LENGTH, 2);
        const whiteCount = detectSequence(this.state, white);
        const blackCount = detectSequence(this.state, black);
        sum += 100 * whiteCount[six - 2];
        sum += 20 * whiteCount[five - 2];
        sum += 10 * whiteCount[four - 2];
        sum += 5 * whiteCount[three - 2];
        sum += 1 * whiteCount[two - 2];
        sum -= 100 * blackCount[six - 2];
        sum -= 20 * blackCount[five - 2];
        sum -= 10 * blackCount[four - 2];
        sum -= 5 * blackCount[three - 2];
        sum -= 1 * blackCount[two - 2];
        return sum;
    }
}