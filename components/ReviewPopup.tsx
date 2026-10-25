"use client";

import "../styles/ReviewPopup.css";
import { useState } from "react";
import { Overlay } from "./Overlay";
import { GameBoard } from "./GameBoard";

type Props = {
    boards: (string | null)[][][];      //石を1つ置くごとの盤面。最初は空の盤
    onClose: () => void;
}

//直前の対局を、手番ごとに振り返る
//手番の区切りは、先手の1手目のあとと、そこから石を2つ置くごと。対局は手番の途中で終わることもあるので、最後の盤面も区切りに入れる
export function ReviewPopup({ boards, onClose }: Props) {
    const lastMove: number = boards.length - 1;
    const turnEnds: number[] = [0];
    for (let move = 1; move <= lastMove; move += 2) turnEnds.push(move);
    if (turnEnds[turnEnds.length - 1] !== lastMove) turnEnds.push(lastMove);
    const turnCount: number = turnEnds.length - 1;
    const [turnNo, setTurnNo] = useState(turnCount);        //開いたときは、対局が終わった局面を見せる

    //盤とボタンの周りに触っても閉じないよう、幕までクリックを届けない
    return (
        <Overlay onClose={onClose}>
            <div className="review-panel" onClick={(event) => event.stopPropagation()}>
                <div className="review-board">
                    <GameBoard boxes={boards[turnEnds[turnNo]]} handleClick={() => { }} pointerColor={null}
                        markedMoves={[]} winMoves={[]} crossMoves={[]} bonusText={null} bonusNo={0} />
                </div>
                <div className="review-controls">
                    <button disabled={turnNo === 0} onClick={() => setTurnNo(turnNo - 1)}>前の手番へ</button>
                    <div className="review-turn">{turnNo} / {turnCount} 手番</div>
                    <button disabled={turnNo === turnCount} onClick={() => setTurnNo(turnNo + 1)}>次の手番へ</button>
                </div>
            </div>
        </Overlay>
    );
}
