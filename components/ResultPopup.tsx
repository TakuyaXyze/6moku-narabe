import { Overlay } from "./Overlay";

export type GameResult = "win" | "lose" | "timeup";

const RESULT_TEXTS: Record<GameResult, string> = {
    win: "WIN",
    lose: "LOSE",
    timeup: "TIME UP",
};

const SUB_TEXTS: Record<GameResult, string> = {
    win: "なかなかやるな",
    lose: "まだまだだな",
    timeup: "",
};

type Props = {
    result: GameResult;
    note: string;
    buttonLabel: string;
    onNext: () => void;
}

export function ResultPopup({ result, note, buttonLabel, onNext }: Props) {
    return (
        <Overlay>
            <div className="game-result">
                <div className="game-result-label">
                    <div className="game-result-text">{RESULT_TEXTS[result]}</div>
                    <div className="game-sub-text">{SUB_TEXTS[result]}</div>
                    {note !== "" &&
                        <div className="game-result-note">{note}</div>
                    }
                </div>
                <button className="game-result-button"
                    onClick={() => onNext()}
                >{buttonLabel}</button>
            </div>
        </Overlay>
    );
}
