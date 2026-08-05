"use client";

import { GameBoard } from "./GameBoard";
import "../styles/PlayGround.css"
import "../styles/GameBoard.css"
import { useState, useEffect } from "react";

export function PlayGround() {

    const ROWS = 19;
    const COLUMNS = 19;
    const [history, setHistory] = useState([Array(ROWS).fill(null).map(() => Array(COLUMNS).fill(null))]);
    const [currentMove, setCurrentMove] = useState(0);
    const currentBoxes: string[][] = history[currentMove];
    const [blackIsNext, setBlackIsNext] = useState(true);

    function checkBlackIsNext(currentMove: number): boolean {
        if (currentMove === 0) {
            return false;
        } else if (currentMove % 4 === 1 || currentMove % 4 === 2) {
            return true;
        } else {
            return false;
        }
    }

    function handlePlay(nextBoxes: string[][]): void {
        const nextHistory = [...history.slice(0, currentMove + 1), nextBoxes];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        //checkBlackIsNext(currentMove);
        const booleanBlackIsNext = checkBlackIsNext(currentMove);
        setBlackIsNext(booleanBlackIsNext);
        //CPUPutLogic(blackIsNext);
    }

    function handleClick(rowNo: number, columnNo: number): void {
        if (calculateWinner(currentBoxes) || currentBoxes[rowNo][columnNo] || !blackIsNext) {//空白のときのみ配置可能
            return;
        }
        handleColor(rowNo, columnNo);
    }

    function handleColor(rowNo: number, columnNo: number) {
        const nextBoxes = currentBoxes.slice();
        if (blackIsNext) {//2手ずつ進むように変更するために後程変更予定
            nextBoxes[rowNo][columnNo] = "X";
        } else {
            nextBoxes[rowNo][columnNo] = "O";
        }
        handlePlay(nextBoxes);
    }

    useEffect(() => {
        if (!blackIsNext) {
            console.log("computerTurn");
            computerTurn();
        }
        return
    }, [currentBoxes])

    //処理時間の計測
    //const [computingStartTime, setComputingStartTime] = useState(Date.now)
    //const [computingTime, setComputingTime] = useState(0)

    function computerTurn(): void {
        //setComputingStartTime(Date.now);
        //将来的に難易度選択とかがあったらここに書く
        computerTurnRandom();
    }

    function computerTurnRandom() {
        console.log("computerTurnRandom")
        //setComputingTime(Date.now() - computingStartTime);
        const randomRowNo = Math.floor(Math.random() * 19.0);
        const randomColumnNo = Math.floor(Math.random() * 19.0);
        handleColor(randomRowNo, randomColumnNo);
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

    const winner = calculateWinner(currentBoxes);
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
            </div>
        </div>
    );
}

export function calculateWinner(boxes: string[][]) {
    for (let i = 0; i < 19; i++) { //横1列
        const row = boxes[i];
        for (let j = 0; j < 19; j++) {
            if (row[j] && row[j] === row[j + 1] && row[j] === row[j + 2] && row[j] === row[j + 3] && row[j] === row[j + 4] && row[j] === row[j + 5]) {
                return row[j];
            }
        }
    }
    const transpose = (boxes: string[][]) => boxes[0].map((_, c) => boxes.map(r => r[c]));//転置
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