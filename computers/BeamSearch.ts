import { checkBlackIsNext } from "./GameRule";
import { BoardState } from "./BoardState";
import { BoardTrail } from "./BoardTrail";
import { ComputerSetting } from "./ComputerSetting";
import { DoubleMoveCoordinate, MoveCoordinate } from "./Evaluate";

export class BeamSearch {
    private _beamSize: number;
    private _maxBeamSize: number;
    private _budget: number;
    private _blunder: number;
    private _evalCount: number;
    private _rootSize: number;
    private _rootBeamSize: number;
    private _isRoot: boolean;
    constructor(setting: ComputerSetting) {
        this._beamSize = setting.beamSize;
        this._maxBeamSize = setting.beamSize;
        this._budget = setting.budget;
        this._blunder = setting.blunder;
        this._evalCount = 0;
        this._rootSize = 0;
        this._rootBeamSize = 0;
        this._isRoot = true;
    }
    private pickIndex(ranking: Array<[number, ...unknown[]]>, isRoot: boolean): number {
        const length = ranking.length;
        if (length <= 1) return 0;
        if (isRoot && Math.random() < this._blunder) {
            return 1 + Math.floor(Math.random() * (length - 1));
        }
        let ties = 1;
        while (ties < length && ranking[ties][0] === ranking[0][0]) ties++;
        return Math.floor(Math.random() * ties);
    }
    get beamSize(): number {
        return this._beamSize
    }
    set beamSize(size: number) {
        this._beamSize = size;
    }
    get evalCount(): number {
        return this._evalCount;
    }
    get rootSize(): number {
        return this._rootSize;
    }
    get rootBeamSize(): number {
        return this._rootBeamSize;
    }
    eval(bstate: BoardState): number {
        // 末端のレベルでは局面の評価値。
        //console.log("start-evaluation:level=" + bstate.level);
        this._evalCount++;
        return bstate.eval();
    }
    bestMove(bstate: BoardState): (DoubleMoveCoordinate | null) {
        //console.log("BeamSearch-level" + bstate.level + "-bestMove:start");

        //console.log("currentMove:" + bstate.currentMove + " blackIsNext:" + checkBlackIsNext(bstate.currentMove));
        const isRoot = this._isRoot;
        this._isRoot = false;
        const moves = bstate.legalMoves(bstate.state);
        let size: number = 0;
        if (moves == null) return null;
        size = moves.length;
        if (size < 2) return null;
        const pairs = size * (size - 1) / 2;
        this.beamSize = Math.max(Math.min(Math.floor(this._budget / pairs), this._maxBeamSize), 2);
        const fixedBeamSize = this.beamSize;
        if (isRoot) {
            this._rootSize = size;
            this._rootBeamSize = this.beamSize;
        }
        //console.log("size=moves.length:" + size);

        // 最良の手が複数あるのでそれを管理する
        let bestMoves = new Array<[number, DoubleMoveCoordinate]>;
        let count = 0;
        for (let i = 0; i < size - 1; i++) {
            for (let j = i + 1; j < size; j++) {
                count++;
                //console.log("for文の内側開始-level" + bstate.level + ":" + (count + 1) + "回目");
                const moveI = moves[i];
                const moveJ = moves[j];
                const move = new DoubleMoveCoordinate(undefined, moveI.rowNo, moveI.columnNo, moveJ.rowNo, moveJ.columnNo);
                // 1手進めてみる
                const trailI: BoardTrail = bstate.doMove(moveI);
                // 1手進めてみる
                const trailJ: BoardTrail = bstate.doMove(moveJ);
                // 評価値を計算
                const moveValue = this.eval(bstate);
                move.value = moveValue;
                const blackIsThisTurn = checkBlackIsNext(bstate.currentMove - 1);
                //console.log("currentMove:" + bstate.currentMove + " blackIsThisTurn:" + blackIsThisTurn);
                for (let m = 0; m < this.beamSize; m++) {
                    //console.log("for文 m=" + m);
                    if (bestMoves[m] == undefined) {
                        bestMoves[m] = [moveValue, move];
                        const bm = bestMoves[m][1];
                        //console.log("新規追加 bestMove (" + bm.firstRowNo + "," + bm.firstColumnNo + "),(" + bm.secondRowNo + "," + bm.secondColumnNo + ") value=" + bm.value);
                        break;
                    }
                    if ((blackIsThisTurn && (moveValue < bestMoves[m][0]))//blackIsThisTurnでは評価値は低いほどbest
                        || (!blackIsThisTurn && (moveValue > bestMoves[m][0]))//whiteIsThisTurnでは評価値は高いほどbest
                    ) {
                        //bestValues[m]=bestValues[m+1]の場合問答無用で[m]が優先されるので、盤上左上のマスほど優先されやすくなる偏りがあることを留意
                        bestMoves.splice(m, 0, [moveValue, move]);
                        if (bestMoves.length > this._beamSize) bestMoves.pop();
                        const bm = bestMoves[m][1];
                        //console.log("更新追加 bestMove (" + bm.firstRowNo + "," + bm.firstColumnNo + "),(" + bm.secondRowNo + "," + bm.secondColumnNo + ") value=" + bm.value);
                        break;
                    }
                }
                // 戻す
                bstate.undoMove(trailJ);
                bstate.undoMove(trailI);
                //console.log("for文の内側終了" + (count + 1) + "回目");
            }
        }
        if (bstate.level <= 2) return bestMoves[this.pickIndex(bestMoves, isRoot)][1];
        const nextBestMoves = new Array<[number, DoubleMoveCoordinate, DoubleMoveCoordinate]>;
        for (let i = 0; i < fixedBeamSize && i < bestMoves.length; i++) {
            //console.log("for文第n段階開始" + (i + 1) + "回目 level=" + bstate.level);
            const bestMove = bestMoves[i][1];
            if (bestMove.secondRowNo == undefined || bestMove.secondColumnNo == undefined)
                throw new Error("secondRowNoまたはsecondColumnNoが指定されていません");
            //console.log("bestMove:(" + bestMove.firstRowNo + "," + bestMove.firstColumnNo + "),(" + bestMove.secondRowNo + "," + bestMove.secondColumnNo + ")");
            const bestValue = bestMoves[i][0];
            const moveI = new MoveCoordinate(bestMove.firstRowNo, bestMove.firstColumnNo, bestValue);
            const moveJ = new MoveCoordinate(bestMove.secondRowNo, bestMove.secondColumnNo, bestValue);
            const trailI = bstate.doMove(moveI);
            const trailJ = bstate.doMove(moveJ);
            const blackIsThisTurn = checkBlackIsNext(bstate.currentMove - 1);
            const nextBestMove = this.bestMove(bstate) ?? bestMove;
            for (let j = 0; j < fixedBeamSize; j++) {
                if (nextBestMoves[j] == undefined
                    && typeof nextBestMove.value === "number"
                ) {
                    nextBestMoves[j] = [nextBestMove.value, bestMove, nextBestMove];
                    const nbm = nextBestMoves[j][2];
                    //console.log("新規追加 nextBestMove (" + nbm.firstRowNo + "," + nbm.firstColumnNo + "),(" + nbm.secondRowNo + "," + nbm.secondColumnNo + ") value=" + nbm.value);
                    break;
                }
                if (typeof nextBestMove.value === "number"
                    && ((blackIsThisTurn && (nextBestMove.value < nextBestMoves[j][0]))
                        || (!blackIsThisTurn && (nextBestMove.value > nextBestMoves[j][0]))
                    )
                ) {
                    nextBestMoves.splice(j, 0, [nextBestMove.value, bestMove, nextBestMove]);
                    const nbm = nextBestMoves[j][2];
                    //console.log("更新追加 nextBestMove (" + nbm.firstRowNo + "," + nbm.firstColumnNo + "),(" + nbm.secondRowNo + "," + nbm.secondColumnNo + ") value=" + nbm.value);
                    break;
                }
            }
            bstate.undoMove(trailJ);
            bstate.undoMove(trailI);
        }
        return nextBestMoves[this.pickIndex(nextBestMoves, isRoot)][1];
    }
}