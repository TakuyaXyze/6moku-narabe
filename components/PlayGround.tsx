"use client";

import { GameBoard } from "./GameBoard";
import { playSound } from "./Sounds";
import { TimeBar } from "./TimeBar";
import { SideBlock, BowlState } from "./SideBlock";
import { ResultPopup, GameResult } from "./ResultPopup";
import { UndoDialog, UndoKind } from "./UndoDialog";
import { ComputingMessage } from "./ComputingMessage";
import { PlayHeader } from "./PlayHeader";
import { RuleScreen } from "./RuleScreen";
import "../styles/PlayGround.css"
import "../styles/GameBoard.css"
import "../styles/GameInfo.css"
import { useState, useEffect, useRef } from "react";
import { detectSequence } from "../computers/CountSequence";
import { detectWinLine } from "../computers/DetectWinLine";
import { detectCross, crossKey, crossCells } from "../computers/DetectCross";
import { MoveCoordinate } from "../computers/Evaluate"
import { ComputerSetting } from "../computers/ComputerSetting";
import type { ComputerRequest, ComputerResponse } from "../computers/ComputerWorker";
import { ROWS, COLUMNS, SEQUENCE_LENGTH, checkBlackIsNext } from "../computers/GameRule";

const TIMER_INTERVAL = 100;
const COUNTDOWN_SECONDS = [10, 5, 4, 3, 2, 1];
const COMPUTER_START_DELAY = 300;
const COMPUTER_MIN_TIME = 1500;
const BLINK_TIME = 1500;
const RESULT_DELAY = 400;
const RESULT_OVERLAY_DELAY = 1600;
const CROSS_BONUS = 3000;
const BONUS_DISPLAY_TIME = 2600;
const BONUS_BLOCK_TIME = 1800;      //ボーナス演出の開始から、勝敗演出を始めるまでの時間
const UNDO_EXTRA_PENALTY = 1000;
const RULE_TIME_RATE = 0.5;

type Props = {
    playerIsBlack: boolean;
    computer: ComputerSetting;
    initialTime: number;
    timeIncrement: number;
    nextLabel: string;
    resultNote: string;
    resetPenalty: number;
    resetWarning: string | null;        //最初に戻すと持ち時間が尽きるときの注意。尽きないときはnull
    onGameEnd: (playerWins: boolean, restTime: number) => void;
    onNext: () => void;
    onReset: () => void;
}

export function PlayGround({ playerIsBlack, computer, initialTime, timeIncrement, nextLabel, resultNote, resetPenalty, resetWarning, onGameEnd, onNext, onReset }: Props) {

    const [history, setHistory] = useState([Array(ROWS).fill(null).map(() => Array<(string | null)>(COLUMNS).fill(null))]);
    const [currentMove, setCurrentMove] = useState(0);
    const blackSequence: number[] = detectSequence(history[currentMove], "b");
    const whiteSequence: number[] = detectSequence(history[currentMove], "w");
    const blackIsWinner: boolean = blackSequence[SEQUENCE_LENGTH - 2] > 0;
    const whiteIsWinner: boolean = whiteSequence[SEQUENCE_LENGTH - 2] > 0;
    const [remainingTime, setRemainingTime] = useState(initialTime);
    const hasTimeLimit: boolean = Number.isFinite(initialTime);
    const undoPenalty: number = timeIncrement * 2 + UNDO_EXTRA_PENALTY;
    const timeIsUp: boolean = hasTimeLimit && remainingTime < 0 && !blackIsWinner && !whiteIsWinner;
    const isDraw: boolean = !blackIsWinner && !whiteIsWinner && !timeIsUp && currentMove === ROWS * COLUMNS;
    const continueGame: boolean = !blackIsWinner && !whiteIsWinner && !isDraw && !timeIsUp;
    const playerWins: boolean = !isDraw && !timeIsUp && (blackIsWinner === playerIsBlack);
    const gameResult: GameResult = timeIsUp ? "timeup" : (playerWins ? "win" : "lose");

    const [cpuIsSettling, setCpuIsSettling] = useState(false);
    const [bonusTime, setBonusTime] = useState(0);
    const [crossMoves, setCrossMoves] = useState<MoveCoordinate[]>([]);
    const [bonusIsBlocking, setBonusIsBlocking] = useState(false);
    const [bonusNo, setBonusNo] = useState(0);

    useEffect(() => {
        if (!cpuIsSettling) return;
        const soundId = setTimeout(() => playSound("place"), BLINK_TIME);
        const clearId = setTimeout(() => setCpuIsSettling(false),
            BLINK_TIME + (continueGame ? 0 : RESULT_DELAY));
        return () => {
            clearTimeout(soundId);
            clearTimeout(clearId);
        };
    }, [cpuIsSettling, continueGame])

    useEffect(() => {
        if (continueGame) return;
        if (cpuIsSettling) return;
        if (bonusIsBlocking) return;
        if (timeIsUp) playSound("timeup");
        else if (blackIsWinner || whiteIsWinner) playSound("win");
        onGameEnd(playerWins, Math.max(remainingTime, 0));
    }, [continueGame, cpuIsSettling, bonusIsBlocking])

    const resultIsReady: boolean = !continueGame && !cpuIsSettling && !bonusIsBlocking;
    const [resultIsShown, setResultIsShown] = useState(false);

    useEffect(() => {
        if (!resultIsReady) return;
        const hasWinLine: boolean = blackIsWinner || whiteIsWinner;       //時間切れ・引き分けは光る石がないのですぐ出す
        const showId = setTimeout(() => setResultIsShown(true), hasWinLine ? RESULT_OVERLAY_DELAY : 0);
        return () => clearTimeout(showId);
    }, [resultIsReady, blackIsWinner, whiteIsWinner])

    function handlePlay(nextBoxes: (string | null)[][]): void {
        const nextHistory = [...history.slice(0, currentMove + 1), nextBoxes];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function handlePlayDouble(nextBoxes: (string | null)[][]): void {
        const nextHistory = [...history.slice(0, currentMove + 1), nextBoxes, nextBoxes];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function handleClick(rowNo: number, columnNo: number): void {
        const blackIsNext = checkBlackIsNext(currentMove);
        if (!continueGame) return;
        if (cpuIsSettling) return;
        if (history[currentMove][rowNo][columnNo] || blackIsNext !== playerIsBlack) {//空白のときのみ配置可能
            return;
        }
        handleColor(rowNo, columnNo);
        setRemainingTime((time) => time + timeIncrement);
    }

    function handleColor(firstRowNo: number, firstColumnNo: number, secondRowNo?: number, secondColumnNo?: number): void {
        if (!continueGame) return;
        //const nextBoxes = history[currentMove].slice();
        //参考コードだと1次元行列だったのでシャローコピーでよかったが、ここでは2次元のためディープコピー
        const nextBoxes: Array<(string | null)[]> = JSON.parse(JSON.stringify(history[currentMove]));
        const blackIsNext = checkBlackIsNext(currentMove);
        let color: string;
        if (blackIsNext) color = "b";
        else color = "w";
        nextBoxes[firstRowNo][firstColumnNo] = color;
        if (secondRowNo == undefined || secondColumnNo == undefined) {
            if (blackIsNext === playerIsBlack) rewardCross(nextBoxes, color);
            handlePlay(nextBoxes);
            if (blackIsNext === playerIsBlack) playSound("place");
            else setCpuIsSettling(true);
            return;
        }
        nextBoxes[secondRowNo][secondColumnNo] = color;
        if (blackIsNext === playerIsBlack) rewardCross(nextBoxes, color);
        handlePlayDouble(nextBoxes);
        if (blackIsNext === playerIsBlack) playSound("place");
        else setCpuIsSettling(true);
    }

    function rewardCross(nextBoxes: (string | null)[][], color: string): void {
        if (!hasTimeLimit) return;
        const beforeKeys = new Set(detectCross(history[currentMove], color).map((cross) => crossKey(cross)));
        const newCrosses = detectCross(nextBoxes, color).filter((cross) => !beforeKeys.has(crossKey(cross)));
        const count = newCrosses.length;
        if (count <= 0) return;
        setRemainingTime((time) => time + CROSS_BONUS * count);
        setBonusTime(CROSS_BONUS * count);
        setCrossMoves(newCrosses.flatMap((cross) => crossCells(cross)));
        setBonusIsBlocking(true);
        setBonusNo((no) => no + 1);
        playSound("recovering");
    }

    useEffect(() => {
        if (bonusNo === 0) return;
        const blockId = setTimeout(() => setBonusIsBlocking(false), BONUS_BLOCK_TIME);
        const clearId = setTimeout(() => {
            setBonusTime(0);
            setCrossMoves([]);
        }, BONUS_DISPLAY_TIME);
        return () => {
            clearTimeout(blockId);
            clearTimeout(clearId);
        };
    }, [bonusNo])


    const playerIsThinking: boolean = continueGame && hasTimeLimit && !cpuIsSettling && (checkBlackIsNext(currentMove) === playerIsBlack);
    const [isRuleOpen, setIsRuleOpen] = useState(false);

    useEffect(() => {
        if (!playerIsThinking) return;
        const countStartTime = Date.now();
        const countStartRemaining = remainingTime;
        const timeRate = isRuleOpen ? RULE_TIME_RATE : 1;
        const timerId = setInterval(() => {
            setRemainingTime(countStartRemaining - (Date.now() - countStartTime) * timeRate);
        }, TIMER_INTERVAL);
        return () => clearInterval(timerId);
    }, [playerIsThinking, currentMove, isRuleOpen])

    const lastCountedSecond = useRef(Number.POSITIVE_INFINITY);

    useEffect(() => {
        if (!hasTimeLimit) return;
        const second = Math.ceil(remainingTime / 1000);
        if (second >= lastCountedSecond.current) {      //加算で増えたときは鳴らさず基準だけ更新
            lastCountedSecond.current = second;
            return;
        }
        lastCountedSecond.current = second;
        if (COUNTDOWN_SECONDS.includes(second)) playSound("warning");
    }, [remainingTime])

    //処理時間の計測
    const sumTime = useRef(0);

    useEffect(() => {
        const blackIsNext = checkBlackIsNext(currentMove);
        if (blackIsNext === playerIsBlack) return;
        if (!continueGame) return;
        let worker: Worker | null = null;
        let placeTimerId: ReturnType<typeof setTimeout> | undefined;
        const startTimerId = setTimeout(() => {
            const computingStartTime = Date.now();
            worker = new Worker(new URL("../computers/ComputerWorker.ts", import.meta.url));
            worker.onmessage = (event: MessageEvent<ComputerResponse>) => {
                const result = event.data;
                const time = Date.now() - computingStartTime;
                sumTime.current += time;
                console.log("処理時間:" + printTimer(time) + " 累積時間:" + printTimer(sumTime.current));
                placeTimerId = setTimeout(() => {
                    handleColor(result.firstRowNo, result.firstColumnNo, result.secondRowNo, result.secondColumnNo);
                }, Math.max(COMPUTER_MIN_TIME - time, 0))
            };
            worker.onerror = (event: ErrorEvent) => {
                console.error("CPU思考中にエラー: " + event.message);
            };
            const request: ComputerRequest = { boxes: history[currentMove], currentMove: currentMove, computer: computer };
            worker.postMessage(request);
        }, COMPUTER_START_DELAY)
        return () => {
            clearTimeout(startTimerId);
            clearTimeout(placeTimerId);
            worker?.terminate();
        };
    }, [history, currentMove])

    function jumpTo(nextMove: number) {
        setCpuIsSettling(false);
        setCurrentMove(nextMove);
    }

    const [undoConfirm, setUndoConfirm] = useState<UndoKind | null>(null);
    const shownPenalty: number = (undoConfirm === "reset") ? resetPenalty : undoPenalty;
    const canGoBack: boolean = !hasTimeLimit || remainingTime - undoPenalty > 0;
    const undoShortage: string | null = (undoConfirm === "back" && !canGoBack)
        ? "1手戻すには持ち時間が" + (undoPenalty / 1000) + "秒より多く必要です"
        : null;

    //ポップアップは同時に1つだけ。開くときは他を閉じる
    function openUndoConfirm(kind: UndoKind): void {
        setIsMenuOpen(false);
        setIsRuleOpen(false);
        setUndoConfirm(kind);
    }

    function openRule(): void {
        setIsMenuOpen(false);
        setUndoConfirm(null);
        setIsRuleOpen(true);
    }

    function runUndo(): void {
        if (undoConfirm === null) return;
        if (undoConfirm === "reset") {
            onReset();          //敗北と同じ扱い。
            return;
        }
        if (!canGoBack) return;
        setRemainingTime((time) => time - undoPenalty);
        jumpTo(lastFirstPlayerTurn(currentMove, playerIsBlack));
        setUndoConfirm(null);
    }

    const blackIsNext = checkBlackIsNext(currentMove);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuArea = useRef<HTMLDivElement>(null);

    //勝敗が決まったら、勝敗画面と重ならないように他のポップアップとメニューは表示しない
    const ruleIsShown: boolean = isRuleOpen && continueGame;
    const undoIsShown: boolean = undoConfirm !== null && continueGame;
    const menuIsShown: boolean = isMenuOpen && continueGame;

    useEffect(() => {
        function handleEscapeKey(event: KeyboardEvent): void {
            if (event.key !== "Escape") return;
            if (ruleIsShown) {
                setIsRuleOpen(false);
                return;
            }
            if (undoIsShown) {
                setUndoConfirm(null);
                return;
            }
            if (!continueGame) return;
            setIsMenuOpen((isOpen) => !isOpen);
        }
        document.addEventListener("keydown", handleEscapeKey);
        return () => document.removeEventListener("keydown", handleEscapeKey);
    }, [ruleIsShown, undoIsShown, continueGame])

    useEffect(() => {
        if (!menuIsShown) return;
        function handleOutsideClick(event: MouseEvent): void {
            const target = event.target as HTMLElement;
            const inMenu: boolean = menuArea.current !== null && menuArea.current.contains(target);
            if (inMenu && target.closest("button")) return;     //メニューのボタンは各自の処理に任せる
            if (!inMenu) event.stopPropagation();               //メニューの外のクリックは、閉じるだけで盤面などには届けない
            setIsMenuOpen(false);
        }
        document.addEventListener("click", handleOutsideClick, true);
        return () => document.removeEventListener("click", handleOutsideClick, true);
    }, [menuIsShown])

    const playerStoneColor = playerIsBlack ? "b" : "w";

    const lastMoves = getLastMoves(history, currentMove);
    const markedMoves = lastMoves.filter((move) => history[currentMove][move.rowNo][move.columnNo] !== playerStoneColor);
    const winMoves = ((blackIsWinner || whiteIsWinner) && !cpuIsSettling && !bonusIsBlocking) ? detectWinLine(history[currentMove]) : [];
    const bonusCount: number = bonusTime / CROSS_BONUS;
    const bonusText: string | null = (bonusTime > 0)
        ? (CROSS_BONUS / 1000) + "秒" + (bonusCount > 1 ? " ×" + bonusCount : "")
        : null;

    const pointerColor: (string | null)
        = (continueGame && !cpuIsSettling && (playerIsBlack === blackIsNext)) ? playerStoneColor : null;

    const playerIsActive: boolean = continueGame && !cpuIsSettling && (playerIsBlack === blackIsNext);
    const comBowlState: BowlState = !continueGame ? null : (playerIsActive ? "waiting" : "active");
    const playerBowlState: BowlState = !continueGame ? null : (playerIsActive ? "active" : "waiting");

    return (
        <div className="play-screen">
            <PlayHeader opponentName={computer.name} />
            <div className="play-ground">
                <div className="com-area">
                    <SideBlock side="com" name={computer.name} isBlack={!playerIsBlack} bowlState={comBowlState} />
                </div>
                <div className="board-area">
                    <GameBoard
                        boxes={history[currentMove]}
                        handleClick={handleClick}
                        pointerColor={pointerColor}
                        markedMoves={markedMoves}
                        winMoves={winMoves}
                        crossMoves={crossMoves}
                        bonusText={bonusText}
                        bonusNo={bonusNo}
                    />
                    {blackIsNext !== playerIsBlack && continueGame &&
                        <ComputingMessage />
                    }
                </div>
                <div className="game-info">
                    {hasTimeLimit &&
                        <TimeBar remainingTime={remainingTime} bonusTime={bonusTime} bonusNo={bonusNo} />
                    }
                    <SideBlock side="player" name="あなた" isBlack={playerIsBlack} bowlState={playerBowlState} />
                </div>
            </div>
            <div className="menu-area" ref={menuArea}>
                <button className={"menu-button" + (menuIsShown ? " menu-button-open" : "")}
                    aria-label="メニュー"
                    aria-expanded={menuIsShown}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    disabled={!continueGame}
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    >
                        <path className="menu-line-top" d="M4 7 H20" />
                        <path className="menu-line-middle" d="M4 12 H20" />
                        <path className="menu-line-bottom" d="M4 17 H20" />
                    </svg>
                </button>
                {menuIsShown &&
                    <div className="menu-panel">
                        <button onClick={() => openUndoConfirm("back")}
                            disabled={!continueGame || currentMove === 0}
                        >1つ戻る</button>
                        <button onClick={() => openUndoConfirm("reset")}
                            disabled={!continueGame || currentMove === 0}
                        >最初に戻る</button>
                        <button onClick={() => openRule()}>ルール説明</button>
                    </div>
                }
            </div>
            {ruleIsShown &&
                <RuleScreen onClose={() => setIsRuleOpen(false)} />
            }
            {resultIsShown &&
                <ResultPopup result={gameResult} note={resultNote} buttonLabel={nextLabel} onNext={onNext} />
            }
            {undoIsShown && undoConfirm !== null &&
                <UndoDialog
                    kind={undoConfirm}
                    penalty={hasTimeLimit ? shownPenalty : null}
                    shortage={undoShortage}
                    warning={undoConfirm === "reset" ? resetWarning : null}
                    onConfirm={runUndo}
                    onCancel={() => setUndoConfirm(null)}
                />
            }
        </div >
    );
}

function printTimer(time: number): string {
    const minute = Math.floor((time * 0.001) / 60);
    let minuteString;
    if (minute >= 10) minuteString = String(minute);
    else if (minute > 0) minuteString = "0" + String(minute);
    else minuteString = "00"
    const sec = Math.floor((time * 0.001) % 60);
    let secString;
    if (sec >= 10) secString = String(sec);
    else if (sec > 0) secString = "0" + String(sec);
    else secString = "00"
    const millisec = time - Math.floor(time * 0.001) * 1000;
    let millisecString
    if (millisec >= 100) millisecString = String(millisec);
    else if (millisec >= 10) millisecString = "0" + String(millisec);
    else if (millisec > 0) millisecString = "0" + String(millisec);
    else millisecString = "000"
    return minuteString + ":" + secString + "." + millisecString;
}

function detectStoneChange(before: (string | null)[][], after: (string | null)[][]): MoveCoordinate[] {
    if (before === after) return [];
    if (!(before.length === after.length)) throw new Error("beforeとafterの配列の大きさが異なる");
    const length = before.length;
    const result: MoveCoordinate[] = [];
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < length; j++) {
            if (before[i][j] === after[i][j]) continue;
            const difference = new MoveCoordinate(i, j, undefined);
            result.push(difference);
        }
    }
    if (result.length > 2) throw new Error("変更が多すぎる");
    return result;
}

function getLastMoves(history: (string | null)[][][], currentMove: number): MoveCoordinate[] {
    for (let i = currentMove - 1; i >= 0; i--) {
        if (history[i] === history[currentMove]) continue;
        return detectStoneChange(history[i], history[currentMove]);
    }
    return [];
}

function isFirstPlayerTurn(move: number, playerIsBlack: boolean): boolean {
    return (checkBlackIsNext(move) === playerIsBlack)       //その手番の色と自分の色が一致
        && (                                                //かつ
            checkBlackIsNext(move - 1) !== playerIsBlack    //直前の色は自分とは別の色
            || move === 0                                   //または move===0(1手目)
        );
}

function lastFirstPlayerTurn(move: number, playerIsBlack: boolean): number {
    for (let i = 1; i < move; i++) {
        if (!isFirstPlayerTurn(move - i, playerIsBlack)) continue;
        return move - i;
    }
    return 0;
}