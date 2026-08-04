"use client";

import { GameBoard } from "./GameBoard";
import "../styles/PlayGround.css"
import "../styles/GameBoard.css"
import { useState } from "react";

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
        } else if (currentMove === 1) {
            return true;
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
    }

    function jumpTo(nextMove: number) {
        setCurrentMove(nextMove);
        //checkBlackIsNext(currentMove);
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
                <GameBoard blackIsNext={blackIsNext} boxes={currentBoxes} onPlay={handlePlay} />
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