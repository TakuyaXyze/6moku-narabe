import { BeamSearch } from "./BeamSearch";
import { BoardState } from "./BoardState";
import { ComputerSetting } from "./ComputerSetting";
import { DoubleMoveCoordinate } from "./Evaluate";

export function computerTurnBeamSearch(boxes: (string | null)[][], currentMove: number, setting: ComputerSetting, computerIsBlack: boolean): DoubleMoveCoordinate {
    console.log("computerTurnBeamSearch-start:" + setting.name);
    const value = undefined;
    const move = new BeamSearch(setting);
    const bstate = new BoardState(boxes, currentMove, setting.depth, setting.sight, setting.defense, computerIsBlack);
    const data = move.bestMove(bstate);
    if (data === null) throw new Error("BeamSearchのbestMoveからの戻り値がnull");
    console.log("computerTurnBeamSearch-finish (" + data.firstRowNo + "," + data.firstColumnNo + "),(" + data.secondRowNo + "," + data.secondColumnNo + ") 候補数:" + move.rootSize + " beamSize:" + move.rootBeamSize + " 評価回数:" + move.evalCount);
    const coordinate = new DoubleMoveCoordinate(value, data.firstRowNo, data.firstColumnNo, data.secondRowNo, data.secondColumnNo);
    return coordinate;
}