import { PrintBox } from "./PrintBox";
import { columnNos } from "./PlayGround"

type Props = {
    rowNo: number;
    boxes: string[][];
    handleClick: (rowNo: number, columnNo: number) => void;
}

export function PrintRow({ rowNo, boxes, handleClick }: Props) {
    //1行1行を描画
    return (
        <div className="row">
            {columnNos.map((columnNo: number) => printOneRow(rowNo, boxes, handleClick, columnNo))}
        </div>
    )
}

function printOneRow(rowNo: number, boxes: string[][], handleClick: (rowNo: number, columnNo: number) => void, columnNo: number) {
    const key: string = rowNo + "-" + columnNo;
    return (
        <PrintBox key={key} rowNo={rowNo} columnNo={columnNo} value={boxes[rowNo][columnNo]} onBoxClick={() => handleClick(rowNo, columnNo)} />
    )
}