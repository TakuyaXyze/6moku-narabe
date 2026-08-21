"use client";

import "../styles/GameInfo.css"
import { useState, useCallback, Dispatch, SetStateAction } from "react";
type Props = {
    handleGameMode: (gameMode: string) => void;
}

export function SelectGameMode({ handleGameMode }: Props) {

    const [onHover, setOnHover] = useState(false);
    const [hoveredButtonId, setHoveredButtonId] = useState<string | null>(null);

    const isHoveredOnButton = useCallback((buttonId: string) => {

        if (hoveredButtonId === null) return false;

        return onHover && (hoveredButtonId === buttonId);
    },
        [onHover, hoveredButtonId]
    );

    const handleMouceEnter = (buttonId: string) => {
        setHoveredButtonId(buttonId);
        setOnHover(true);
    }

    return (
        <ol className="select-game-mode"
            onMouseLeave={() => {
                setHoveredButtonId(null);
                setOnHover(false);
            }}
        >
            <li>
                <button onClick={() => handleGameMode("Random")}
                    onMouseEnter={() => handleMouceEnter("Random")}
                >
                    Random
                </button>
                {isHoveredOnButton("Random") && (
                    <div className="search-info">ランダムで配置。軽い</div>
                )}
            </li>
            <li>
                <button onClick={() => handleGameMode("Beam4")}
                    onMouseEnter={() => handleMouceEnter("Beam4")}
                >
                    Beam-depth4
                </button>
                {isHoveredOnButton("Beam4") && (
                    <div className="search-info">4手先まで探索。標準</div>
                )}
            </li>
            <li>
                <button onClick={() => handleGameMode("Beam6")}
                    onMouseEnter={() => handleMouceEnter("Beam6")}
                >
                    Beam-depth6
                </button>
                {isHoveredOnButton("Beam6") && (
                    <div className="search-info">6手先まで探索。重い</div>
                )}
            </li>
        </ol>
    );
};