import { BoardTrail } from "./BoardTrail";
import { State } from "./Evaluate"
import { MoveCoordinate } from "./Evaluate";
import { ROWS, COLUMNS, checkBlackIsNext, SEQUENCE_LENGTH } from "./GameRule"
import { detectSequence } from "./CountSequence";

const HOSHI_ROWS: number[] = [3, 9, 15];
const HOSHI_COLUMNS: number[] = [3, 9, 15];

export class BoardState extends State {

    private _sight: number;
    private _defense: number;
    private _computerIsBlack: boolean;

    public constructor(boxes: (string | null)[][], currentMove: number, level: number,
        sight: number = SEQUENCE_LENGTH - 2, defense: number = 1, computerIsBlack: boolean = true) {
        super(boxes, currentMove, level)
        this._sight = sight;
        this._defense = defense;
        this._computerIsBlack = computerIsBlack;
    }
    get defense(): number {
        return this._defense;
    }
    set defense(defense: number) {
        this._defense = defense;
    }
    legalMoves(boxes: (string | null)[][]): (Array<MoveCoordinate> | null) {
        const ret = new Array<MoveCoordinate>;
        const value = undefined;
        if (this.currentMove === 0) {
            for (const rowNo of HOSHI_ROWS) {
                for (const columnNo of HOSHI_COLUMNS) {
                    ret.push(new MoveCoordinate(rowNo, columnNo, value));
                }
            }
            return ret;
        }
        for (let rowNo = 0; rowNo < ROWS; rowNo++) {
            for (let columnNo = 0; columnNo < COLUMNS; columnNo++) {
                for (let k = 1; k <= this._sight; k++) {
                    if (!boxes[rowNo][columnNo]
                        && ((boxes[rowNo - k] && boxes[rowNo - k][columnNo])
                            || (boxes[rowNo + k] && boxes[rowNo + k][columnNo])
                            || (boxes[rowNo] && boxes[rowNo][columnNo - k])
                            || (boxes[rowNo] && boxes[rowNo][columnNo + k])
                            || (boxes[rowNo - k] && boxes[rowNo - k][columnNo - k])
                            || (boxes[rowNo - k] && boxes[rowNo - k][columnNo + k])
                            || (boxes[rowNo + k] && boxes[rowNo + k][columnNo - k])
                            || (boxes[rowNo + k] && boxes[rowNo + k][columnNo + k])
                        )
                    ) {
                        ret.push(new MoveCoordinate(rowNo, columnNo, value));
                        break;
                    }
                }
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
        const whiteWeight = this._computerIsBlack ? this._defense : 1;
        const blackWeight = this._computerIsBlack ? 1 : this._defense;
        sum += whiteWeight * 100 * whiteCount[six - 2];
        sum += whiteWeight * 20 * whiteCount[five - 2];
        sum += whiteWeight * 13 * whiteCount[four - 2];
        sum += whiteWeight * 3 * whiteCount[three - 2];
        sum += whiteWeight * 1 * whiteCount[two - 2];
        sum -= blackWeight * 100 * blackCount[six - 2];
        sum -= blackWeight * 20 * blackCount[five - 2];
        sum -= blackWeight * 13 * blackCount[four - 2];
        sum -= blackWeight * 3 * blackCount[three - 2];
        sum -= blackWeight * 1 * blackCount[two - 2];
        return sum;
    }
}