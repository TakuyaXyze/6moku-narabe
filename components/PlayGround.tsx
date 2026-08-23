"use client";

import { GameBoard } from "./GameBoard";
import { SelectGameMode } from "./SelectGameMode"
import "../styles/PlayGround.css"
import "../styles/GameBoard.css"
import "../styles/GameInfo.css"
import { useState, useEffect } from "react";
import { detectSequence } from "../computers/CountSequence";
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

export function PlayGround() {

    const [history, setHistory] = useState([Array(ROWS).fill(null).map(() => Array<(string | null)>(COLUMNS).fill(null))]);
    const [currentMove, setCurrentMove] = useState(0);
    const [currentGameMode, setcurrentGameMode] = useState("Beam-depth4");

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
        if (history[currentMove][rowNo][columnNo] || !blackIsNext) {//空白のときのみ配置可能
            return;
        }
        handleColor(rowNo, columnNo);
    }

    function handleColor(firstRowNo: number, firstColumnNo: number, secondRowNo?: number, secondColumnNo?: number): void {
        if (detectSequence(history[currentMove], "b")[SEQUENCE_LENGTH - 2] > 0) return;
        if (detectSequence(history[currentMove], "w")[SEQUENCE_LENGTH - 2] > 0) return;
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
            return;
        }
        nextBoxes[secondRowNo][secondColumnNo] = color;
        handlePlayDouble(nextBoxes);
    }


    //処理時間の計測
    const [computingTime, setComputingTime] = useState(0);
    const [sumTime, setSumTime] = useState(0);

    useEffect(() => {
        const blackIsNext = checkBlackIsNext(currentMove);
        if (blackIsNext) return;
        if (detectSequence(history[currentMove], "b")[SEQUENCE_LENGTH - 2] > 0) return;
        if (detectSequence(history[currentMove], "w")[SEQUENCE_LENGTH - 2] > 0) return;
        setTimeout(() => {
            const computingStartTime = Date.now();
            computerTurn();
            const time = Date.now() - computingStartTime;
            setComputingTime(time);
            setSumTime(a => a + time);
        }, 300)
    }, [history, currentMove])

    function computerTurn(): void {

        switch (currentGameMode) {
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

    function handleGameMode(gameMode: string) {
        setcurrentGameMode(gameMode);
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

    let status;
    if (detectSequence(history[currentMove], "b")[SEQUENCE_LENGTH - 2] > 0) {
        status = 'Winner: black';
    } else if (detectSequence(history[currentMove], "w")[SEQUENCE_LENGTH - 2] > 0) {
        status = 'Winner: white';
    } else if (currentMove === ROWS * COLUMNS) {
        status = "draw";
    } else {
        status = 'Next player: ' + (checkBlackIsNext(currentMove) ? 'black' : 'white');
    }

    const blackIsNext = checkBlackIsNext(currentMove);

    const moves = history.map((boxes: (string | null)[][], move: number) => {

        const moveBlackIsNext = checkBlackIsNext(move);
        const moveBlackIsThisTurn = checkBlackIsNext(move - 1);

        let isHoveredOnButton = false;

        function setIsHoveredOnButton(boolean: boolean) {
            isHoveredOnButton = boolean;
        }

        if (move == 0) {
            return (
                <button key={move}
                    onClick={() => jumpTo(move)}
                    disabled={!blackIsNext}
                >Go to game start</button>
            );
        } else if (move === history.length - 1) return;
        else if (!moveBlackIsNext && !moveBlackIsThisTurn) {
            return (
                <button key={move}
                    onClick={() => jumpTo(move - 1)}
                    disabled={!blackIsNext}
                >Go to move # {move}</button>
            );
        }
        else {
            return (
                <button key={move}
                    onClick={() => jumpTo(move)}
                    disabled={!blackIsNext}
                >Go to move # {move}</button>
            );
        }

    });

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
        else if (millisec >= 10) millisecString = "00" + String(millisec);
        else if (millisec > 0) millisecString = "0" + String(millisec);
        else millisecString = "000"
        word = minuteString + ":" + secString + "." + millisecString;
        return word;
    }
    let printComputingTime = printTimer(computingTime);
    let printSumTime = printTimer(sumTime);

    const [isInforming, setIsInforming] = useState(false);

    return (
        <div className="play-ground">
            <GameBoard boxes={history[currentMove]} handleClick={handleClick} />
            <div className="game-info">
                <div>GameMode: {currentGameMode}</div>
                <SelectGameMode handleGameMode={handleGameMode} />
                <div className="status">
                    {status}
                    <ClockLoader className="loader" loading={!blackIsNext} size={24} color="#539fed" />
                </div>
                <div className="computing-time">
                    <div>処理時間: {printComputingTime} s</div>
                    <div>累積時間: {printSumTime} s</div>
                </div>
                <div className="moves-button-info">
                    <img src="information.png"
                        alt="i"
                        width="16"
                        onMouseEnter={() => setIsInforming(true)}
                        onMouseLeave={() => setIsInforming(false)}
                    />
                    {isInforming && (
                        <div className="information">
                            <ul>
                                <li>過去の手番に巻き戻し</li>
                                <li>自分の手番時 もう一度打ち直し</li>
                                <li>相手の手番時 2手同時自動打ち直し</li>
                            </ul>
                        </div>
                    )}
                </div>
                <ol className="move-info">{moves}</ol>
            </div>
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