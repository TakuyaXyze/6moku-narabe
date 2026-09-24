"use client";

import "../styles/GameBoard.css"
import { PrintRow } from "./PrintRow";
import { rowNos } from "./PlayGround";
import { MoveCoordinate } from "../computers/Evaluate";

type Props = {
    boxes: (string | null)[][];
    handleClick: (rowNo: number, columnNo: number) => void;
    pointerColor: (string | null);
    markedMoves: MoveCoordinate[];
    winMoves: MoveCoordinate[];
    crossMoves: MoveCoordinate[];
}

export function GameBoard({ boxes, handleClick, pointerColor, markedMoves, winMoves, crossMoves }: Props) {
    return (
        <div className={`
            game-board
            ${pointerColor === "b" ? "turn-black" : ""}
            ${pointerColor === "w" ? "turn-white" : ""}
            `}
        >
            {rowNos.map((rowNo) => (printRows(boxes, handleClick, rowNo, markedMoves, winMoves, crossMoves)))}
        </div>
    )
};

function printRows(boxes: (string | null)[][], handleClick: (rowNo: number, columnNo: number) => void, rowNo: number, markedMoves: MoveCoordinate[], winMoves: MoveCoordinate[], crossMoves: MoveCoordinate[]) {
    const key: string = "row-" + rowNo;
    return (
        <PrintRow key={key} rowNo={rowNo} boxes={boxes} handleClick={handleClick} markedMoves={markedMoves} winMoves={winMoves} crossMoves={crossMoves} />
    )
}
