import { useState, useEffect } from "react";
import { Zen_Antique, Cormorant_Garamond } from "next/font/google";
import { Overlay } from "./Overlay";
import "../styles/ResultPopup.css";

export type GameResult = "win" | "lose" | "timeup" | "draw";

const RESULT_SHOW_TIME = 2500;

//日本語の書体は文字の範囲が広いので、先読みはしない
const kanjiFont = Zen_Antique({ weight: "400", subsets: ["latin"], preload: false, variable: "--result-kanji-font" });
const latinFont = Cormorant_Garamond({ weight: ["400", "600"], subsets: ["latin"], variable: "--result-latin" });

const RESULT_TEXTS: Record<GameResult, string> = {
    win: "WIN",
    lose: "LOSE",
    timeup: "TIME UP",
    draw: "DRAW",
};

const KANJI_TEXTS: Record<GameResult, string> = {
    win: "勝利",
    lose: "敗北",
    timeup: "時間切れ",
    draw: "引き分け",
};

const SUB_TEXTS: Record<GameResult, string> = {
    win: "なかなかやるな",
    lose: "まだまだだな",
    timeup: "",
    draw: "",
};

//デバッグ用。URLに hold=result を付けると、勝敗画面が自動では閉じず、上の「次へ進む」ボタンを押すまで止まる。上のボタンで勝敗の種類も切り替えられる
//URLに say=round を付けると、台詞の札が角丸の矩形になる
function urlHas(text: string): boolean {
    return typeof window !== "undefined" && window.location.search.includes(text);
}

const RESULTS: GameResult[] = ["win", "lose", "timeup", "draw"];

type Props = {
    result: GameResult;
    note: string;
    speaker: string;    //台詞を言う相手の名前
    onNext: () => void;
}

//中央の帯に判定と案内、画面の下の斜めの札に相手の台詞を出す
//ボタンは置かない。一定時間たつか、どこかをクリックすると次へ進む
export function ResultPopup({ result, note, speaker, onNext }: Props) {
    const [isClosing, setIsClosing] = useState(false);
    const [shown, setShown] = useState(result);      //止めているときだけ、上のボタンで切り替わる
    const isHeld = urlHas("hold=result");
    const sayShape = urlHas("say=round") ? "say-round" : "";
    const sub = SUB_TEXTS[shown];

    useEffect(() => {
        if (isClosing) {
            onNext();
            return;
        }
        if (isHeld) return;
        const closeId = setTimeout(() => setIsClosing(true), RESULT_SHOW_TIME);
        return () => clearTimeout(closeId);
    }, [isClosing])

    return (
        <Overlay onClose={isHeld ? undefined : () => setIsClosing(true)}>
            <div className={"game-result result-" + shown + " " + kanjiFont.variable + " " + latinFont.variable + " " + sayShape}>
                <div className="result-band">
                    <div className="result-latin">{RESULT_TEXTS[shown]}</div>
                    <div className="result-kanji">{KANJI_TEXTS[shown]}</div>
                    <div className="result-rule"><span />◆<span /></div>
                    {note !== "" &&
                        <div className="result-note">{note}</div>
                    }
                </div>
                {sub !== "" &&
                    <div className="result-say">
                        <div className="result-say-name"><span>{speaker}</span></div>
                        <div className="result-say-text">{sub}</div>
                    </div>
                }
                {isHeld &&
                    <div className="trial-bar">
                        <button onClick={() => setShown(RESULTS[(RESULTS.indexOf(shown) + 1) % RESULTS.length])}>{RESULT_TEXTS[shown]}</button>
                        <button onClick={() => setIsClosing(true)}>次へ進む</button>
                    </div>
                }
            </div>
        </Overlay>
    );
}
