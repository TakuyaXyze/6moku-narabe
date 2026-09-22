import { ComputerSetting } from "./ComputerSetting";
import { DoubleMoveCoordinate } from "./Evaluate";
import { checkBlackIsNext } from "./GameRule";
import { computerTurnRandom } from "./PutRandom";
import { computerTurnBeamSearch } from "./PutBeam";

export type ComputerRequest = {
    boxes: (string | null)[][];
    currentMove: number;
    computer: ComputerSetting;
};

export type ComputerResponse = {
    firstRowNo: number;
    firstColumnNo: number;
    secondRowNo?: number;
    secondColumnNo?: number;
};

function computerTurn({ boxes, currentMove, computer }: ComputerRequest): DoubleMoveCoordinate {
    if (currentMove === 0) {
        const firstMove = computerTurnRandom(boxes, currentMove);
        return new DoubleMoveCoordinate(undefined, firstMove.rowNo, firstMove.columnNo);
    }
    return computerTurnBeamSearch(boxes, currentMove, computer, checkBlackIsNext(currentMove));
}

self.onmessage = (event: MessageEvent<ComputerRequest>) => {
    const result = computerTurn(event.data);
    const response: ComputerResponse = {
        firstRowNo: result.firstRowNo,
        firstColumnNo: result.firstColumnNo,
        secondRowNo: result.secondRowNo,
        secondColumnNo: result.secondColumnNo,
    };
    self.postMessage(response);
};
