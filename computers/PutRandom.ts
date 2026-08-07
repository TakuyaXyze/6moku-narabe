import { MoveCoordinate } from "./MoveCoordinate";

export function computerTurnRandom(boxes: string[][]) {
    console.log("computerTurnRandom");
    //setComputingTime(Date.now() - computingStartTime);
    const value: number = 0;
    let randomRowNo: number;
    let randomColumnNo: number;
    do {
        randomRowNo = Math.floor(Math.random() * 19.0);
        randomColumnNo = Math.floor(Math.random() * 19.0);
    } while (boxes[randomRowNo][randomColumnNo])
    const coordinate = new MoveCoordinate(randomRowNo, randomColumnNo, value);
    return coordinate;
}