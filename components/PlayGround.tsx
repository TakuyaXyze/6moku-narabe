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
    const [currentGameMode, setcurrentGameMode] = useState("Beam");

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

    useEffect(() => {
        const blackIsNext = checkBlackIsNext(currentMove);
        if (blackIsNext) return;
        if (detectSequence(history[currentMove], "b")[SEQUENCE_LENGTH - 2] > 0) return;
        if (detectSequence(history[currentMove], "w")[SEQUENCE_LENGTH - 2] > 0) return;
        setTimeout(() => { computerTurn() }, 100)
    }, [history])

    //処理時間の計測
    //const [computingStartTime, setComputingStartTime] = useState(Date.now)
    //const [computingTime, setComputingTime] = useState(0)

    function computerTurn(): void {
        //setComputingStartTime(Date.now);
        switch (currentGameMode) {
            case "Random":
                computerTurnWithResult(computerTurnRandom(history[currentMove], currentMove));
                break;
            case "Depth1Search":
                computerTurnWithResult(computerTurnDepth1Search(history[currentMove], currentMove));
                break;
            case "MinMax3":
                computerTurnWithResult(computerTurnMinMaxSearch(history[currentMove], currentMove, 3));
                break;
            case "MinMax6":
                computerTurnWithResult(computerTurnMinMaxSearch(history[currentMove], currentMove, 6));
                break;
            case "AlphaBeta3":
                computerTurnWithResult(computerTurnAlphaBetaSearch(history[currentMove], currentMove, 3));
                break;
            case "AlphaBeta6":
                computerTurnWithResult(computerTurnAlphaBetaSearch(history[currentMove], currentMove, 6));
                break;
            case "Beam":
                computerTurnWithDoubleResult(computerTurnBeamSearch(history[currentMove], currentMove, 4));
                break;
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
        const blackIsNext = checkBlackIsNext(currentMove);
        if (blackIsNext) return;
        if (detectSequence(history[currentMove], "b")[SEQUENCE_LENGTH - 2] > 0) return;
        if (detectSequence(history[currentMove], "w")[SEQUENCE_LENGTH - 2] > 0) return;
        computerTurn();
    }

    const moves = history.map((boxes: (string | null)[][], move: number) => {
        let description;
        if (move > 0) {
            description = 'Go to move #' + move;
        } else {
            description = 'Go to game start';
        }
        return (
            <button key={move} onClick={() => jumpTo(move)}>{description}</button>
        );
    });

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

    return (
        <div className="play-ground">
            <GameBoard boxes={history[currentMove]} handleClick={handleClick} />
            <div className="game-info">
                <div className="status">{status}</div>
                <ol className="move-info">{moves}</ol>
                <div>Mode:{currentGameMode}</div>
                <SelectGameMode handleGameMode={handleGameMode} />
            </div>
        </div >
    );
}

export function checkBlackIsNext(currentMove: number): boolean {
    /*
    0 void  next black true
    1 black next white false
    2 white next black true
    3 black next black true
    4 black next white false
    5 white next white false
    6 white next black true
    7 black next black true
    8 black next white false
    9 white next white false
    */
    if (currentMove === 0) {
        return true;
    } else if (currentMove % 4 === 2 || currentMove % 4 === 3) {
        return true;
    } else {
        return false;
    }
}