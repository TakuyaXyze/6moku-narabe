"use client";

import { useState, useEffect, useRef } from "react";
import { PlayGround } from "./PlayGround";
import { Tips } from "./Tips";
import { playSound } from "./Sounds";
import { RuleScreen, ListScreen } from "./GameMenu";
import { stageInfo, StageInfo } from "./StageData";
import { EyecatchScreen } from "./EyecatchScreen";
import "../styles/StageFlow.css";
import "../styles/Field.css";
import "../styles/Portrait.css";

type Phase = "eyecatch" | "guide" | "playing";

type MenuScreen = "rule" | "hint" | null;

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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openScreen, setOpenScreen] = useState<MenuScreen>(null);
    const menuArea = useRef<HTMLDivElement>(null);

    const allCleared: boolean = stageNo > stageInfo.length;
    const stage: StageInfo = stageInfo[Math.min(stageNo, stageInfo.length) - 1];
    const playerIsBlack: boolean = (roundNo === 1) ? firstRoundIsBlack : !firstRoundIsBlack;
    const stageLabel: string = stageNo + "-" + roundNo;
    const initialTime: number = stage.timeLimit + carriedTime - timePenalty;
    const gameOver: boolean = initialTime <= 0;
    const fallbackStageNo: number = Math.max(stageNo - 1, 1);
    const nextLabel: string = lastWin ? "次へ" : (gameOver ? "ステージ" + fallbackStageNo + "へ" : "もう一度");
    const penaltyApplies: boolean = Number.isFinite(stage.timeLimit);
    const resultNote: string = lastWin ? ""
        : (gameOver ? "挑戦する持ち時間が尽きました"
            : (penaltyApplies ? "敗北ペナルティ −" + Math.floor(TIME_PENALTY / 1000) + "秒" : ""));

    const hasHint: boolean = stage.hints.length > 0;

    useEffect(() => {
        if (!allCleared) return;
        playSound("clapping");
    }, [allCleared])

    useEffect(() => {
        if (phase === "playing") return;
        function handleEscapeKey(event: KeyboardEvent): void {
            if (event.key !== "Escape") return;
            if (openScreen !== null) {
                setOpenScreen(null);
                return;
            }
            setIsMenuOpen((isOpen) => !isOpen);
        }
        document.addEventListener("keydown", handleEscapeKey);
        return () => document.removeEventListener("keydown", handleEscapeKey);
    }, [openScreen, phase])

    useEffect(() => {
        if (!isMenuOpen) return;
        function handleOutsideClick(event: MouseEvent): void {
            if (menuArea.current && menuArea.current.contains(event.target as Node)) return;
            event.stopPropagation();
            setIsMenuOpen(false);
        }
        document.addEventListener("click", handleOutsideClick, true);
        return () => document.removeEventListener("click", handleOutsideClick, true);
    }, [isMenuOpen])

    function openMenuScreen(screen: MenuScreen): void {
        setOpenScreen(screen);
        setIsMenuOpen(false);
    }

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
                jumpToStage(fallbackStageNo);
                return;
            }
            setAttempt(attempt + 1);
            setPhase("eyecatch");
            return;
        }
        if (roundNo < stage.rounds) {
            setRoundNo(roundNo + 1);
            setAttempt(0);
            setTimePenalty(0);
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
        if (nextStageNo < 1 || nextStageNo > stageInfo.length + 1) return;
        setStageNo(nextStageNo);
        setRoundNo(1);
        setAttempt(0);
        setCarriedTime(0);
        setTimePenalty(0);
        setPhase("eyecatch");
    }

    if (phase === "playing") {
        return (
            <div className={"stage-field field-" + stage.field}>
                <PlayGround
                    key={stageNo + "-" + roundNo + "-" + attempt}
                    playerIsBlack={playerIsBlack}
                    computer={stage.computer}
                    stageLabel={stageLabel}
                    initialTime={initialTime}
                    timeIncrement={stage.timeIncrement}
                    nextLabel={nextLabel}
                    resultNote={resultNote}
                    onGameEnd={handleGameEnd}
                    onNext={handleNext}
                />
                <Tips />
            </div>
        );
    }

    return (
        <div className="stage-screen">

            {phase === "eyecatch" && allCleared && (
                <div className="stage-panel clear-panel">
                    <div className="stage-number clear-title">ALL CLEAR</div>
                    <div className="clear-message">全ステージクリアおめでとう</div>
                    <button className="clear-button" onClick={() => jumpToStage(1)}>最初から</button>
                </div>
            )}

            {phase === "eyecatch" && !allCleared && (
                <EyecatchScreen
                    stageLabel={stageLabel}
                    initialTime={initialTime}
                    stageTimeLimit={stage.timeLimit}
                    carriedTime={carriedTime}
                    timePenalty={timePenalty}
                    roundNo={roundNo}
                    attempt={attempt}
                    playerIsBlack={playerIsBlack}
                    onSelectFirstMove={selectFirstMove}
                    onStart={startRound}
                />
            )}

            {phase === "guide" && (
                <div className="stage-panel">
                    <div className="stage-message">{stage.guide}</div>
                    <button onClick={() => setPhase("playing")}>開始</button>
                </div>
            )}

            {!allCleared && (
                <div className="menu-area" ref={menuArea}>
                    <button className="menu-button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >☰</button>
                    {isMenuOpen &&
                        <div className="menu-panel">
                            <button onClick={() => openMenuScreen("rule")}>ルール説明</button>
                            <button onClick={() => openMenuScreen("hint")}
                                disabled={!hasHint}
                            >ステージのヒント</button>
                        </div>
                    }
                </div>
            )}

            {openScreen === "rule" &&
                <RuleScreen onClose={() => setOpenScreen(null)} />
            }

            {openScreen === "hint" && hasHint &&
                <ListScreen
                    title={"ステージ" + stageNo + "　" + stage.computer.name}
                    lines={stage.hints}
                    onClose={() => setOpenScreen(null)}
                />
            }

            <div className="stage-demo-tool">
                <span>デモ用</span>
                <button onClick={() => jumpToStage(stageNo - 1)}>前のステージ</button>
                <button onClick={() => jumpToStage(stageNo + 1)}>次のステージ</button>
                <button onClick={() => jumpToStage(stageInfo.length + 1)}>クリア画面</button>
            </div>

        </div>
    );
}
