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

export const ROWS = 8;
export const COLUMNS = ROWS;
export let rowNos = new Array<number>;
for (let i = 0; i < ROWS; i++) {
    rowNos.push(i);
}
export let columnNos = new Array<number>;
for (let i = 0; i < COLUMNS; i++) {
    columnNos.push(i);
}
export const SEQUENCE_LENGTH = 6;

export function PlayGround() {

    const [history, setHistory] = useState([Array(ROWS).fill(null).map(() => Array<(string | null)>(COLUMNS).fill(null))]);
    const [currentMove, setCurrentMove] = useState(0);
    const [blackIsNext, setBlackIsNext] = useState(true);
    const [currentModeNumber, setCurrentModeNumber] = useState(0);

    function handlePlay(nextBoxes: (string | null)[][]): void {
        const nextHistory = [...history.slice(0, currentMove + 1), nextBoxes];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        const booleanBlackIsNext = checkBlackIsNext(currentMove + 1);
        /*console.log("nextHistory.length - 1:" + (nextHistory.length - 1));
        console.log("currentMove:" + currentMove);
        const booleanBlackIsNext = checkBlackIsNext(currentMove);*/
        //useStateの呼び出しのタイミングの問題?(おそらく)で、currentMove+1としないと上手く動かない。
        //currentMoveにはsetCurrentMove(nextHistory.length - 1);する前の値が入ってくる。
        setBlackIsNext(booleanBlackIsNext);
    }

    function handleClick(rowNo: number, columnNo: number): void {
        if (history[currentMove][rowNo][columnNo] || !blackIsNext) {//空白のときのみ配置可能
            return;
        }
        handleColor(rowNo, columnNo);
    }

    function handleColor(rowNo: number, columnNo: number) {
        if (typeof detectSequence(history[currentMove], SEQUENCE_LENGTH) == "string") return;
        //const nextBoxes = history[currentMove].slice();
        //参考コードだと1次元行列だったのでシャローコピーでよかったが、ここでは2次元のためディープコピー
        const nextBoxes: Array<(string | null)[]> = JSON.parse(JSON.stringify(history[currentMove]));
        if (blackIsNext) {
            nextBoxes[rowNo][columnNo] = "b";
        } else {
            nextBoxes[rowNo][columnNo] = "w";
        }
        console.log("handleColor-history:" + history);
        console.log("handleColor-nextBoxes:" + nextBoxes);
        handlePlay(nextBoxes);
    }

    useEffect(() => {
        detectComputerTurn();
        return
    }, [history])

    function detectComputerTurn() {
        if (!blackIsNext) {
            console.log("computerTurn");
            computerTurn();
        }
    }

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
                computerTurnWithResult(computerTurnRandom(history[currentMove]));
            case 1:
                computerTurnWithResult(computerTurnDepth1Search(history[currentMove],  currentMove));
            case 2:
                computerTurnWithResult(computerTurnMinMaxSearch(history[currentMove],  currentMove, 3));
            case 3:
                computerTurnWithResult(computerTurnMinMaxSearch(history[currentMove],  currentMove, 6));
            case 4:
                computerTurnWithResult(computerTurnAlphaBetaSearch(history[currentMove],  currentMove, 3));
            case 5:
                computerTurnWithResult(computerTurnAlphaBetaSearch(history[currentMove],  currentMove, 6));
        }*/
        //computerTurnWithResult(computerTurnRandom(history[currentMove]));
        //computerTurnWithResult(computerTurnDepth1Search(history[currentMove],  currentMove));
        //computerTurnWithResult(computerTurnMinMaxSearch(history[currentMove],  currentMove, 2));
        //computerTurnWithResult(computerTurnAlphaBetaSearch(history[currentMove],  currentMove, 1));
        computerTurnWithResult(computerTurnAlphaBetaSearch(history[currentMove], currentMove, 2));
        //computerTurnWithResult(computerTurnAlphaBetaSearch(history[currentMove],  currentMove, 3));
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
        setBlackIsNext(checkBlackIsNext(nextMove));
        detectComputerTurn();
    }

    const moves = history.map((boxes: (string | null)[][], move: number) => {
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

    const winner = detectSequence(history[currentMove], SEQUENCE_LENGTH);
    let status;
    if (typeof winner == "string") {
        status = 'Winner: ' + winner;
    } else {
        status = 'Next player: ' + (blackIsNext ? 'black' : 'white');
    }

    return (
        <div className="play-ground">
            <div>
                <GameBoard boxes={history[currentMove]} handleClick={handleClick} />
            </div>
            <div className="game-info">
                <div className="status">{status}</div>
                <ol>{moves}</ol>
                <div>Mode:{currentGameMode}</div>
                <SelectGameMode handleGameMode={handleGameMode} />
            </div>
        </div>
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

export function detectSequence(boxes: (string | null)[][], length: number): (string | null) {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS - length + 1; j++) {
            let count = 0;
            for (let k = 1; k < length; k++) {
                if (boxes[i][j] && boxes[i][j] == boxes[i][j + k]) {
                    count++;
                }
            }
            if (count >= length - 1) {
                return boxes[i][j];
            };
        }
    }
    for (let i = 0; i < ROWS - length + 1; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            let count = 0;
            for (let k = 1; k < length; k++) {
                if (boxes[i][j] && boxes[i][j] == boxes[i + k][j]) {
                    count++;
                }
            }
            if (count >= length - 1) {
                return boxes[i][j];
            }
        }
    }
    for (let i = 0; i < ROWS - length + 1; i++) {
        for (let j = 0; j < COLUMNS - length + 1; j++) {
            let count = 0;
            for (let k = 1; k < length; k++) {
                if (boxes[i][j] && boxes[i][j] == boxes[i + k][j + k]) {
                    count++;
                }
            }
            if (count >= length - 1) {
                return boxes[i][j];
            }
        }
    }
    for (let i = 0; i < ROWS - length + 1; i++) {
        for (let j = length - 1; j < COLUMNS; j++) {
            let count = 0;
            for (let k = 1; k < length; k++) {
                if (boxes[i][j] && boxes[i][j] == boxes[i + k][j - k]) {
                    count++;
                }
            }
            if (count >= length - 1) {
                return boxes[i][j];
            }
        }
    }
    return null;
}