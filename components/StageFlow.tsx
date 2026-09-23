"use client";

import { useState } from "react";
import { PlayGround } from "./PlayGround";
import { Tips } from "./Tips";
import { ComputerSetting } from "../computers/ComputerSetting";
import "../styles/StageFlow.css";

type Phase = "eyecatch" | "guide" | "playing";

type StageInfo = {
    stageNo: number;
    rounds: number;
    computer: ComputerSetting;
    timeLimit: number;
    timeIncrement: number;
    guide: string;
};

const stageInfo: StageInfo[] = [
    {
        stageNo: 1, rounds: 1, timeLimit: Number.POSITIVE_INFINITY, timeIncrement: 0, guide: "",
        computer: { name: "素人", depth: 2, beamSize: 20, budget: 150000, sight: 1, defense: 0, orderDefense: 0, blunder: 0.5 },
    },
    {
        stageNo: 2, rounds: 2, timeLimit: 10000, timeIncrement: 5000, guide: "",
        computer: { name: "見習い", depth: 2, beamSize: 20, budget: 150000, sight: 3, defense: 0.7, orderDefense: 0.7, blunder: 0.45 },
    },
    {
        stageNo: 3, rounds: 2, timeLimit: 5000, timeIncrement: 2000, guide: "",
        computer: { name: "門下生", depth: 2, beamSize: 20, budget: 150000, sight: 3, defense: 0.7, orderDefense: 0.7, blunder: 0.45 },
    },
    {
        stageNo: 4, rounds: 2, timeLimit: 20000, timeIncrement: 5000, guide: "",
        computer: { name: "師範代", depth: 4, beamSize: 20, budget: 50000, sight: 4, defense: 1, orderDefense: 2, blunder: 0.4 },
    },
    {
        stageNo: 5, rounds: 2, timeLimit: 20000, timeIncrement: 5000, guide: "",
        computer: { name: "師範", depth: 4, beamSize: 50, budget: 100000, sight: 5, defense: 1, orderDefense: 2, blunder: 0 },
    },
];

const TIME_CARRY_RATE = 0.2;
const TIME_PENALTY = 3000;

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
        setTimePenalty(0);
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
                    computer={stage.computer}
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
