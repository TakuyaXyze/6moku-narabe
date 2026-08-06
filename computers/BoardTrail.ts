import { TrailStack } from "./Evaluate";

export class BoardTrail extends TrailStack {
    public _rowNo: number;
    public _columnNo: number;
    public boxTrail = new Array();
    public constructor(rowNo: number, columnNo: number) {
        super()
        this._rowNo = rowNo;
        this._columnNo = columnNo;
    }
    add(rowNo: number, columnNo: number) {
        this.boxTrail.push(rowNo, columnNo);
    }
    get rowNo() {
        return this._rowNo;
    };
    set rowNo(rowNo) {
        this._rowNo = rowNo;
    }
    get columnNo() {
        return this._columnNo;
    }
    set columnNo(columnNo) {
        this._columnNo = columnNo;
    }
    get size() {
        return this.boxTrail.length;
    }
    get(index: number) {
        return this.boxTrail[index];
    }
}