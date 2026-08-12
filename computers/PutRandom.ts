import { ROWS, COLUMNS } from "@/components/PlayGround";
import { MoveCoordinate } from "./Evaluate";

export function computerTurnRandom(boxes: (string | null)[][]) {
    console.log("computerTurnRandom");
    //setComputingTime(Date.now() - computingStartTime);
    const value = undefined;
    let randomRowNo: number;
    let randomColumnNo: number;
    do {
        randomRowNo = Math.floor(Math.random() * ROWS);
        randomColumnNo = Math.floor(Math.random() * COLUMNS);
    } while (boxes[randomRowNo][randomColumnNo])
    const coordinate = new MoveCoordinate(randomRowNo, randomColumnNo, value);
    return coordinate;
}