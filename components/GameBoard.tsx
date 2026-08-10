"use client";

import "../styles/GameBoard.css"
import { PrintRow } from "./PrintRow";
import { rowNos } from "./PlayGround";

type Props = {
    boxes: (string | null)[][];
    handleClick: (rowNo: number, columnNo: number) => void;
}

export function GameBoard({ boxes, handleClick }: Props) {
    return (
        <div className="game-board">
            {rowNos.map((columnNo) => (printRows(boxes, handleClick, columnNo)))}
        </div>
    )
};

function printRows(boxes: (string | null)[][], handleClick: (rowNo: number, columnNo: number) => void, rowNo: number) {
    const key: string = "row-" + rowNo;
    return (
        <PrintRow key={key} rowNo={rowNo} boxes={boxes} handleClick={handleClick} />
    )
}