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

function calculateWinner(boxes: string[][]) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (boxes[a] && boxes[a] === boxes[b] && boxes[a] === boxes[c]) {
            return boxes[a];
        }
    }
    return null;
}