"use client";

import "../styles/GameBoard.css"
import { PrintRow } from "./PrintRow";
import { calculateWinner } from "./PlayGround";

type Props = {
    blackIsNext: boolean;
    boxes: string[][];
    onPlay: (nextBoxes: string[][]) => void;
}

export function GameBoard({ blackIsNext, boxes, onPlay }: Props) {

    function handleClick(rowNo: number, columnNo: number): void {
        if (calculateWinner(boxes) || boxes[rowNo][columnNo]) {//空白のときのみ配置可能
            return;
        }
        handleColor(rowNo, columnNo);
    }

    function handleColor(rowNo: number, columnNo: number) {
        const nextBoxes = boxes.slice();
        if (blackIsNext) {//2手ずつ進むように変更するために後程変更予定
            nextBoxes[rowNo][columnNo] = "X";
        } else {
            nextBoxes[rowNo][columnNo] = "O";
        }
        onPlay(nextBoxes);
    }

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
}