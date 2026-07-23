import { GameBoard } from "./GameBoard";
import "../styles/PlayGround.css"

export var turnColor: string = "white";

export function PlayGround() {

    return (
        <div className="playGround">
            <GameBoard />
        </div>
    );
}