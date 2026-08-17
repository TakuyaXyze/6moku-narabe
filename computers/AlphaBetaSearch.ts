import { checkBlackIsNext } from "../components/PlayGround";
import { BoardState } from "./BoardState";
import { BoardTrail } from "./BoardTrail";
import { Search } from "./Evaluate"
import { MoveCoordinate } from "./Evaluate";

export class AlphaBetaSearch extends Search {
    eval(bstate: BoardState, alpha: number, beta: number): (number | null) {
        // 末端のレベルでは局面の評価値。Randomではlevel==undefined
        console.log("start-evaluation:level=" + bstate.level);
        if (bstate.level == 0) return bstate.eval();
        else {
            // そうでない時はベストの手の時の評価値
            //const best = this.bestMove(boxes, currentMove, level, alpha, beta);
            const best = this.bestMove(bstate, alpha, beta);
            if (best == null) return null;
            if (best.value == undefined) return bstate.eval();
            console.log("eval()-end-best.value:" + best.value);
            return best.value;
        }
    }
    //bestMove(boxes: (string | null)[][], currentMove: number, level: number = this.maxLevel, alpha?: number, beta?: number): (MoveCoordinate | null) {
    bestMove(bstate: BoardState, alpha?: number, beta?: number): (MoveCoordinate | null) {
        console.log("AlphaBetaSearch-level" + bstate.level + "-bestMove:start");

        let _alpha: number;
        if (alpha == undefined) _alpha = Number.POSITIVE_INFINITY;
        else _alpha = alpha;
        console.log("alphaが" + _alpha + "に更新されました");
        let _beta: number;
        if (beta == undefined) _beta = Number.NEGATIVE_INFINITY;
        else _beta = beta;
        console.log("betaが" + _beta + "に更新されました");
        //const bstate = new BoardState(boxes, currentMove, level);

        console.log("currentMove:" + bstate.currentMove + " blackIsNext:" + checkBlackIsNext(bstate.currentMove));
        const moves = bstate.legalMoves(bstate.state);
        let size: number = 0;
        if (moves == null) return null;
        else size = moves.length;
        console.log("size=moves.length:" + size);

        // 最良の手が複数あるのでそれを管理する
        let bestMoves = new Array<MoveCoordinate>;
        let bestValue: (number | undefined);
        for (let i = 0; i < size; i++) {
            console.log("for文の内側開始-level" + bstate.level + ":" + (i + 1) + "回目");
            const move = moves[i];
            // 1手進めてみる
            const trail: BoardTrail = bstate.doMove(move);
            // 評価値を計算
            const moveValue = this.eval(bstate, _alpha, _beta);
            console.log("AlphaBetaSearch-level=" + bstate.level + " currentMove:" + bstate.currentMove + " moveVal:" + moveValue);
            if (moveValue == null) {
                console.log("currentMove:" + bstate.currentMove + " level=" + bstate.level + " " + (i + 1) + "回目 continue;")
                continue;
            }
            move.value = moveValue;
            const blackIsThisTurn = checkBlackIsNext(bstate.currentMove - 1);
            const blackIsPreviousTurn = checkBlackIsNext(bstate.currentMove - 2);
            if (!blackIsThisTurn) { //whiteIsThisTurn
                console.log("currentMove=" + bstate.currentMove + " whiteIsThisTurn");
                if (bestValue == undefined) {
                    bestValue = Number.NEGATIVE_INFINITY;
                    console.log("bestValueが" + bestValue + "に更新されました")
                }
                if (moveValue > bestValue) {
                    bestValue = moveValue;
                    _beta = bestValue;
                    if (blackIsPreviousTurn && bestValue > _alpha) {
                        console.log("\n\n\n\n\n\nαカット\n\n\n\n\n\n");
                        // 戻す
                        bstate.undoMove(trail);
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
            else { //blackIsThisTurn
                console.log("currentMove=" + bstate.currentMove + " blackIsThisTurn");
                if (bestValue == undefined) {
                    bestValue = Number.POSITIVE_INFINITY;
                    console.log("bestValueが" + bestValue + "に更新されました")
                }
                if (moveValue < bestValue) {
                    bestValue = moveValue;
                    _alpha = bestValue;
                    if (!blackIsPreviousTurn && bestValue < _beta) {
                        console.log("\n\n\n\n\n\nβカット\n\n\n\n\n\n");
                        // 戻す
                        bstate.undoMove(trail);
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
            // 戻す
            bstate.undoMove(trail);
            console.log("for文の内側終了-bestValue:" + bestValue);
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

自分=コンピュータ・後手・白
相手=プレイヤー・先手・黒

αカット: 得点の下限が定まっているときの枝刈り
現在が自分の手番で、
直前が相手の手番のときに、
自分の手番を打った直後の評価値がそのときのα値を超えていたときに発動
→黒→白

α値: 相手が最善手を打った直後の評価値
相手の手番を打った直後の評価値の最小値

βカット: 得点の上限が定まっているときの枝刈り
現在が相手の手番で、
直前が自分の手番のときに、
相手の手番を打った直後の評価値がそのときのβ値を下回っていたときに発動
→白→黒

β値: 自分が最善手を打った直後の評価値
自分の手番を打った直後の評価値の最大値

*/

/*

01 黒

02 白 
03 黒
04 黒

05 白
06 白
07 黒

08 黒

09 白
10 白
11 黒

12 黒

13 白
14 白
15 黒

*/