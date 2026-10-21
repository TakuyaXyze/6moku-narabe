import { useState, useEffect } from "react";
import { Zen_Antique, Cormorant_Garamond } from "next/font/google";
import { Overlay } from "./Overlay";
import type { RoundSays } from "./SayData";
import "../styles/ResultPopup.css";

export type GameResult = "win" | "lose" | "timeup" | "draw";

const RESULT_SHOW_TIME = 5000;     //台詞を読みきれるだけの長さ。クリックやEnter・Spaceキーで早く閉じられる
const RESULT_CLOSE_TIME = 600;      //帯を畳むのにかかる時間。ResultPopup.cssのband-wipe-closeの長さと合わせる

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

//URLに say=round を付けると、台詞の札が角丸の矩形になる
function urlHas(text: string): boolean {
    return typeof window !== "undefined" && window.location.search.includes(text);
}

//試作用。URLに anim=slide などを付けると、帯と台詞の札の出方が本番(wipe)でなくその案になる。anim=none なら動きなし
function animTrial(): string {
    if (typeof window === "undefined") return "";
    const anim = new URLSearchParams(window.location.search).get("anim");
    return anim === null ? "" : "anim-" + anim;
}

type Props = {
    result: GameResult;
    note: string;
    speaker: string;    //台詞を言う相手の名前
    says: RoundSays;    //台詞の候補。この中からランダムに1つ選ぶ
    onNext: () => void;
}

//中央の帯に判定と案内、画面の下の斜めの札に相手の台詞を出す
//ボタンは置かない。一定時間たつか、どこかをクリックするか、Enter・Spaceキーを押すと次へ進む
export function ResultPopup({ result, note, speaker, says, onNext }: Props) {
    const [isClosing, setIsClosing] = useState(false);
    const sayShape = urlHas("say=round") ? "say-round" : "";
    const [pick] = useState(Math.random());     //表示中に台詞が変わらないよう、選ぶ位置は最初に1回だけ決める
    const sub = says[result][Math.floor(pick * says[result].length)] ?? "";

    //閉じるときは、帯が畳まれる様子を見せてから暗転を始める
    useEffect(() => {
        if (isClosing) {
            const nextId = setTimeout(onNext, RESULT_CLOSE_TIME);
            return () => clearTimeout(nextId);
        }
        const closeId = setTimeout(() => setIsClosing(true), RESULT_SHOW_TIME);
        return () => clearTimeout(closeId);
    }, [isClosing])

    //畳んでいる途中も、画面が消えるまではキーを受け止めて後ろの画面に届けない
    useEffect(() => {
        function handleCloseKey(event: KeyboardEvent): void {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();         //後ろの画面のボタンが押されたり、画面が動いたりしないようにする
            if (event.repeat) return;       //押しっぱなしで次の画面まで進まないようにする
            setIsClosing(true);
        }
        document.addEventListener("keydown", handleCloseKey);
        return () => document.removeEventListener("keydown", handleCloseKey);
    }, [])

    return (
        <Overlay className="overlay-result" onClose={() => setIsClosing(true)}>
            <div className={"game-result result-" + result + " " + kanjiFont.variable + " " + latinFont.variable + " " + sayShape + " " + animTrial() + (isClosing ? " result-closing" : "")}>
                <div className="result-band">
                    <div className="result-latin">{RESULT_TEXTS[result]}</div>
                    <div className="result-kanji">{KANJI_TEXTS[result]}</div>
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
            </div>
        </Overlay>
    );
}
