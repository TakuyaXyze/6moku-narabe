"use client";

import { GameBoard } from "./GameBoard";
import "../styles/PlayGround.css"
import "../styles/GameBoard.css"
import "../styles/GameInfo.css"
import { useState, useEffect, useRef } from "react";
import { detectSequence } from "../computers/CountSequence";
import { detectWinLine } from "../computers/DetectWinLine";
import { MoveCoordinate, DoubleMoveCoordinate } from "../computers/Evaluate"
import { computerTurnRandom } from "../computers/PutRandom";
import { computerTurnDepth1Search } from "../computers/PutDepth1Search";
import { computerTurnMinMaxSearch } from "../computers/PutMinMax";
import { computerTurnAlphaBetaSearch } from "../computers/PutAlphaBeta"
import { computerTurnBeamSearch } from "../computers/PutBeam";
import { ClockLoader } from "react-spinners";

export const ROWS = 19;
export const COLUMNS = ROWS;
export let rowNos = new Array<number>;
for (let i = 0; i < ROWS; i++) {
    rowNos.push(i);
}
export let columnNos = new Array<number>;
for (let i = 0; i < COLUMNS; i++) {
    columnNos.push(i);
}
export const SEQUENCE_LENGTH = 6; //MAX6

const TIMER_INTERVAL = 100;
const TIME_BAR_FULL = 60000;
const TIME_BAR_YELLOW_RATIO = 0.4;
const TIME_BAR_RED_RATIO = 0.2;
const COUNTDOWN_TIME = 10000;
const COUNTDOWN_SECONDS = [10, 5, 4, 3, 2, 1];

type Props = {
    playerIsBlack: boolean;
    gameMode: string;
    stageLabel: string;
    initialTime: number;
    timeIncrement: number;
    nextLabel: string;
    onGameEnd: (playerWins: boolean, restTime: number) => void;
    onNext: () => void;
}

export function PlayGround({ playerIsBlack, gameMode, stageLabel, initialTime, timeIncrement, nextLabel, onGameEnd, onNext }: Props) {

    const [history, setHistory] = useState([Array(ROWS).fill(null).map(() => Array<(string | null)>(COLUMNS).fill(null))]);
    const [currentMove, setCurrentMove] = useState(0);
    const blackSequence: number[] = detectSequence(history[currentMove], "b");
    const whiteSequence: number[] = detectSequence(history[currentMove], "w");
    const blackIsWinner: boolean = blackSequence[SEQUENCE_LENGTH - 2] > 0;
    const whiteIsWinner: boolean = whiteSequence[SEQUENCE_LENGTH - 2] > 0;
    const [remainingTime, setRemainingTime] = useState(initialTime);
    const hasTimeLimit: boolean = Number.isFinite(initialTime);
    const timeIsUp: boolean = hasTimeLimit && remainingTime <= 0;
    const isDraw: boolean = !blackIsWinner && !whiteIsWinner && !timeIsUp && currentMove === ROWS * COLUMNS;
    const continueGame: boolean = !blackIsWinner && !whiteIsWinner && !isDraw && !timeIsUp;
    const playerWins: boolean = !isDraw && !timeIsUp && (blackIsWinner === playerIsBlack);

    useEffect(() => {
        if (continueGame) return;
        if (timeIsUp) timeupSound();
        else if (blackIsWinner || whiteIsWinner) winSound();
        onGameEnd(playerWins, remainingTime);
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
            handlePlay(nextBoxes);
            stonePlaceSound();
            return;
        }
        nextBoxes[secondRowNo][secondColumnNo] = color;
        handlePlayDouble(nextBoxes);
        stonePlaceSound();
    }


    const playerIsThinking: boolean = continueGame && hasTimeLimit && (checkBlackIsNext(currentMove) === playerIsBlack);

    useEffect(() => {
        if (!playerIsThinking) return;
        const countStartTime = Date.now();
        const countStartRemaining = remainingTime;
        const timerId = setInterval(() => {
            setRemainingTime(Math.max(countStartRemaining - (Date.now() - countStartTime), 0));
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
        setTimeout(() => {
            const computingStartTime = Date.now();
            computerTurn();
            const time = Date.now() - computingStartTime;
            sumTime.current += time;
            console.log("処理時間:" + printTimer(time) + " 累積時間:" + printTimer(sumTime.current));
        }, 300)
    }, [history, currentMove])

    function computerTurn(): void {

        if (currentMove === 0) {
            computerTurnWithResult(computerTurnRandom(history[currentMove], currentMove));
            return;
        }

        switch (gameMode) {
            case "Random"://先ほどのpushでここを誤って"Random-depth"としたら、それ以降修正をpushしてもvercelが更新されない
                computerTurnWithResult(computerTurnRandom(history[currentMove], currentMove));
                break;
            case "Depth1Search":
                computerTurnWithResult(computerTurnDepth1Search(history[currentMove], currentMove));
                break;
            case "MinMax-depth3":
                computerTurnWithResult(computerTurnMinMaxSearch(history[currentMove], currentMove, 3));
                break;
            case "MinMax-depth6":
                computerTurnWithResult(computerTurnMinMaxSearch(history[currentMove], currentMove, 6));
                break;
            case "AlphaBeta-depth3":
                computerTurnWithResult(computerTurnAlphaBetaSearch(history[currentMove], currentMove, 3));
                break;
            case "AlphaBeta-depth6":
                computerTurnWithResult(computerTurnAlphaBetaSearch(history[currentMove], currentMove, 6));
                break;
            case "Beam-depth4":
                computerTurnWithDoubleResult(computerTurnBeamSearch(history[currentMove], currentMove, 10, 4));
                break;//引数_3は、ビームサーチで次の深度に持ち出す場合の数。上位n個のみが次の深度について検証される
            case "Beam-depth6":
                computerTurnWithDoubleResult(computerTurnBeamSearch(history[currentMove], currentMove, 10, 6));
                break;//引数_3は、ビームサーチで次の深度に持ち出す場合の数。上位n個のみが次の深度について検証される
            default:
                throw new Error("GameModeが指定されていません");
        }
    }

    function computerTurnWithResult(result: MoveCoordinate) {
        handleColor(result.rowNo, result.columnNo);
    }

    function computerTurnWithDoubleResult(result: DoubleMoveCoordinate) {
        handleColor(result.firstRowNo, result.firstColumnNo, result.secondRowNo, result.secondColumnNo);
    }

    function jumpTo(nextMove: number) {
        setCurrentMove(nextMove);
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

    const playerStoneColor = playerIsBlack ? "b" : "w";

    const lastMoves = getLastMoves(history, currentMove);
    const markedMoves = lastMoves.filter((move) => history[currentMove][move.rowNo][move.columnNo] !== playerStoneColor);
    const winMoves = (blackIsWinner || whiteIsWinner) ? detectWinLine(history[currentMove]) : [];

    const thisTurnColor = (continueGame ? 'Next Player:' + (blackIsNext ? 'black' : 'white') : result);

    const timeBarRatio: number = Math.min(remainingTime / TIME_BAR_FULL, 1);
    const timeBarColor: string = (timeBarRatio >= TIME_BAR_YELLOW_RATIO) ? "time-bar-green"
        : ((timeBarRatio >= TIME_BAR_RED_RATIO) ? "time-bar-yellow" : "time-bar-red");
    const isHurrying: boolean = remainingTime <= COUNTDOWN_TIME;
    const timeCount: string = isHurrying ? (remainingTime / 1000).toFixed(1) : String(Math.ceil(remainingTime / 1000));

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
                <div className="status">
                    <ClockLoader className="loader"
                        loading={blackIsNext !== playerIsBlack && continueGame}
                        size={24}
                        color="#539fed"
                    />
                </div>
                {hasTimeLimit &&
                    <div className="remaining-time">
                        <div className="time-bar">
                            <div className={"time-bar-fill " + timeBarColor}
                                style={{ width: (timeBarRatio * 100) + "%" }}
                            />
                        </div>
                        <div className={isHurrying ? "time-count time-count-hurry" : "time-count"}>{timeCount}</div>
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
            <div className="menu-area">
                <button className="menu-button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >☰</button>
                {isMenuOpen &&
                    <div className="menu-panel">
                        <div className="gamemode">GameMode: {gameMode}</div>
                        <button onClick={() => jumpTo(lastFirstPlayerTurn(currentMove, playerIsBlack))}
                            disabled={pointerColor === null || currentMove === 0}
                        >1つ戻る</button>
                        <button onClick={() => jumpTo(0)}
                            disabled={pointerColor === null || currentMove === 0}
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
        </div >
    );
}

export function checkBlackIsNext(currentMove: number): boolean {
    /*
    0 void  next black true
    1 black next white false
    2 white next white false
    3 white next black true
    4 black next black true
    5 black next white false
    6 white next white false
    7 white next black true
    8 black next black true
    9 black next white false
    */
    if (currentMove % 4 === 0 || currentMove % 4 === 3) {
        return true;
    } else {
        return false;
    }
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