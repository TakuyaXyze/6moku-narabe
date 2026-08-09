"use client";

import "../styles/GameBoard.css"
import { PrintRow } from "./PrintRow";
import { rowNos } from "./PlayGround";

type Props = {
    //blackIsNext: boolean;
    boxes: (string | null)[][];
    handleClick: (rowNo: number, columnNo: number) => void;
}
/*
export interface ChildHandles {
    getAlert(): void;
}*/

//export function GameBoard({ blackIsNext, boxes, handleClick }: Props) {
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