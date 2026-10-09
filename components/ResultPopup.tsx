import { useState, useEffect } from "react";
import { Overlay } from "./Overlay";

export type GameResult = "win" | "lose" | "timeup" | "draw";

const RESULT_SHOW_TIME = 2500;

const RESULT_TEXTS: Record<GameResult, string> = {
    win: "WIN",
    lose: "LOSE",
    timeup: "TIME UP",
    draw: "DRAW",
};

const SUB_TEXTS: Record<GameResult, string> = {
    win: "なかなかやるな",
    lose: "まだまだだな",
    timeup: "",
    draw: "",
};

type Props = {
    result: GameResult;
    note: string;
    onNext: () => void;
}

//ボタンは置かない。一定時間たつか、どこかをクリックすると次へ進む
export function ResultPopup({ result, note, onNext }: Props) {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isClosing) {
            onNext();
            return;
        }
        const closeId = setTimeout(() => setIsClosing(true), RESULT_SHOW_TIME);
        return () => clearTimeout(closeId);
    }, [isClosing])

    return (
        <Overlay onClose={() => setIsClosing(true)}>
            <div className="game-result">
                <div className="game-result-label">
                    <div className="game-result-text">{RESULT_TEXTS[result]}</div>
                    <div className="game-sub-text">{SUB_TEXTS[result]}</div>
                    {note !== "" &&
                        <div className="game-result-note">{note}</div>
                    }
                </div>
            </div>
        </Overlay>
    );
}
