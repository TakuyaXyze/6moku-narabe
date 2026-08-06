import { Move } from "./Evaluate"

export class MoveCoordinate extends Move {
    //const position: number[][] = ; //引用元には int position; があったので一応メモ
    private _rowNo?: number;
    private _columnNo?: number;
    public constructor(rowNo: number, columnNo: number, value: number = 0.0) {
        super(value)
        this._rowNo = rowNo;
        this._columnNo = columnNo
    }
    get rowNo(): number {
        return this.rowNo;
    }
    set rowNo(rowNo: number) {
        this._rowNo = rowNo;
    }
    get columnNo(): number {
        return this.columnNo;
    }
    set columnNo(columnNo: number) {
        this._columnNo = columnNo;
    }
}