import { BoardTrail } from "./BoardTrail";

export class MoveCoordinate {
    private _rowNo: number;
    private _columnNo: number;
    private _value: (number | undefined);

    public constructor(rowNo: number, columnNo: number, value: (number | undefined)) {
        this._rowNo = rowNo;
        this._columnNo = columnNo;
        this._value = value;
    }
    get rowNo(): number {
        return this._rowNo;
    }
    set rowNo(rowNo: number) {
        this._rowNo = rowNo;
    }
    get columnNo(): number {
        return this._columnNo;
    }
    set columnNo(columnNo: number) {
        this._columnNo = columnNo;
    }
    get value(): (number | undefined) {
        return this._value;
    };
    set value(value: number) {
        this._value = value;
    };
}

// 動かした盤面を元に戻せるように記憶
export abstract class TrailStack {
}

// 盤面の状態を表す
export abstract class State {

    private _state: (string | null)[][];
    private _currentMove: number;
    private _level: number;
    //private _blackIsNext: boolean;
    public constructor(boxes: (string | null)[][], currentMove: number, level: number) {
        this._state = boxes;
        this._currentMove = currentMove;
        this._level = level;
        //this._blackIsNext = checkBlackIsNext(this.currentMove);
    }
    get state(): (string | null)[][] {
        return this._state;
    };
    set state(state: (string | null)[][]) {
        this._state = state;
    };
    get currentMove(): (number) {
        return this._currentMove;
    };
    set currentMove(currentMove: number) {
        this._currentMove = currentMove;
    };
    get level(): (number) {
        return this._level;
    };
    set level(level: number) {
        this._level = level;
    };

    // 次の可能手の Moveの配列を返す
    abstract legalMoves(boxes: (string | null)[][]): (Array<MoveCoordinate> | null);
    // 手にしたがって盤面を変化させる．
    // TrailStackを返す
    abstract doMove(move: MoveCoordinate, boxes: string[][]): BoardTrail;
    // TrailStackに従って盤面を戻す
    abstract undoMove(trail: TrailStack): void;
    // 盤面の評価値
    abstract eval(): number;
}

// 次の手を決めるアルゴリズム
export abstract class Search {
    // 次の手を返す
    abstract bestMove(boxes: (string | null)[][], currentMove: number, level?: number, alpha?: number, beta?: number): (MoveCoordinate | null);
}