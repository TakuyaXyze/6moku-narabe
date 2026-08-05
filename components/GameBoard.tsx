"use client";

//import React, { forwardRef, useImperativeHandle } from "react";
import "../styles/GameBoard.css"
import { PrintRow } from "./PrintRow";
//import { calculateWinner } from "./PlayGround";

type Props = {
    blackIsNext: boolean;
    boxes: string[][];
    //onPlay: (nextBoxes: string[][]) => void;
    handleClick: (rowNo: number, columnNo: number) => void;
}

export interface ChildHandles {
    getAlert(): void;
}

export function GameBoard({ blackIsNext, boxes, handleClick }: Props) {

    return (
        <div className="game-board">
            <PrintRow rowNo={0} boxes={boxes} handleClick={handleClick} />
            <PrintRow rowNo={1} boxes={boxes} handleClick={handleClick} />
            <PrintRow rowNo={2} boxes={boxes} handleClick={handleClick} />
            <PrintRow rowNo={3} boxes={boxes} handleClick={handleClick} />
            <PrintRow rowNo={4} boxes={boxes} handleClick={handleClick} />
            <PrintRow rowNo={5} boxes={boxes} handleClick={handleClick} />
            <PrintRow rowNo={6} boxes={boxes} handleClick={handleClick} />
            <PrintRow rowNo={7} boxes={boxes} handleClick={handleClick} />
            <PrintRow rowNo={8} boxes={boxes} handleClick={handleClick} />
            <PrintRow rowNo={9} boxes={boxes} handleClick={handleClick} />
            <PrintRow rowNo={10} boxes={boxes} handleClick={handleClick} />
            <PrintRow rowNo={11} boxes={boxes} handleClick={handleClick} />
            <PrintRow rowNo={12} boxes={boxes} handleClick={handleClick} />
            <PrintRow rowNo={13} boxes={boxes} handleClick={handleClick} />
            <PrintRow rowNo={14} boxes={boxes} handleClick={handleClick} />
            <PrintRow rowNo={15} boxes={boxes} handleClick={handleClick} />
            <PrintRow rowNo={16} boxes={boxes} handleClick={handleClick} />
            <PrintRow rowNo={17} boxes={boxes} handleClick={handleClick} />
            <PrintRow rowNo={18} boxes={boxes} handleClick={handleClick} />
        </div>
    );
};