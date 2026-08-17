import { checkBlackIsNext } from "../components/PlayGround";
import { BoardState } from "./BoardState";
import { BoardTrail } from "./BoardTrail";
import { Search } from "./Evaluate"
import { MoveCoordinate } from "./Evaluate";

export class MinMaxSearch extends Search {
    eval(bstate: BoardState): number {
        // 末端のレベルでは局面の評価値。Randomではlevel==undefined
        console.log("start-evaluation:level=" + bstate.level);
        if (bstate.level == 0) return bstate.eval();
        else {
            // そうでない時はベストの手の時の評価値
            const best = this.bestMove(bstate);
            if (best == null || best.value == undefined) return bstate.eval();
            console.log("eval()-end-best.value:" + best.value);
            return best.value;
        }
    }
    //bestMove(boxes: (string | null)[][], currentMove: number, level: number = this.maxLevel): (MoveCoordinate | null) {
    bestMove(bstate: BoardState): (MoveCoordinate | null) {
        console.log("MinMaxSearch-level" + bstate.level + "-bestMove:start");
        //const bstate = new BoardState(boxes, currentMove, level);
        console.log("boxes:" + bstate.state + " currentMove:" + bstate.currentMove + " blackIsNext:" + checkBlackIsNext(bstate.currentMove));
        const moves = bstate.legalMoves(bstate.state);
        let size: number = 0;
        if (moves == null) return null;
        else size = moves.length;
        // 最良の手が複数あるのでそれを管理する
        console.log("size=moves.length:" + size);
        let bestMoves = new Array<MoveCoordinate>;
        let bestValue;
        for (let i = 0; i < size; i++) {
            console.log("for文の内側開始:" + (i + 1) + "回目" + " bestVal=" + bestValue);
            const move = moves[i];
            // 1手進めてみる
            const trail: BoardTrail = bstate.doMove(move);
            // 評価値を計算
            const moveValue = this.eval(bstate);
            console.log("MinMaxSearch-level=" + bstate.level + " currentMove:" + bstate.currentMove + " moveVal:" + moveValue);
            move.value = moveValue;
            const blackIsThisTurn = checkBlackIsNext(bstate.currentMove - 1);
            if (!blackIsThisTurn) {
                console.log("currentMove" + bstate.currentMove + "whiteIsThisTurn");
                if (bestValue == undefined) {
                    bestValue = Number.NEGATIVE_INFINITY;
                    console.log("bestValueが更新されました")
                }
                // 評価値がこれまでのbestを超えた時
                if (moveValue > bestValue) {
                    bestValue = moveValue;
                    bestMoves = new Array<MoveCoordinate>;
                    bestMoves.push(move);
                }
                // 評価値がこれまでのbestと同じ時
                else if (bestValue == moveValue) {
                    bestMoves.push(move);
                }
            }
            else {
                console.log("currentMove" + bstate.currentMove + "blackIsThisTurn");
                if (bestValue == undefined) {
                    bestValue = Number.POSITIVE_INFINITY;
                    console.log("bestValueが更新されました")
                }
                // 評価値がこれまでのbestを下回った時
                if (moveValue < bestValue) {
                    bestValue = moveValue;
                    bestMoves = new Array<MoveCoordinate>;
                    bestMoves.push(move);
                }
                // 評価値がこれまでのbestと同じ時
                else if (moveValue == bestValue) {
                    bestMoves.push(move);
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

/*

白の塊は正の得点、黒の塊は負の得点をつける  BoardState.eval()
評価が正のときは白が有利、負のときは黒が有利
白視点で最善手を探すときは、
    白の手番のときは評価が最高となる選択肢を選ぶ
    黒の手番のときは評価が最小となる選択肢を選ぶ

*/