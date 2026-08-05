import { PutCoordinate } from "./ComputerResult";

export function computerTurnRandom(boxes: string[][]) {
    console.log("computerTurnRandom");
    //setComputingTime(Date.now() - computingStartTime);
    let randomRowNo: number;
    let randomColumnNo: number;
    do {
        randomRowNo = Math.floor(Math.random() * 19.0);
        randomColumnNo = Math.floor(Math.random() * 19.0);
    } while (boxes[randomRowNo][randomColumnNo])
    let coordinate = new PutCoordinate(randomRowNo, randomColumnNo);
    return coordinate;
}