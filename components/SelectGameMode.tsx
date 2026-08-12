"use client";

import "../styles/PlayGround.css"
type Props = {
    handleGameMode: (gameMode: string) => void;
}

export function SelectGameMode({ handleGameMode }: Props) {

    return (
        <ol className="select-game-mode">
            <li>
                <button onClick={() => handleGameMode("Random")}>Random</button>
            </li>
            <li>
                <button onClick={() => handleGameMode("Depth1Search")}>Depth1Search</button>
            </li>
            <li>
                <button onClick={() => handleGameMode("MinMax3")}>MinMax-depth3</button>
            </li>
            <li>
                <button onClick={() => handleGameMode("MinMax6")}>MinMax-depth6</button>
            </li>
            <li>
                <button onClick={() => handleGameMode("AlphaBeta3")}>AlphaBeta-depth3</button>
            </li>
            <li>
                <button onClick={() => handleGameMode("AlphaBeta6")}>AlphaBeta-depth6</button>
            </li>
        </ol>
    );
};