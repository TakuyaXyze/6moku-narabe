// Depth1Search
// 可能手を全部生成して,その盤面の評価値で最良のものを選択する
//
import { BoardState } from "./BoardState";
import { Move, State, Search, TrailStack } from "./Evaluate"
import { MoveCoordinate } from "./MoveCoordinate";
import { checkBlackIsNext } from "../components/PlayGround";

export class Depth1Search extends Search {
    bestMove(boxes: (string | null)[][], currentMove: number): (MoveCoordinate | null) {
        const bstate = new BoardState(boxes, currentMove, 1);//depth=1
        // 可能な手を全部生成する
        const moves = bstate.legalMoves(boxes);
        let size: number = 0;
        if (moves == null) return null;
        else size = moves.length;
        // 最良の手が複数あるのでそれを管理する
        let bestMoves = new Array;
        //const best: Move = null; //nullだとダメ。なんで引用元はnullを当てているんだ? そもそも宣言だけして使っていないし...
        // 最良の手の値を負の無限大に設定しておく
        let bestVal: number = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < size; i++) {
            const move = moves[i];
            // 1手進めてみる
            //trailに保存
            const trail = bstate.doMove(move);
            // 評価値を計算
            /*// 1手進んだ時(相手の番)の評価値なので符号を入れ替える.ここ、2手ずつのときは要修正。
            const moveVal: number = -bstate.eval();
            move.value = moveVal;*/
            let moveVal: number;
            let blackIsNext = checkBlackIsNext(currentMove);
            if (!blackIsNext) moveVal = bstate.eval();
            else moveVal = -bstate.eval();
            //trailから戻す
            bstate.undoMove(trail);
            console.log("Depth1Search-moveVal:" + moveVal);
            // 評価値がこれまでのbestを超えた時
            if (bestVal < moveVal) {
                bestVal = moveVal;
                bestMoves = new Array;//bestが更新されたので、それまでのbestを削除するために新規でnew
                bestMoves.push(move);
            }
            // 評価値がこれまでのbestと同じ時
            else if (bestVal == moveVal) {
                bestMoves.push(move);
            }
        }
        //console.log("Depth1Search-bestMoves" + bestMoves);
        // bestの中から乱数で選択
        const bestSize: number = bestMoves.length;
        const selected: number = Math.floor(Math.random() * bestSize);
        return bestMoves[selected];
    }
}