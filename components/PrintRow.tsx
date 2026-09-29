import { PrintBox } from "./PrintBox";
import { columnNos } from "../computers/GameRule"
import { MoveCoordinate } from "../computers/Evaluate";

type Props = {
    rowNo: number;
    boxes: (string | null)[][];
    handleClick: (rowNo: number, columnNo: number) => void;
    markedMoves: MoveCoordinate[];
    winMoves: MoveCoordinate[];
    crossMoves: MoveCoordinate[];
    bonusNo: number;
}

export function PrintRow({ rowNo, boxes, handleClick, markedMoves, winMoves, crossMoves, bonusNo }: Props) {
    //1行1行を描画
    return (
        <div className="row">
            {columnNos.map((columnNo: number) => printOneRow(rowNo, boxes, handleClick, columnNo, markedMoves, winMoves, crossMoves, bonusNo))}
        </div>
    )
}

function printOneRow(
    rowNo: number,
    boxes: (string | null)[][],
    handleClick: (rowNo: number, columnNo: number) => void,
    columnNo: number,
    markedMoves: MoveCoordinate[],
    winMoves: MoveCoordinate[],
    crossMoves: MoveCoordinate[],
    bonusNo: number
) {
    const key: string = rowNo + "-" + columnNo;
    return (
        <PrintBox
            key={key}
            rowNo={rowNo}
            columnNo={columnNo}
            value={boxes[rowNo][columnNo]}
            onBoxClick={() => handleClick(rowNo, columnNo)}
            isLastMove={markedMoves.some((move) => rowNo === move.rowNo && columnNo === move.columnNo)}
            isWinMove={winMoves.some((move) => rowNo === move.rowNo && columnNo === move.columnNo)}
            isCrossMove={crossMoves.some((move) => rowNo === move.rowNo && columnNo === move.columnNo)}
            bonusNo={bonusNo}
        />
    )
}
