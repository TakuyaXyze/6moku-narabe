import { BoardState } from "./BoardState";
import { BoardTrail } from "./BoardTrail";
import { Move, Search, State, TrailStack } from "./Evaluate"
import { MoveCoordinate } from "./MoveCoordinate";
import { checkBlackIsNext } from "../components/PlayGround";

export class MinMaxSearch extends Search {
    // どの深さまで読むか?
    private maxLevel: number;
    // インスタンス生成時にレベルを設定
    constructor(maxLevel: number) {
        super()
        this.maxLevel = maxLevel;
    }
    eval(boxes: (string | null)[][], currentMove: number, bstate: BoardState, level: number): number {
        // 末端のレベルでは局面の評価値。Randomではlevel==undefined
        console.log("start-evaluation");
        if (level == 0) return bstate.eval();
        else {
            // そうでない時はベストの手の時の評価値
            const best = this.bestMove(boxes, currentMove, level);
            console.log("end-evaluation");
            if (best == null) return bstate.eval();
            return best.value;
        }
    }
    bestMove(boxes: (string | null)[][], currentMove: number, level: number = this.maxLevel): (MoveCoordinate | null) {
        // 可能な手を全部生成する
        console.log("MinMaxSearch-level" + level + "-bestMove:start");
        const bstate = new BoardState(boxes, currentMove);
        console.log("boxes:" + bstate.state + " curentMove:" + currentMove);
        const moves = bstate.legalMoves(boxes);
        let size: number = 0;
        if (moves == undefined) return null;
        else size = moves.length;
        // 最良の手が複数あるのでそれを管理する
        console.log("size=moves.length:" + size);
        let bestMoves = new Array<MoveCoordinate>;
        //const best: Move = null; //引用元では未使用で宣言されていた謎変数。しかも=nullはエラーになる。
        // 最良の手の値を負の無限大に設定しておく
        let bestVal = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < size; i++) {
            console.log("for文の内側開始:" + (i + 1) + "回目");
            const move = moves[i];
            // 1手進めてみる
            const trail: BoardTrail = bstate.doMove(move);
            // 評価値を計算
            /*// 1手進んだ時(相手の番)の評価値なので符号を入れ替える．
            const moveVal: number = -this.eval(state, level - 1);*/
            let moveVal: number;
            let blackIsNext = checkBlackIsNext(currentMove);
            if (!blackIsNext) moveVal = this.eval(boxes, currentMove, bstate, level - 1);
            else moveVal = -this.eval(boxes, currentMove, bstate, level - 1);
            // 戻す
            bstate.undoMove(trail);
            move.value = moveVal;
            console.log("MinMaxSearch-level" + level + "-moveVal:" + moveVal);
            // 評価値がこれまでのbestを超えた時
            if (bestVal < moveVal) {
                bestVal = moveVal;
                bestMoves = new Array;
                bestMoves.push(move);
            }
            // 評価値がこれまでのbestと同じ時
            else if (bestVal == moveVal) {
                bestMoves.push(move);
            }
            console.log("bestMoves:" + bestMoves);
            console.log("for文の内側終了");
        }
        // bestの中から乱数で選択
        const bestSize = bestMoves.length;
        if (bestSize > 0) {
            const selected = Math.floor(Math.random() * bestSize);
            console.log("bestMove終了");
            return bestMoves[selected];
        }
        else return null;
    }
}