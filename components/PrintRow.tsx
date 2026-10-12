import { PrintBox } from "./PrintBox";
import { columnNos } from "../computers/GameRule"
import { MoveCoordinate } from "../computers/Evaluate";
import { WinMove } from "../computers/DetectWinLine";

type Props = {
    rowNo: number;
    boxes: (string | null)[][];
    handleClick: (rowNo: number, columnNo: number) => void;
    markedMoves: MoveCoordinate[];
    winMoves: WinMove[];
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
    winMoves: WinMove[],
    crossMoves: MoveCoordinate[],
    bonusNo: number
) {
    const key: string = rowNo + "-" + columnNo;
    const winMove = winMoves.find((move) => rowNo === move.rowNo && columnNo === move.columnNo);
    return (
        <PrintBox
            key={key}
            rowNo={rowNo}
            columnNo={columnNo}
            value={boxes[rowNo][columnNo]}
            onBoxClick={() => handleClick(rowNo, columnNo)}
            isLastMove={markedMoves.some((move) => rowNo === move.rowNo && columnNo === move.columnNo)}
            winOrder={winMove === undefined ? null : winMove.order}
            isCrossMove={crossMoves.some((move) => rowNo === move.rowNo && columnNo === move.columnNo)}
            bonusNo={bonusNo}
        />
    )
}
