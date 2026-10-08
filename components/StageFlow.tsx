"use client";

import { useState, useEffect } from "react";
import { PlayGround } from "./PlayGround";
import { Tips } from "./Tips";
import { playSound, DEFAULT_VOLUME } from "./Sounds";
import { RuleScreen } from "./RuleScreen";
import { stageInfo, StageInfo } from "./StageData";
import { StageScreen } from "./StageScreen";
import { ClearScreen } from "./ClearScreen";
import { DemoTool } from "./DemoTool";
import { useBgm, BgmTrack } from "./Bgm";
import "../styles/StageFlow.css";
import "../styles/Field.css";
import "../styles/Portrait.css";

type Phase = "standby" | "playing";

const TIME_CARRY_RATE = 0.2;
const TIME_PENALTY = 3000;
const BOMB_MUTED_RATE = 0.3;
const SCREEN_DARK_TIME = 350;
const SCREEN_FADE_TIME = 800;
const CLEAR_BGM: BgmTrack = { src: "/bgm/maou_loop_bgm_fantasy13.mp3" };

export function StageFlow() {

    const [stageNo, setStageNo] = useState(1);
    const [roundNo, setRoundNo] = useState(1);
    const [attempt, setAttempt] = useState(0);
    const [phase, setPhase] = useState<Phase>("standby");
    const [firstRoundIsBlack, setFirstRoundIsBlack] = useState(true);
    const [lastWin, setLastWin] = useState(true);
    const [carriedTime, setCarriedTime] = useState(0);
    const [timePenalty, setTimePenalty] = useState(0);
    const [isRuleOpen, setIsRuleOpen] = useState(false);

    const allCleared: boolean = stageNo > stageInfo.length;
    const stage: StageInfo = stageInfo[Math.min(stageNo, stageInfo.length) - 1];
    const playerIsBlack: boolean = (roundNo === 1) ? firstRoundIsBlack : !firstRoundIsBlack;
    const opponentNames: string[] = stageInfo.map((info) => info.computer.name);
    const initialTime: number = stage.timeLimit + carriedTime - timePenalty;
    const gameOver: boolean = initialTime <= 0;
    const fallbackStageNo: number = Math.max(stageNo - 1, 1);
    const fallbackName: string = opponentNames[fallbackStageNo - 1];
    const nextLabel: string = lastWin ? "次へ" : (gameOver ? fallbackName + "と再戦" : "もう一度");
    const penaltyApplies: boolean = Number.isFinite(stage.timeLimit);
    const winNote: string = (carriedTime > 0)
        ? "勝利ボーナス +" + (carriedTime / 1000) + "秒 で\n" + "次の対局へ"
        : "";
    const gameoverNote: string = fallbackName + "に勝ってから\nリベンジしに来よう";
    const penaltyNote: string = "敗北ペナルティ −" + Math.floor(TIME_PENALTY / 1000) + "秒 で再挑戦";
    const resultNote: string = lastWin ? winNote
        : (gameOver ? gameoverNote
            : (penaltyApplies ? penaltyNote : ""));
    const resetPenalty: number = penaltyApplies ? TIME_PENALTY : 0;
    const resetIsGameOver: boolean = stage.timeLimit - (timePenalty + resetPenalty) <= 0;
    const resetWarning: string | null = resetIsGameOver
        ? "持ち時間が尽きるため、" + fallbackName + "との対局からやり直しになります"
        : null;

    const [bgmIsOn, setBgmIsOn] = useState(true);
    useBgm(allCleared ? CLEAR_BGM : stage.bgm, bgmIsOn);

    useEffect(() => {
        if (!allCleared) return;
        playSound("clapping");
    }, [allCleared])

    useEffect(() => {
        if (phase === "playing") return;
        if (!isRuleOpen) return;
        function handleEscapeKey(event: KeyboardEvent): void {
            if (event.key !== "Escape") return;
            setIsRuleOpen(false);
        }
        document.addEventListener("keydown", handleEscapeKey);
        return () => document.removeEventListener("keydown", handleEscapeKey);
    }, [isRuleOpen, phase])

    const [isFading, setIsFading] = useState(false);

    function startRound(): void {
        playSound("select");            //対局に入るボタンはすべてこの音
        setIsFading(true);              //一度暗転してから対局画面に入る
        setTimeout(() => setPhase("playing"), SCREEN_DARK_TIME);
        setTimeout(() => setIsFading(false), SCREEN_FADE_TIME);    //animationendはタブが裏にあると届かないので時間で消す
    }

    const screenFade = isFading &&
        <div className="screen-fade" />;

    function selectFirstMove(isBlack: boolean): void {
        setFirstRoundIsBlack(isBlack);
        startRound();                   //選択直後に対局自動開始
    }

    function handleGameEnd(playerWins: boolean, restTime: number): void {
        setLastWin(playerWins);
        setCarriedTime((playerWins && Number.isFinite(restTime)) ? Math.floor(restTime * TIME_CARRY_RATE / 1000) * 1000 : 0);     //秒単位に切り捨て
        if (!playerWins && Number.isFinite(stage.timeLimit)) setTimePenalty(timePenalty + TIME_PENALTY);
    }

    function handleReset(): void {
        //最初に戻すのは敗北と同じ扱い。持ち時間が尽きたら前のステージへ
        if (resetIsGameOver) {
            jumpToStage(fallbackStageNo);
            return;
        }
        setCarriedTime(0);
        setTimePenalty(timePenalty + resetPenalty);
        setAttempt(attempt + 1);
    }

    function handleNext(): void {
        if (lastWin) playSound("bomb", bgmIsOn ? DEFAULT_VOLUME : DEFAULT_VOLUME * BOMB_MUTED_RATE);
        else playSound("restart");
        if (!lastWin) {
            if (gameOver) {
                jumpToStage(fallbackStageNo);
                return;
            }
            setAttempt(attempt + 1);
            setPhase("standby");
            return;
        }
        if (roundNo < stage.rounds) {
            setRoundNo(roundNo + 1);
            setAttempt(0);
            setTimePenalty(0);
            setPhase("standby");
            return;
        }
        setStageNo(stageNo + 1);
        setRoundNo(1);
        setAttempt(0);
        setTimePenalty(0);
        setPhase("standby");
    }

    function jumpToStage(nextStageNo: number): void {
        if (nextStageNo < 1 || nextStageNo > stageInfo.length + 1) return;
        setStageNo(nextStageNo);
        setRoundNo(1);
        setAttempt(0);
        setCarriedTime(0);
        setTimePenalty(0);
        setPhase("standby");
    }

    //暗転の幕(screenFade)は画面の切り替えで作り直されないよう、両方の画面の外側の同じ位置に置く
    return (
        <>
            {phase === "playing" ? (
                <div className={"stage-field field-" + stage.field}>
                    <PlayGround
                        key={stageNo + "-" + roundNo + "-" + attempt}
                        playerIsBlack={playerIsBlack}
                        computer={stage.computer}
                        initialTime={initialTime}
                        timeIncrement={stage.timeIncrement}
                        nextLabel={nextLabel}
                        resultNote={resultNote}
                        resetPenalty={resetPenalty}
                        resetWarning={resetWarning}
                        onGameEnd={handleGameEnd}
                        onNext={handleNext}
                        onReset={handleReset}
                        bgmIsOn={bgmIsOn}
                        onToggleBgm={() => setBgmIsOn(!bgmIsOn)}
                    />
                    <Tips tips={stage.hints} />
                </div>
            ) : (
                <div className="standby-screen">

                {phase === "standby" && allCleared && (
                    <ClearScreen onRestart={() => jumpToStage(1)} />
                )}

                {phase === "standby" && !allCleared && (
                    <StageScreen
                        opponentNames={opponentNames}
                        stageNo={stageNo}
                        opponentName={stage.computer.name}
                        initialTime={initialTime}
                        stageTimeLimit={stage.timeLimit}
                        carriedTime={carriedTime}
                        timePenalty={timePenalty}
                        roundNo={roundNo}
                        attempt={attempt}
                        playerIsBlack={playerIsBlack}
                        onSelectFirstMove={selectFirstMove}
                        onStart={startRound}
                        onOpenRule={() => setIsRuleOpen(true)}
                    />
                )}

                {isRuleOpen &&
                    <RuleScreen onClose={() => setIsRuleOpen(false)} />
                }

                <DemoTool stageNo={stageNo} stageCount={stageInfo.length} onJump={jumpToStage} />

                </div>
            )}
            {screenFade}
        </>
    );
}
