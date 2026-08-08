"use client";

import { GameBoard } from "./GameBoard";
import { SelectGameMode } from "./SelectGameMode"
import "../styles/PlayGround.css"
import "../styles/GameBoard.css"
import { useState, useEffect } from "react";
import { MoveCoordinate } from "../computers/MoveCoordinate"
import { computerTurnRandom } from "../computers/PutRandom";
import { computerTurnDepth1Search } from "../computers/PutDepth1Search";
import { computerTurnMinMaxSearch } from "../computers/PutMinMax";
import { computerTurnAlphaBetaSearch } from "../computers/PutAlphaBeta"

export const ROWS = 19;
export const COLUMNS = 19;

export function PlayGround() {

    const [history, setHistory] = useState([Array(ROWS).fill(null).map(() => Array(COLUMNS).fill(null))]);
    const [currentMove, setCurrentMove] = useState(0);
    const currentBoxes: string[][] = history[currentMove];
    const [blackIsNext, setBlackIsNext] = useState(true);
    const [currentModeNumber, setCurrentModeNumber] = useState(0);

    function handlePlay(nextBoxes: string[][]): void {
        const nextHistory = [...history.slice(0, currentMove + 1), nextBoxes];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        const booleanBlackIsNext = checkBlackIsNext(currentMove);
        setBlackIsNext(booleanBlackIsNext);
    }

    function handleClick(rowNo: number, columnNo: number): void {
        if (currentBoxes[rowNo][columnNo] || !blackIsNext) {//空白のときのみ配置可能
            return;
        }
        handleColor(rowNo, columnNo);
    }

    function handleColor(rowNo: number, columnNo: number) {
        if (calculate6(currentBoxes)) return;
        const nextBoxes = currentBoxes.slice();
        if (blackIsNext) {//2手ずつ進むように変更するために後程変更予定
            nextBoxes[rowNo][columnNo] = "b";
        } else {
            nextBoxes[rowNo][columnNo] = "w";
        }
        console.log(nextBoxes);
        handlePlay(nextBoxes);
    }

    useEffect(() => {
        if (!blackIsNext) {
            console.log("computerTurn");
            computerTurn();
        }
        return
    }, [currentBoxes])

    function handleGameMode(i: number) {
        setCurrentModeNumber(i);
        console.log("handleGameMode-currentModeNumber:" + currentModeNumber);
    }

    let currentGameMode: string = "Random";

    function switchDisplayGameMode(i: number): string {
        const imputNo = i;
        let word;
        switch (imputNo) {
            case 0:
                word = "Random";
                break;
            case 1:
                word = "Depth1Search";
                break;
            case 2:
                word = "MinMax-depth3";
                break;
            case 3:
                word = "MinMax-depth6";
                break;
            /*case 4:
                word = "AlphaBeta";
                break;*/
            default:
                word = "Random";
                break;
        }
        return word;
    }

    useEffect(() => {
        currentGameMode = switchDisplayGameMode(currentModeNumber);
        console.log("switchDisplayGameMode to " + currentGameMode);
    }, [currentModeNumber]);

    //処理時間の計測
    //const [computingStartTime, setComputingStartTime] = useState(Date.now)
    //const [computingTime, setComputingTime] = useState(0)

    function computerTurn(): void {
        //setComputingStartTime(Date.now);
        //将来的に難易度選択・モード選択とかがあったらここに書く
        /*switch (currentModeNumber) {
            case 0:
                computerTurnWithResult(computerTurnRandom(currentBoxes));
            case 1:
                computerTurnWithResult(computerTurnDepth1Search(currentBoxes, blackIsNext, currentMove));
            case 2:
                computerTurnWithResult(computerTurnMinMaxSearch(currentBoxes, blackIsNext, currentMove, 3));
            case 3:
                computerTurnWithResult(computerTurnMinMaxSearch(currentBoxes, blackIsNext, currentMove, 6));
            case 4:
                computerTurnWithResult(computerTurnAlphaBetaSearch(currentBoxes, blackIsNext, currentMove, 3));
            case 5:
                computerTurnWithResult(computerTurnAlphaBetaSearch(currentBoxes, blackIsNext, currentMove, 6));
        }*/
        //computerTurnWithResult(computerTurnRandom(currentBoxes));
        //computerTurnWithResult(computerTurnDepth1Search(currentBoxes, blackIsNext, currentMove));
        //computerTurnWithResult(computerTurnMinMaxSearch(currentBoxes, blackIsNext, currentMove, 3));
        computerTurnWithResult(computerTurnAlphaBetaSearch(currentBoxes, blackIsNext, currentMove, 3));
    }

    function computerTurnWithResult(result: (MoveCoordinate | null)) {
        if (result == null) {
            console.log("computerTurnMinMaxSearch()からの戻り値がnull")
            return;
        };
        handleColor(result.rowNo, result.columnNo);
    }

    function jumpTo(nextMove: number) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((boxes: string[][], move: number) => {
        let description;
        if (move > 0) {
            description = 'Go to move #' + move;
        } else {
            description = 'Go to game start';
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    const winner = calculate6(currentBoxes);
    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else {
        status = 'Next player: ' + (blackIsNext ? 'black' : 'white');
    }

    /*return (
        <div className="play-ground">
            <div>
                <GameBoard blackIsNext={blackIsNext} boxes={currentBoxes} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <div className="status">{status}</div>
                <ol>{moves}</ol>
            </div>
        </div>
    );*/
    return (
        <div className="play-ground">
            <div>
                <GameBoard blackIsNext={blackIsNext} boxes={currentBoxes} handleClick={handleClick} />
            </div>
            <div className="game-info">
                <div className="status">{status}</div>
                <div>Mode:{currentGameMode}</div>
                <SelectGameMode handleGameMode={handleGameMode} />
            </div>
        </div>
    );
}

export function checkBlackIsNext(currentMove: number): boolean {
    if (currentMove === 0) {
        return false;
    } else if (currentMove % 4 === 1 || currentMove % 4 === 2) {
        return true;
    } else {
        return false;
    }
}

export function calculate6(boxes: (string | null)[][]) {
    for (let i = 0; i < 19; i++) { //横1列
        const row = boxes[i];
        for (let j = 0; j < 19; j++) {
            if (row[j] && row[j] === row[j + 1] && row[j] === row[j + 2] && row[j] === row[j + 3] && row[j] === row[j + 4] && row[j] === row[j + 5]) {
                return row[j];
            }
        }
    }
    const transpose = (boxes: (string | null)[][]) => boxes[0].map((_, c) => boxes.map(r => r[c]));//転置
    for (let i = 0; i < 19; i++) { //縦1列
        const column = transpose(boxes)[i];
        for (let j = 0; j < 19; j++) {
            if (column[j] && column[j] === column[j + 1] && column[j] === column[j + 2] && column[j] === column[j + 3] && column[j] === column[j + 4] && column[j] === column[j + 5]) {
                return column[j];
            }
        }
    }
    for (let i = 0; i < 14; i++) { //左上右下斜め1列
        for (let j = 0; j < 14; j++) {
            if (boxes[i][j] && boxes[i][j] === boxes[i + 1][j + 1] && boxes[i][j] === boxes[i + 2][j + 2] && boxes[i][j] === boxes[i + 3][j + 3] && boxes[i][j] === boxes[i + 4][j + 4] && boxes[i][j] === boxes[i + 5][j + 5]) {
                return boxes[i][j];
            }
        }
    }
    for (let i = 5; i < 19; i++) { //左下右上斜め1列
        for (let j = 0; j < 14; j++) {
            if (boxes[i][j] && boxes[i][j] === boxes[i - 1][j + 1] && boxes[i][j] === boxes[i - 2][j + 2] && boxes[i][j] === boxes[i - 3][j + 3] && boxes[i][j] === boxes[i - 4][j + 4] && boxes[i][j] === boxes[i - 5][j + 5]) {
                return boxes[i][j];
            }
        }
    }
    return null;
}

export function calculate5(boxes: (string | null)[][]) {
    for (let i = 0; i < 19; i++) { //横1列
        const row = boxes[i];
        for (let j = 0; j < 15; j++) {
            if (row[j] && row[j] === row[j + 1] && row[j] === row[j + 2] && row[j] === row[j + 3] && row[j] === row[j + 4]) {
                return row[j];
            }
        }
    }
    const transpose = (boxes: (string | null)[][]) => boxes[0].map((_, c) => boxes.map(r => r[c]));//転置
    for (let i = 0; i < 19; i++) { //縦1列
        const column = transpose(boxes)[i];
        for (let j = 0; j < 15; j++) {
            if (column[j] && column[j] === column[j + 1] && column[j] === column[j + 2] && column[j] === column[j + 3] && column[j] === column[j + 4]) {
                return column[j];
            }
        }
    }
    for (let i = 0; i < 15; i++) { //左上右下斜め1列
        for (let j = 0; j < 15; j++) {
            if (boxes[i][j] && boxes[i][j] === boxes[i + 1][j + 1] && boxes[i][j] === boxes[i + 2][j + 2] && boxes[i][j] === boxes[i + 3][j + 3] && boxes[i][j] === boxes[i + 4][j + 4]) {
                return boxes[i][j];
            }
        }
    }
    for (let i = 4; i < 19; i++) { //左下右上斜め1列
        for (let j = 0; j < 15; j++) {
            if (boxes[i][j] && boxes[i][j] === boxes[i - 1][j + 1] && boxes[i][j] === boxes[i - 2][j + 2] && boxes[i][j] === boxes[i - 3][j + 3] && boxes[i][j] === boxes[i - 4][j + 4]) {
                return boxes[i][j];
            }
        }
    }
    return null;
}

export function calculate4(boxes: (string | null)[][]) {
    for (let i = 0; i < 19; i++) { //横1列
        const row = boxes[i];
        for (let j = 0; j < 16; j++) {
            if (row[j] && row[j] === row[j + 1] && row[j] === row[j + 2] && row[j] === row[j + 3]) {
                return row[j];
            }
        }
    }
    const transpose = (boxes: (string | null)[][]) => boxes[0].map((_, c) => boxes.map(r => r[c]));//転置
    for (let i = 0; i < 19; i++) { //縦1列
        const column = transpose(boxes)[i];
        for (let j = 0; j < 16; j++) {
            if (column[j] && column[j] === column[j + 1] && column[j] === column[j + 2] && column[j] === column[j + 3]) {
                return column[j];
            }
        }
    }
    for (let i = 0; i < 16; i++) { //左上右下斜め1列
        for (let j = 0; j < 16; j++) {
            if (boxes[i][j] && boxes[i][j] === boxes[i + 1][j + 1] && boxes[i][j] === boxes[i + 2][j + 2] && boxes[i][j] === boxes[i + 3][j + 3]) {
                return boxes[i][j];
            }
        }
    }
    for (let i = 3; i < 19; i++) { //左下右上斜め1列
        for (let j = 0; j < 16; j++) {
            if (boxes[i][j] && boxes[i][j] === boxes[i - 1][j + 1] && boxes[i][j] === boxes[i - 2][j + 2] && boxes[i][j] === boxes[i - 3][j + 3]) {
                return boxes[i][j];
            }
        }
    }
    return null;
}

export function calculate3(boxes: (string | null)[][]) {
    for (let i = 0; i < 19; i++) { //横1列
        const row = boxes[i];
        for (let j = 0; j < 17; j++) {
            if (row[j] && row[j] === row[j + 1] && row[j] === row[j + 2]) {
                return row[j];
            }
        }
    }
    const transpose = (boxes: (string | null)[][]) => boxes[0].map((_, c) => boxes.map(r => r[c]));//転置
    for (let i = 0; i < 19; i++) { //縦1列
        const column = transpose(boxes)[i];
        for (let j = 0; j < 17; j++) {
            if (column[j] && column[j] === column[j + 1] && column[j] === column[j + 2]) {
                return column[j];
            }
        }
    }
    for (let i = 0; i < 17; i++) { //左上右下斜め1列
        for (let j = 0; j < 17; j++) {
            if (boxes[i][j] && boxes[i][j] === boxes[i + 1][j + 1] && boxes[i][j] === boxes[i + 2][j + 2]) {
                return boxes[i][j];
            }
        }
    }
    for (let i = 2; i < 19; i++) { //左下右上斜め1列
        for (let j = 0; j < 17; j++) {
            if (boxes[i][j] && boxes[i][j] === boxes[i - 1][j + 1] && boxes[i][j] === boxes[i - 2][j + 2]) {
                return boxes[i][j];
            }
        }
    }
    return null;
}

export function calculate2(boxes: (string | null)[][]) {
    for (let i = 0; i < 19; i++) { //横1列
        const row = boxes[i];
        for (let j = 0; j < 18; j++) {
            if (row[j] && row[j] === row[j + 1]) {
                return row[j];
            }
        }
    }
    const transpose = (boxes: (string | null)[][]) => boxes[0].map((_, c) => boxes.map(r => r[c]));//転置
    for (let i = 0; i < 19; i++) { //縦1列
        const column = transpose(boxes)[i];
        for (let j = 0; j < 18; j++) {
            if (column[j] && column[j] === column[j + 1]) {
                return column[j];
            }
        }
    }
    for (let i = 0; i < 18; i++) { //左上右下斜め1列
        for (let j = 0; j < 18; j++) {
            if (boxes[i][j] && boxes[i][j] === boxes[i + 1][j + 1]) {
                return boxes[i][j];
            }
        }
    }
    for (let i = 1; i < 19; i++) { //左下右上斜め1列
        for (let j = 0; j < 18; j++) {
            if (boxes[i][j] && boxes[i][j] === boxes[i - 1][j + 1]) {
                return boxes[i][j];
            }
        }
    }
    return null;
}