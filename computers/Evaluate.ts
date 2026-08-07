import { BoardTrail } from "./BoardTrail";
import { MoveCoordinate } from "./MoveCoordinate";

// 手とその評価値を表す抽象クラス
export abstract class Move {
    // 評価値は doubleで表す
    private _value?: number;
    //private _rowNo: number;
    //private _columnNo: number;

    //public constructor(value: number, rowNo: number, columnNo: number) {
    public constructor(value: number | null) {
        if (typeof value === "number") {
            this._value = value;
        }
        //this._rowNo = rowNo;
        //this._columnNo = columnNo;
    }
    get value(): number {
        return this.value;
    };
    set value(value: number) {
        this._value = value;
    };/*
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
    }*/
}

// 動かした盤面を元に戻せるように記憶
export abstract class TrailStack {
}

// 盤面の状態を表す
export abstract class State {

    public state: (string | null)[][];
    public blackIsNext: boolean;
    public currentMove: number;
    public constructor(boxes: (string | null)[][], blackIsNext: boolean, currentMove: number) {
        this.state = boxes;
        this.blackIsNext = blackIsNext;
        this.currentMove = currentMove;
    }
    // 次の可能手の Moveの配列を返す
    abstract legalMoves(boxes: (string | null)[][]): (Array<MoveCoordinate> | null);
    // 手にしたがって盤面を変化させる．
    // TrailStackを返す
    abstract doMove(move: Move, boxes: string[][]): BoardTrail;
    // TrailStackに従って盤面を戻す
    abstract undoMove(trail: TrailStack): void;
    // 盤面の評価値
    abstract eval(): number;
}

// 次の手を決めるアルゴリズム
export abstract class Search {
    // 次の手を返す
    //abstract bestMove(this: Search, state: State, level?: number): (Move | null);
    abstract bestMove(boxes: (string | null)[][], blackIsNext: boolean, currentMove: number, level?: number): (MoveCoordinate | null);
}