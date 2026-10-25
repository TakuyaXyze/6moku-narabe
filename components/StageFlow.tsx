"use client";

import { useState, useEffect, useRef } from "react";
import { PlayGround } from "./PlayGround";
import { Tips } from "./Tips";
import { playSound, loadSounds } from "./Sounds";
import { RuleScreen } from "./RuleScreen";
import { ReviewPopup } from "./ReviewPopup";
import { stageInfo, StageInfo } from "./StageData";
import { findSays } from "./SayData";
import { StageScreen } from "./StageScreen";
import { ClearScreen } from "./ClearScreen";
import { GameResult } from "./ResultPopup";
import { DemoTool } from "./DemoTool";
import { useBgm, BgmTrack } from "./Bgm";
import "../styles/StageFlow.css";
import "../styles/Field.css";
import "../styles/Portrait.css";

type Phase = "standby" | "playing";

const TIME_CARRY_RATE = 0.2;
const TIME_PENALTY = 3000;
const SCREEN_DARK_TIME = 350;
const SCREEN_FADE_TIME = 800;
const SELECT_FADE_DELAY = 250;      //対局に入るときは、selectの音が聞こえてから暗転を始める
const CLEAR_BGM: BgmTrack = { src: "/bgm/maou_loop_bgm_fantasy13.mp3", overlap: 0.06 };

export function StageFlow() {

    const [stageNo, setStageNo] = useState(1);
    const [roundNo, setRoundNo] = useState(1);
    const [attempt, setAttempt] = useState(0);
    const [phase, setPhase] = useState<Phase>("standby");
    const [firstRoundIsBlack, setFirstRoundIsBlack] = useState(true);
    const [lastResult, setLastResult] = useState<GameResult>("win");
    const [carriedTime, setCarriedTime] = useState(0);
    const [timePenalty, setTimePenalty] = useState(0);
    const [isRuleOpen, setIsRuleOpen] = useState(false);
    const [lastBoards, setLastBoards] = useState<(string | null)[][][] | null>(null);       //直前の対局の盤面。ステージが変わっても、次の対局が終わるまで残す
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [lossCount, setLossCount] = useState(0);      //負けと時間切れの回数。引き分けと、対局中に最初へ戻した回数は数えない

    const allCleared: boolean = stageNo > stageInfo.length;
    const lastWin: boolean = lastResult === "win";
    const stage: StageInfo = stageInfo[Math.min(stageNo, stageInfo.length) - 1];
    const playerIsBlack: boolean = (roundNo === 1) ? firstRoundIsBlack : !firstRoundIsBlack;
    const opponentNames: string[] = stageInfo.map((info) => info.computer.name);
    const initialTime: number = stage.timeLimit + carriedTime - timePenalty;
    const gameOver: boolean = initialTime <= 0;
    const fallbackStageNo: number = Math.max(stageNo - 1, 1);
    const fallbackName: string = opponentNames[fallbackStageNo - 1];
    const penaltyApplies: boolean = Number.isFinite(stage.timeLimit);
    const winNote: string = (carriedTime > 0)
        ? "勝利ボーナス +" + (carriedTime / 1000) + "秒 で\n" + "次の対局へ"
        : "";
    const gameoverNote: string = fallbackName + "に勝ってから\nリベンジしに来よう";
    const penaltyNote: string = (lastResult === "draw")
        ? "引き分けはペナルティなしで再挑戦"
        : "敗北ペナルティ −" + Math.floor(TIME_PENALTY / 1000) + "秒 で再挑戦";
    const resultNote: string = lastWin ? winNote
        : (gameOver ? gameoverNote
            : (penaltyApplies ? penaltyNote : ""));
    const resetPenalty: number = penaltyApplies ? TIME_PENALTY : 0;
    const resetIsGameOver: boolean = stage.timeLimit - (timePenalty + resetPenalty) <= 0;
    const resetWarning: string | null = resetIsGameOver
        ? "持ち時間が尽きるため、" + fallbackName + "との対局からやり直しになります"
        : null;

    const [bgmIsOn, setBgmIsOn] = useState(true);
    const nextBgm: BgmTrack | null = allCleared ? null
        : ((stageNo < stageInfo.length) ? stageInfo[stageNo].bgm : CLEAR_BGM);
    useBgm(allCleared ? CLEAR_BGM : stage.bgm, bgmIsOn, nextBgm);

    useEffect(() => {
        loadSounds();
    }, [])

    useEffect(() => {
        if (!allCleared) return;
        playSound("clapping");
    }, [allCleared])

    useEffect(() => {
        if (phase === "playing") return;
        if (!isRuleOpen && !isReviewOpen) return;
        function handleEscapeKey(event: KeyboardEvent): void {
            if (event.key !== "Escape") return;
            setIsRuleOpen(false);
            setIsReviewOpen(false);
        }
        document.addEventListener("keydown", handleEscapeKey);
        return () => document.removeEventListener("keydown", handleEscapeKey);
    }, [isRuleOpen, isReviewOpen, phase])

    const [isFading, setIsFading] = useState(false);
    const [fadeDelay, setFadeDelay] = useState(0);
    const fadingRef = useRef(false);        //幕はマウスしか止めないので、キーで押されたボタンはこれで止める

    //一度暗転して、真っ暗な間に画面を入れ替える
    //暗転を遅らせる間も幕は先に置き、透明なまま画面を押せないようにする
    function fadeScreen(changeScreen: () => void, delay: number = 0): void {
        fadingRef.current = true;
        setFadeDelay(delay);
        setIsFading(true);
        setTimeout(changeScreen, delay + SCREEN_DARK_TIME);
        setTimeout(() => {      //animationendはタブが裏にあると届かないので時間で消す
            fadingRef.current = false;
            setIsFading(false);
        }, delay + SCREEN_FADE_TIME);
    }

    const [clockDelay, setClockDelay] = useState(0);

    function startRound(): void {
        if (fadingRef.current) return;      //暗転中にEnter・Spaceで押し直しても、もう一度は始めない
        setClockDelay(SCREEN_FADE_TIME - SCREEN_DARK_TIME);     //暗転が明けきるまで、対局画面の時計を止めておく
        playSound("select");            //対局に入るボタンはすべてこの音
        fadeScreen(() => setPhase("playing"), SELECT_FADE_DELAY);
    }

    const screenFade = isFading &&
        <div className="screen-fade" style={{ animationDelay: fadeDelay + "ms" }} />;

    function selectFirstMove(isBlack: boolean): void {
        if (fadingRef.current) return;      //暗転中にTabで隣のボタンへ移って押しても、先手後手を変えない
        setFirstRoundIsBlack(isBlack);
        startRound();                   //選択直後に対局自動開始
    }

    function handleGameEnd(result: GameResult, restTime: number, boards: (string | null)[][][]): void {
        setLastBoards(boards);
        const playerWins: boolean = result === "win";
        setLastResult(result);
        if (result === "lose" || result === "timeup") setLossCount((count) => count + 1);
        setCarriedTime((playerWins && Number.isFinite(restTime)) ? Math.floor(restTime * TIME_CARRY_RATE / 1000) * 1000 : 0);     //秒単位に切り捨て
        if (!playerWins && result !== "draw" && Number.isFinite(stage.timeLimit)) setTimePenalty(timePenalty + TIME_PENALTY);       //引き分けはペナルティなしでやり直し
    }

    function handleReset(): void {
        //最初に戻すのは敗北と同じ扱い。持ち時間が尽きたら前のステージへ
        if (resetIsGameOver) {
            jumpToStage(fallbackStageNo);
            return;
        }
        setClockDelay(0);               //暗転せずにその場でやり直すので、すぐ時計を動かす
        setCarriedTime(0);
        setTimePenalty(timePenalty + resetPenalty);
        setAttempt(attempt + 1);
    }

    function handleNext(): void {
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

    function restartGame(): void {
        setLossCount(0);
        jumpToStage(1);
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
                        resultNote={resultNote}
                        says={findSays(stage.computer.name, roundNo)}
                        resetPenalty={resetPenalty}
                        resetWarning={resetWarning}
                        clockDelay={clockDelay}
                        onGameEnd={handleGameEnd}
                        onNext={() => fadeScreen(handleNext)}
                        onReset={handleReset}
                        bgmIsOn={bgmIsOn}
                        onToggleBgm={() => setBgmIsOn(!bgmIsOn)}
                    />
                    <Tips tips={stage.hints} />
                </div>
            ) : (
                <div className="standby-screen">

                    {phase === "standby" && allCleared && (
                        <ClearScreen lossCount={lossCount} onRestart={restartGame} />
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
                            canReview={lastBoards !== null}
                            onOpenReview={() => setIsReviewOpen(true)}
                        />
                    )}

                    {isRuleOpen &&
                        <RuleScreen onClose={() => setIsRuleOpen(false)} />
                    }

                    {isReviewOpen && lastBoards !== null &&
                        <ReviewPopup boards={lastBoards} onClose={() => setIsReviewOpen(false)} />
                    }

                    <DemoTool stageNo={stageNo} stageCount={stageInfo.length} onJump={jumpToStage} />

                </div>
            )}
            {screenFade}
        </>
    );
}
