import { BoardState } from "./BoardState";
import { BoardTrail } from "./BoardTrail";
import { Move, Search, State, TrailStack } from "./Evaluate"
import { MoveCoordinate } from "./MoveCoordinate";

export class AlphaBetaSearch extends Search {
    // どの深さまで読むか?
    private maxLevel: number;
    // インスタンス生成時にレベルを設定
    constructor(maxLevel: number) {
        super()
        this.maxLevel = maxLevel;
    }
    eval(boxes: (string | null)[][], blackIsNext: boolean, currentMove: number, bstate: BoardState, level: number, alpha: number, beta: number): number {
        // 末端のレベルでは局面の評価値。Randomではlevel==undefined
        if (level == 0) return bstate.eval();
        else {
            // そうでない時はベストの手の時の評価値
            const best = this.bestMove(boxes, blackIsNext, currentMove, level, alpha, beta);
            if (best == null) return bstate.eval();
            return best.value;
        }
    }
    bestMove(boxes: (string | null)[][], blackIsNext: boolean, currentMove: number, level: number = this.maxLevel, alpha: number, beta: number): (MoveCoordinate | null) {
        // 可能な手を全部生成する
        const bstate = new BoardState(boxes, blackIsNext, currentMove);
        const moves = bstate.legalMoves(boxes);
        let size: number = 0;
        if (moves == undefined) return null;
        else size = moves.length;
        // 最良の手が複数あるのでそれを管理する
        let bestMoves = new Array;
        //const best: Move = null; //引用元では未使用で宣言されていた謎変数。しかも=nullはエラーになる。
        // 最良の手の値を負の無限大に設定しておく
        let bestVal = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < size; i++) {
            const move = moves[i];
            // 1手進めてみる
            const trail: BoardTrail = bstate.doMove(move);
            // 評価値を計算
            /*// 1手進んだ時(相手の番)の評価値なので符号を入れ替える．
            const moveVal: number = -this.eval(state, level - 1);*/
            let moveVal: number;
            if (!blackIsNext) moveVal = this.eval(boxes, blackIsNext, currentMove, bstate, level - 1, alpha, beta);
            else moveVal = -this.eval(boxes, blackIsNext, currentMove, bstate, level - 1, -alpha, -beta);
            // 戻す
            bstate.undoMove(trail);
            move.value = moveVal;
            console.log("AlphaBetaSearch-level" + level + "-moveVal:" + moveVal);
            // 評価値がこれまでのbestを超えた時
            if (bestVal < moveVal) {
                if (moveVal > beta) {
                    return move; //枝切り
                }
                bestVal = moveVal;
                if (bestVal > alpha) {
                    alpha = bestVal;
                }
                bestMoves = new Array;
                bestMoves.push(move);
            }
            // 評価値がこれまでのbestと同じ時
            else if (bestVal == moveVal) {
                bestMoves.push(move);
            }
        }
        // bestの中から乱数で選択
        const bestSize = bestMoves.length;
        if (bestSize > 0) {
            const selected = Math.floor(Math.random() * bestSize);
            return bestMoves[selected];
        }
        else return null;
    }
}