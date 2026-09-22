export const ROWS = 19;
export const COLUMNS = ROWS;
export const SEQUENCE_LENGTH = 6; //MAX6

export function checkBlackIsNext(currentMove: number): boolean {
    /*
    0 void  next black true
    1 black next white false
    2 white next white false
    3 white next black true
    4 black next black true
    5 black next white false
    6 white next white false
    7 white next black true
    8 black next black true
    9 black next white false
    */
    if (currentMove % 4 === 0 || currentMove % 4 === 3) {
        return true;
    } else {
        return false;
    }
}
