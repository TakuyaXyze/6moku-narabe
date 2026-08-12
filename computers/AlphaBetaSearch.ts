import { checkBlackIsNext } from "../components/PlayGround";
import { BoardState } from "./BoardState";
import { BoardTrail } from "./BoardTrail";
import { Search } from "./Evaluate"
import { MoveCoordinate } from "./Evaluate";

export class AlphaBetaSearch extends Search {
    // どの深さまで読むか?
    private maxLevel: number;
    // インスタンス生成時にレベルを設定
    constructor(maxLevel: number) {
        super()
        this.maxLevel = maxLevel;
    }
    eval(boxes: (string | null)[][], currentMove: number, bstate: BoardState, level: number): number {
        // 末端のレベルでは局面の評価値。Randomではlevel==undefined
        console.log("start-evaluation:level=" + level);
        if (level == 0) return bstate.eval();
        else {
            // そうでない時はベストの手の時の評価値
            const best = this.bestMove(boxes, currentMove, level);
            if (best == null || best.value == undefined) return bstate.eval();
            console.log("eval()-end-best.value:" + best.value);
            return best.value;
        }
    }
    bestMove(boxes: (string | null)[][], currentMove: number, level: number = this.maxLevel, alpha?: number, beta?: number): (MoveCoordinate | null) {
        console.log("AlphaBetaSearch-level" + level + "-bestMove:start");
        const bstate = new BoardState(boxes, currentMove, level);
        console.log("boxes:" + bstate.state + " currentMove:" + bstate.currentMove + " blackIsNext:" + checkBlackIsNext(bstate.currentMove));
        const moves = bstate.legalMoves(bstate.state);
        let size: number = 0;
        if (moves == null) return null;
        else size = moves.length;
        console.log("size=moves.length:" + size);
        // 最良の手が複数あるのでそれを管理する
        let bestMoves = new Array<MoveCoordinate>;
        let bestValue;
        for (let i = 0; i < size; i++) {
            console.log("for文の内側開始-level" + bstate.level + ":" + (i + 1) + "回目");
            if (alpha == undefined) {
                alpha = Number.POSITIVE_INFINITY;
            }
            if (beta == undefined) {
                beta = Number.NEGATIVE_INFINITY;
            }
            const move = moves[i];
            // 1手進めてみる
            const trail: BoardTrail = bstate.doMove(move);
            // 評価値を計算
            const moveValue = this.eval(bstate.state, bstate.currentMove, bstate, bstate.level);
            console.log("AlphaBetaSearch-level=" + bstate.level + " currentMove:" + bstate.currentMove + " moveVal:" + moveValue);
            move.value = moveValue;
            const blackIsThisTurn = checkBlackIsNext(bstate.currentMove - 1);
            const blackIsPreviousTurn = checkBlackIsNext(bstate.currentMove - 2);
            if (!blackIsThisTurn) {
                console.log("currentMove=" + bstate.currentMove + " whiteIsThisTurn");
                if (bestValue == undefined) {
                    bestValue = Number.NEGATIVE_INFINITY;
                    console.log("bestValueが" + bestValue + "に更新されました")
                }
                if (!blackIsPreviousTurn) {
                    if (moveValue > bestValue) {
                        bestValue = moveValue;
                        bestMoves = new Array<MoveCoordinate>;
                        bestMoves.push(move);
                    }
                    // 評価値がこれまでのbestと同じ時
                    else if (moveValue == bestValue) {
                        bestMoves.push(move);
                    }
                }
                else {
                    if (moveValue > bestValue) {
                        bestValue = moveValue;
                        if (bestValue > alpha) {
                            console.log("αカット");
                            return move;
                        }
                        bestMoves = new Array<MoveCoordinate>;
                        bestMoves.push(move);
                    }
                    // 評価値がこれまでのbestと同じ時
                    else if (moveValue == bestValue) {
                        bestMoves.push(move);
                    }
                }
            }
            else {
                console.log("currentMove=" + bstate.currentMove + " blackIsThisTurn");
                if (bestValue == undefined) {
                    bestValue = Number.POSITIVE_INFINITY;
                    console.log("bestValueが" + bestValue + "に更新されました")
                }
                if (blackIsPreviousTurn) {
                    if (moveValue < bestValue) {
                        bestValue = moveValue;
                        bestMoves = new Array<MoveCoordinate>;
                        bestMoves.push(move);
                    }
                    // 評価値がこれまでのbestと同じ時
                    else if (moveValue == bestValue) {
                        bestMoves.push(move);
                    }
                } else {
                    if (moveValue < bestValue) {
                        bestValue = moveValue;
                        if (bestValue < beta) {
                            console.log("βカット");
                            return move;
                        }
                        bestMoves = new Array<MoveCoordinate>;
                        bestMoves.push(move);
                    }
                    // 評価値がこれまでのbestと同じ時
                    else if (moveValue == bestValue) {
                        bestMoves.push(move);
                    }
                }
            }
            // 戻す
            bstate.undoMove(trail);
            console.log("bestValue:" + bestValue);
            console.log("for文の内側終了");
        }
        // bestの中から乱数で選択
        const bestSize = bestMoves.length;
        console.log("bestSize:" + bestSize);
        if (bestValue == undefined) throw new Error("bestValが" + (typeof bestValue) + "です");
        if (bestSize > 0) {
            const selected = Math.floor(Math.random() * bestSize);
            console.log("bestMove-end currentMove:" + bstate.currentMove + " value=bestValue:" + bestValue);
            bestMoves[selected].value = bestValue;
            return bestMoves[selected];
        }
        else return null;
    }
}