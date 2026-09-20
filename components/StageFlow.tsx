"use client";

import { useState } from "react";
import { PlayGround } from "./PlayGround";
import { Tips } from "./Tips";
import "../styles/StageFlow.css";

type Phase = "eyecatch" | "guide" | "playing";

type StageInfo = {
    stageNo: number;
    rounds: number;
    computerMode: string;
    timeLimit: number;
    timeIncrement: number;
    guide: string;
};

const stageInfo: StageInfo[] = [
    { stageNo: 1, rounds: 1, computerMode: "Random", timeLimit: Number.POSITIVE_INFINITY, timeIncrement: 0, guide: "" },
    { stageNo: 2, rounds: 2, computerMode: "Random", timeLimit: 20000, timeIncrement: 5000, guide: "" },
    { stageNo: 3, rounds: 2, computerMode: "Depth1Search", timeLimit: 20000, timeIncrement: 5000, guide: "" },
    { stageNo: 4, rounds: 2, computerMode: "Beam-depth4", timeLimit: 20000, timeIncrement: 5000, guide: "" },
];

const TIME_CARRY_RATE = 0.5;
const TIME_PENALTY = 5000;

export function StageFlow() {

    const [stageNo, setStageNo] = useState(1);
    const [roundNo, setRoundNo] = useState(1);
    const [attempt, setAttempt] = useState(0);
    const [phase, setPhase] = useState<Phase>("eyecatch");
    const [firstRoundIsBlack, setFirstRoundIsBlack] = useState(true);
    const [lastWin, setLastWin] = useState(true);
    const [carriedTime, setCarriedTime] = useState(0);
    const [timePenalty, setTimePenalty] = useState(0);

    const allCleared: boolean = stageNo > stageInfo.length;
    const stage: StageInfo = stageInfo[Math.min(stageNo, stageInfo.length) - 1];
    const playerIsBlack: boolean = (roundNo === 1) ? firstRoundIsBlack : !firstRoundIsBlack;
    const stageLabel: string = stageNo + "-" + roundNo;
    const initialTime: number = stage.timeLimit + carriedTime - timePenalty;
    const gameOver: boolean = initialTime <= 0;
    const nextLabel: string = lastWin ? "次へ" : (gameOver ? "ステージ1から" : "もう一度");

    function startRound(): void {
        if (stage.guide === "") setPhase("playing");
        else setPhase("guide");
    }

    function selectFirstMove(isBlack: boolean): void {
        setFirstRoundIsBlack(isBlack);
        startRound();                   //選択直後に対局自動開始
    }

    function handleGameEnd(playerWins: boolean, restTime: number): void {
        setLastWin(playerWins);
        setCarriedTime((playerWins && Number.isFinite(restTime)) ? Math.floor(restTime * TIME_CARRY_RATE) : 0);
        if (!playerWins && Number.isFinite(stage.timeLimit)) setTimePenalty(timePenalty + TIME_PENALTY);
    }

    function handleNext(): void {
        if (!lastWin) {
            if (gameOver) {
                jumpToStage(1);
                return;
            }
            setAttempt(attempt + 1);
            setPhase("playing");
            return;
        }
        if (roundNo < stage.rounds) {
            setRoundNo(roundNo + 1);
            setAttempt(0);
            setPhase("eyecatch");
            return;
        }
        setStageNo(stageNo + 1);
        setRoundNo(1);
        setAttempt(0);
        setPhase("eyecatch");
    }

    function jumpToStage(nextStageNo: number): void {
        if (nextStageNo < 1 || nextStageNo > stageInfo.length) return;
        setStageNo(nextStageNo);
        setRoundNo(1);
        setAttempt(0);
        setCarriedTime(0);
        setTimePenalty(0);
        setPhase("eyecatch");
    }

    if (phase === "playing") {
        return (
            <>
                <PlayGround
                    key={stageNo + "-" + roundNo + "-" + attempt}
                    playerIsBlack={playerIsBlack}
                    gameMode={stage.computerMode}
                    stageLabel={stageLabel}
                    initialTime={initialTime}
                    timeIncrement={stage.timeIncrement}
                    nextLabel={nextLabel}
                    onGameEnd={handleGameEnd}
                    onNext={handleNext}
                />
                <Tips />
            </>
        );
    }

    return (
        <div className="stage-screen">

            {phase === "eyecatch" && allCleared && (
                <div className="stage-panel">
                    <div className="stage-number">ALL CLEAR</div>
                    <button onClick={() => jumpToStage(1)}>最初から</button>
                </div>
            )}

            {phase === "eyecatch" && !allCleared && (
                <div className="stage-panel">
                    <div className="stage-number">STAGE {stageLabel}</div>
                    <div className="stage-message">
                        持ち時間 {Number.isFinite(initialTime) ? Math.floor(initialTime / 1000) + "秒" : "無制限"}
                    </div>
                    {roundNo === 1 && (
                        <div className="stage-choice">
                            <div className="stage-message">先攻・後攻を選ぶ</div>
                            <button onClick={() => selectFirstMove(true)}>先攻（黒）</button>
                            <button onClick={() => selectFirstMove(false)}>後攻（白）</button>
                        </div>
                    )}
                    {roundNo !== 1 && (
                        <div className="stage-choice">
                            <div className="stage-message">
                                ラウンド{roundNo} {playerIsBlack ? "先攻（黒）" : "後攻（白）"}
                            </div>
                            <button onClick={() => startRound()}>開始</button>
                        </div>
                    )}
                </div>
            )}

            {phase === "guide" && (
                <div className="stage-panel">
                    <div className="stage-message">{stage.guide}</div>
                    <button onClick={() => setPhase("playing")}>開始</button>
                </div>
            )}

            <div className="stage-demo-tool">
                <span>デモ用</span>
                <button onClick={() => jumpToStage(stageNo - 1)}>前のステージ</button>
                <button onClick={() => jumpToStage(stageNo + 1)}>次のステージ</button>
            </div>

        </div>
    );
}
