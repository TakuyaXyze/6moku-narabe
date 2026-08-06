import { Depth1Search } from "./Depth1Search";

export function computerTurnDepth1Search(boxes: string[][], blackIsNext: boolean, currentMove: number) {
    console.log("computerDepth1Search");
    //setComputingTime(Date.now() - computingStartTime);
    const move = new Depth1Search;
    move.bestMove(boxes, blackIsNext, currentMove);
} 