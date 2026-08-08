import { checkBlackIsNext } from "@/components/PlayGround";
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
    eval(boxes: (string | null)[][], currentMove: number, bstate: BoardState, level: number, alpha: number, beta: number): number {
        // 末端のレベルでは局面の評価値。Randomではlevel==undefined
        console.log("start-evaluation");
        if (level == 0) return bstate.eval();
        else {
            // そうでない時はベストの手の時の評価値
            const best = this.bestMove(boxes, currentMove, level, alpha, beta);
            if (best == null) return bstate.eval();
            console.log("end-evaluation");
            return best.value;
        }
    }
    bestMove(boxes: (string | null)[][], currentMove: number, level: number = this.maxLevel, alpha: number, beta: number): (MoveCoordinate | null) {
        // 可能な手を全部生成する
        console.log("AlphaBetaSearch-level" + level + "-bestMove:start");
        const bstate = new BoardState(boxes, currentMove);
        console.log("boxes:" + bstate.state + " curentMove:" + currentMove);
        const moves = bstate.legalMoves(boxes);
        let size: number = 0;
        if (moves == undefined) return null;
        else size = moves.length;
        console.log("size=moves.length:" + size);
        // 最良の手が複数あるのでそれを管理する
        let bestMoves = new Array<MoveCoordinate>;
        // 最良の手の値を負の無限大に設定しておく
        let bestVal = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < size; i++) {
            console.log("for文の内側開始:" + (i + 1) + "回目");
            const move = moves[i];
            // 1手進めてみる
            const trail: BoardTrail = bstate.doMove(move);
            // 評価値を計算
            // 1手進んだ時(相手の番)の評価値なので符号を入れ替える．
            let moveVal: number;
            let blackIsNext = checkBlackIsNext(currentMove);
            if (!blackIsNext) moveVal = this.eval(boxes, currentMove + 1, bstate, level - 1, alpha, beta);
            else moveVal = -this.eval(boxes, currentMove + 1, bstate, level - 1, -alpha, -beta);
            // 戻す
            bstate.undoMove(trail);
            move.value = moveVal;
            console.log("AlphaBetaSearch-level" + level + "-moveVal:" + moveVal);
            // 評価値がこれまでのbestを超えた時
            if (bestVal < moveVal) {
                if (moveVal > beta) {
                    console.log("!\n\n\n\n\n!!枝切り!!\n\n\n\n\n !");
                    return move; //枝切り
                }
                bestVal = moveVal;
                if (bestVal > alpha) {
                    alpha = bestVal;
                }
                bestMoves = new Array<MoveCoordinate>;
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
        console.log("bestSize:" + bestSize);
        if (bestSize > 0) {
            const selected = Math.floor(Math.random() * bestSize);
            console.log("bestMove終了");
            return bestMoves[selected];
        }
        else return null;
    }
}