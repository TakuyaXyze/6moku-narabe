import { useState, useEffect } from "react";
import type { GameResult } from "./ResultPopup";
import "../styles/ResultTrial.css";

//試作用。台詞の札の名前の札を、縁と見分けやすくする案を、hold=result のときに←→キーか上のボタンで切り替える
//↑↓キーか上のボタンで勝敗の種類も切り替える。採用した案だけをあとで本体へ移す

//tag は名前の札の見た目を変えるクラス名(tag-〇〇)、say は札全体の色を変えるクラス名(say-〇〇)になる
const TRIALS = [
    { tag: "now", say: "", name: "今の本体" },
];

const RESULTS: GameResult[] = ["win", "lose", "timeup", "draw"];

export function useResultTrial(isOn: boolean, result: GameResult) {
    const [trialNo, setTrialNo] = useState(0);
    const [shownResult, setShownResult] = useState<GameResult>(result);
    const trial = TRIALS[trialNo];

    function move(step: number): void {
        setTrialNo((trialNo + step + TRIALS.length) % TRIALS.length);
    }

    function moveResult(step: number): void {
        const resultNo = RESULTS.indexOf(shownResult);
        setShownResult(RESULTS[(resultNo + step + RESULTS.length) % RESULTS.length]);
    }

    useEffect(() => {
        if (!isOn) return;
        function handleKey(event: KeyboardEvent): void {
            if (event.key === "ArrowRight") move(1);
            if (event.key === "ArrowLeft") move(-1);
            if (event.key === "ArrowDown") moveResult(1);
            if (event.key === "ArrowUp") moveResult(-1);
        }
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOn, trialNo, shownResult])

    const className = isOn ? "tag-" + trial.tag + (trial.say !== "" ? " say-" + trial.say : "") : "";
    const label = (trialNo + 1) + "/" + TRIALS.length + " " + trial.name;
    return { className, label, move, moveResult, shownResult: isOn ? shownResult : result };
}
