import { checkBlackIsNext } from "../components/PlayGround";
import { BoardState } from "./BoardState";
import { BoardTrail } from "./BoardTrail";
import { Search } from "./Evaluate"
import { MoveCoordinate } from "./Evaluate";

export class Depth1Search extends Search {
    //bestMove(boxes: (string | null)[][], currentMove: number): (MoveCoordinate | null) {
    bestMove(bstate: BoardState): (MoveCoordinate | null) {
        console.log("Depth1Search-bestMove:start");
        //const bstate = new BoardState(boxes, currentMove, 1);//depth=1
        // 可能な手を全部生成する
        const moves = bstate.legalMoves(bstate.state);
        let size: number = 0;
        if (moves == null) return null;
        else size = moves.length;
        // 最良の手が複数あるのでそれを管理する
        let bestMoves = new Array;
        // 最良の手の値を負の無限大に設定しておく
        let bestVal: number = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < size; i++) {
            console.log("for文の内側開始:" + (i + 1) + "回目");
            const move = moves[i];
            // 1手進めてみる
            //trailに保存
            const trail = bstate.doMove(move);
            // 評価値を計算
            let moveVal: number;
            let blackIsNext = checkBlackIsNext(bstate.currentMove);
            console.log("AfterdoMove-boxes: currentMove:" + bstate.currentMove + " blackIsNext:" + blackIsNext);
            moveVal = bstate.eval();
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
        // bestの中から乱数で選択
        const bestSize: number = bestMoves.length;
        const selected: number = Math.floor(Math.random() * bestSize);
        return bestMoves[selected];
    }
}