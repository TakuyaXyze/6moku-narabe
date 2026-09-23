"use client";

import { GameBoard } from "./GameBoard";
import "../styles/PlayGround.css"
import "../styles/GameBoard.css"
import "../styles/GameInfo.css"
import { useState, useEffect, useRef } from "react";
import { detectSequence } from "../computers/CountSequence";
import { detectWinLine } from "../computers/DetectWinLine";
import { detectCross } from "../computers/DetectCross";
import { MoveCoordinate } from "../computers/Evaluate"
import { ComputerSetting } from "../computers/ComputerSetting";
import type { ComputerRequest, ComputerResponse } from "../computers/ComputerWorker";
import { ROWS, COLUMNS, SEQUENCE_LENGTH, checkBlackIsNext } from "../computers/GameRule";

export let rowNos = new Array<number>;
for (let i = 0; i < ROWS; i++) {
    rowNos.push(i);
}
export let columnNos = new Array<number>;
for (let i = 0; i < COLUMNS; i++) {
    columnNos.push(i);
}

const TIMER_INTERVAL = 100;
const TIME_BAR_FULL = 60000;
const TIME_BAR_YELLOW_RATIO = 0.4;
const TIME_BAR_RED_RATIO = 0.2;
const COUNTDOWN_TIME = 10000;
const COUNTDOWN_SECONDS = [10, 5, 4, 3, 2, 1];
const COMPUTER_START_DELAY = 300;
const COMPUTER_MIN_TIME = 1500;
const CROSS_BONUS = 3000;
const BONUS_DISPLAY_TIME = 1500;
const UNDO_PENALTY = 5000;

type UndoKind = "back" | "reset" | null;

type Props = {
    playerIsBlack: boolean;
    computer: ComputerSetting;
    stageLabel: string;
    initialTime: number;
    timeIncrement: number;
    nextLabel: string;
    onGameEnd: (playerWins: boolean, restTime: number) => void;
    onNext: () => void;
}

export function PlayGround({ playerIsBlack, computer, stageLabel, initialTime, timeIncrement, nextLabel, onGameEnd, onNext }: Props) {

    const [history, setHistory] = useState([Array(ROWS).fill(null).map(() => Array<(string | null)>(COLUMNS).fill(null))]);
    const [currentMove, setCurrentMove] = useState(0);
    const blackSequence: number[] = detectSequence(history[currentMove], "b");
    const whiteSequence: number[] = detectSequence(history[currentMove], "w");
    const blackIsWinner: boolean = blackSequence[SEQUENCE_LENGTH - 2] > 0;
    const whiteIsWinner: boolean = whiteSequence[SEQUENCE_LENGTH - 2] > 0;
    const [remainingTime, setRemainingTime] = useState(initialTime);
    const hasTimeLimit: boolean = Number.isFinite(initialTime);
    const timeIsUp: boolean = hasTimeLimit && remainingTime < 0 && !blackIsWinner && !whiteIsWinner;
    const isDraw: boolean = !blackIsWinner && !whiteIsWinner && !timeIsUp && currentMove === ROWS * COLUMNS;
    const continueGame: boolean = !blackIsWinner && !whiteIsWinner && !isDraw && !timeIsUp;
    const playerWins: boolean = !isDraw && !timeIsUp && (blackIsWinner === playerIsBlack);

    useEffect(() => {
        if (continueGame) return;
        if (timeIsUp) timeupSound();
        else if (blackIsWinner || whiteIsWinner) winSound();
        onGameEnd(playerWins, Math.max(remainingTime, 0));
    }, [continueGame])

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
            stonePlaceSound();
            return;
        }
        nextBoxes[secondRowNo][secondColumnNo] = color;
        if (blackIsNext === playerIsBlack) rewardCross(nextBoxes, color);
        handlePlayDouble(nextBoxes);
        stonePlaceSound();
    }

    const [bonusTime, setBonusTime] = useState(0);

    function rewardCross(nextBoxes: (string | null)[][], color: string): void {
        if (!hasTimeLimit) return;
        const count = detectCross(nextBoxes, color).length - detectCross(history[currentMove], color).length;
        if (count <= 0) return;
        setRemainingTime((time) => time + CROSS_BONUS * count);
        setBonusTime(CROSS_BONUS * count);
        recoveringSound();
    }

    useEffect(() => {
        if (bonusTime === 0) return;
        const timerId = setTimeout(() => setBonusTime(0), BONUS_DISPLAY_TIME);
        return () => clearTimeout(timerId);
    }, [bonusTime])


    const playerIsThinking: boolean = continueGame && hasTimeLimit && (checkBlackIsNext(currentMove) === playerIsBlack);

    useEffect(() => {
        if (!playerIsThinking) return;
        const countStartTime = Date.now();
        const countStartRemaining = remainingTime;
        const timerId = setInterval(() => {
            setRemainingTime(countStartRemaining - (Date.now() - countStartTime));
        }, TIMER_INTERVAL);
        return () => clearInterval(timerId);
    }, [playerIsThinking, currentMove])

    const lastCountedSecond = useRef(Number.POSITIVE_INFINITY);

    useEffect(() => {
        if (!hasTimeLimit) return;
        const second = Math.ceil(remainingTime / 1000);
        if (second >= lastCountedSecond.current) {      //加算で増えたときは鳴らさず基準だけ更新
            lastCountedSecond.current = second;
            return;
        }
        lastCountedSecond.current = second;
        if (COUNTDOWN_SECONDS.includes(second)) warningSound();
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
        setCurrentMove(nextMove);
    }

    const [undoConfirm, setUndoConfirm] = useState<UndoKind>(null);

    function openUndoConfirm(kind: UndoKind): void {
        setIsMenuOpen(false);
        setUndoConfirm(kind);
    }

    function runUndo(): void {
        if (undoConfirm === null) return;
        const nextMove = (undoConfirm === "reset") ? 0 : lastFirstPlayerTurn(currentMove, playerIsBlack);
        setRemainingTime((time) => Math.max(time - UNDO_PENALTY, 0));
        jumpTo(nextMove);
        setUndoConfirm(null);
    }

    let result;
    if (blackIsWinner) {
        result = 'Winner: black';
    } else if (whiteIsWinner) {
        result = 'Winner: white';
    } else if (timeIsUp) {
        result = "time up";
    } else if (isDraw) {
        result = "draw";
    }

    const blackIsNext = checkBlackIsNext(currentMove);

    function printTimer(time: number): string {
        let word: string;
        let minute = Math.floor((time * 0.001) / 60);
        let minuteString;
        if (minute >= 10) minuteString = String(minute);
        else if (minute > 0) minuteString = "0" + String(minute);
        else minuteString = "00"
        let sec = Math.floor((time * 0.001) % 60);
        let secString;
        if (sec >= 10) secString = String(sec);
        else if (sec > 0) secString = "0" + String(sec);
        else secString = "00"
        let millisec = time - Math.floor(time * 0.001) * 1000;
        let millisecString
        if (millisec >= 100) millisecString = String(millisec);
        else if (millisec >= 10) millisecString = "0" + String(millisec);
        else if (millisec > 0) millisecString = "0" + String(millisec);
        else millisecString = "000"
        word = minuteString + ":" + secString + "." + millisecString;
        return word;
    }
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isRuleOpen, setIsRuleOpen] = useState(false);
    const menuArea = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleEscapeKey(event: KeyboardEvent): void {
            if (event.key !== "Escape") return;
            if (isRuleOpen) {
                setIsRuleOpen(false);
                return;
            }
            setIsMenuOpen((isOpen) => !isOpen);
        }
        document.addEventListener("keydown", handleEscapeKey);
        return () => document.removeEventListener("keydown", handleEscapeKey);
    }, [isRuleOpen])

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

    const playerStoneColor = playerIsBlack ? "b" : "w";

    const lastMoves = getLastMoves(history, currentMove);
    const markedMoves = lastMoves.filter((move) => history[currentMove][move.rowNo][move.columnNo] !== playerStoneColor);
    const winMoves = (blackIsWinner || whiteIsWinner) ? detectWinLine(history[currentMove]) : [];

    const thisTurnColor = (continueGame ? 'Next Player:' + (blackIsNext ? 'black' : 'white') : result);

    const shownTime: number = Math.max(remainingTime, 0);
    const timeBarRatio: number = Math.min(shownTime / TIME_BAR_FULL, 1);
    const timeBarColor: string = (timeBarRatio >= TIME_BAR_YELLOW_RATIO) ? "time-bar-green"
        : ((timeBarRatio >= TIME_BAR_RED_RATIO) ? "time-bar-yellow" : "time-bar-red");
    const isHurrying: boolean = shownTime <= COUNTDOWN_TIME;
    const timeCount: string = isHurrying ? (shownTime / 1000).toFixed(1) : String(Math.ceil(shownTime / 1000));

    const pointerColor: (string | null)
        = (continueGame && (playerIsBlack === blackIsNext)) ? playerStoneColor : null;

    return (
        <div className="play-ground">
            <div className="goishi-box-image-com">
                {(playerIsBlack) &&
                    <img src="goke-white.png"
                        alt="white"
                        width="96"
                    />
                }
                {(!playerIsBlack) &&
                    <img src="goke-black.png"
                        alt="black"
                        width="96"
                    />
                }
            </div>
            <div className="board-area">
                <div className="turn-display">{thisTurnColor}</div>
                <GameBoard
                    boxes={history[currentMove]}
                    handleClick={handleClick}
                    pointerColor={pointerColor}
                    markedMoves={markedMoves}
                    winMoves={winMoves}
                />
                {blackIsNext !== playerIsBlack && continueGame &&
                    <div className="computing-message">CPU考え中</div>
                }
                {!continueGame &&
                    <div className="game-result">
                        <div className="game-result-text">{timeIsUp ? "TIME UP" : (playerWins ? "WIN" : "LOSE")}</div>
                        <button className="game-result-button"
                            onClick={() => onNext()}
                        >{nextLabel}</button>
                    </div>
                }
            </div>
            <div className="game-info">
                <div>Stage:{stageLabel}</div>
                {hasTimeLimit &&
                    <div className="remaining-time">
                        <div className="time-bar">
                            <div className={"time-bar-fill " + timeBarColor}
                                style={{ width: (timeBarRatio * 100) + "%" }}
                            />
                        </div>
                        <div className={isHurrying ? "time-count time-count-hurry" : "time-count"}>{timeCount}</div>
                        {bonusTime > 0 &&
                            <div className="time-bonus">+{bonusTime / 1000}</div>
                        }
                    </div>
                }
                <div className="goishi-box-image-player">
                    {(!playerIsBlack) &&
                        <img src="goke-white.png"
                            alt="white"
                            width="96"
                        />
                    }
                    {(playerIsBlack) &&
                        <img src="goke-black.png"
                            alt="black"
                            width="96"
                        />
                    }
                </div>
            </div>
            <div className="menu-area" ref={menuArea}>
                <button className="menu-button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >☰</button>
                {isMenuOpen &&
                    <div className="menu-panel">
                        <div className="gamemode">相手: {computer.name}</div>
                        <button onClick={() => openUndoConfirm("back")}
                            disabled={!continueGame || currentMove === 0}
                        >1つ戻る</button>
                        <button onClick={() => openUndoConfirm("reset")}
                            disabled={!continueGame || currentMove === 0}
                        >最初に戻る</button>
                        <button onClick={() => setIsRuleOpen(true)}>ルール説明</button>
                    </div>
                }
            </div>
            {isRuleOpen &&
                <div className="rule-screen">
                    <div className="rule-panel">
                        <div className="rule-title">ルール</div>
                        <ul>
                            <li>先に石を6つ直線に並べた方が勝ち。縦・横・斜めのどれでもよい</li>
                            <li>手番は1手・2手・2手・2手…と進む。最初の1手だけ1つ、それ以降はどちらも2つずつ置く</li>
                            <li>石は空いている交点ならどこにでも置ける。取ったり動かしたりはしない</li>
                            <li>持ち時間は自分の手番でだけ減る。相手が考えている間は減らない</li>
                            <li>石を1つ置くごとに持ち時間が少し増える</li>
                            <li>持ち時間が尽きたら負け</li>
                        </ul>
                        <button onClick={() => setIsRuleOpen(false)}>閉じる</button>
                    </div>
                </div>
            }
            {undoConfirm !== null && continueGame &&
                <div className="rule-screen">
                    <div className="rule-panel undo-panel">
                        <div className="undo-message">
                            {(undoConfirm === "reset") ? "盤面をリセットしますか?" : "1つ前の自分の手番まで戻しますか?"}
                        </div>
                        {hasTimeLimit &&
                            <div className="undo-note">制限時間が5秒減ります</div>
                        }
                        <div className="undo-buttons">
                            <button onClick={() => runUndo()}>戻す</button>
                            <button onClick={() => setUndoConfirm(null)}>やめる</button>
                        </div>
                    </div>
                </div>
            }
        </div >
    );
}

function detectStoneChange(before: (string | null)[][], after: (string | null)[][]): MoveCoordinate[] {
    if (before === after) return [];
    if (!(before.length === after.length)) throw new Error("beforeとafterの配列の大きさが異なる");
    const length = before.length;
    const result: MoveCoordinate[] = [];
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < length; j++) {
            if (before[i][j] === after[i][j]) continue;
            let difference = new MoveCoordinate(i, j, undefined);
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

function stonePlaceSound(): void {
    const sound = new Audio("/sounds/place-stone.mp3");
    sound.volume = 0.8;
    sound.play().catch((error) => console.log("SE再生に失敗:", error));
}

function warningSound(): void {
    const sound = new Audio("/sounds/warning-single.mp3");
    sound.volume = 0.8;
    sound.play().catch((error) => console.log("SE再生に失敗:", error));
}

function winSound(): void {
    const sound = new Audio("/sounds/win.mp3");
    sound.volume = 0.8;
    sound.play().catch((error) => console.log("SE再生に失敗:", error));
}

function recoveringSound(): void {
    const sound = new Audio("/sounds/recovering.mp3");
    sound.volume = 0.8;
    sound.play().catch((error) => console.log("SE再生に失敗:", error));
}

function timeupSound(): void {
    const sound = new Audio("/sounds/timeup.mp3");
    sound.volume = 0.8;
    sound.play().catch((error) => console.log("SE再生に失敗:", error));
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