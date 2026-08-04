import { PrintBox } from "./PrintBox";

type Props = {
    rowNo: number;
    boxes: string[][];
    handleClick: (rowNo: number, columnNo: number) => void;
}

export function PrintRow({ rowNo, boxes, handleClick }: Props) {
    //1行1行を描画

    return (
        <div className="row">
            <PrintBox rowNo={rowNo} columnNo={0} value={boxes[rowNo][0]} onBoxClick={() => handleClick(rowNo, 0)} />
            <PrintBox rowNo={rowNo} columnNo={1} value={boxes[rowNo][1]} onBoxClick={() => handleClick(rowNo, 1)} />
            <PrintBox rowNo={rowNo} columnNo={2} value={boxes[rowNo][2]} onBoxClick={() => handleClick(rowNo, 2)} />
            <PrintBox rowNo={rowNo} columnNo={3} value={boxes[rowNo][3]} onBoxClick={() => handleClick(rowNo, 3)} />
            <PrintBox rowNo={rowNo} columnNo={4} value={boxes[rowNo][4]} onBoxClick={() => handleClick(rowNo, 4)} />
            <PrintBox rowNo={rowNo} columnNo={5} value={boxes[rowNo][5]} onBoxClick={() => handleClick(rowNo, 5)} />
            <PrintBox rowNo={rowNo} columnNo={6} value={boxes[rowNo][6]} onBoxClick={() => handleClick(rowNo, 6)} />
            <PrintBox rowNo={rowNo} columnNo={7} value={boxes[rowNo][7]} onBoxClick={() => handleClick(rowNo, 7)} />
            <PrintBox rowNo={rowNo} columnNo={8} value={boxes[rowNo][8]} onBoxClick={() => handleClick(rowNo, 8)} />
            <PrintBox rowNo={rowNo} columnNo={9} value={boxes[rowNo][9]} onBoxClick={() => handleClick(rowNo, 9)} />
            <PrintBox rowNo={rowNo} columnNo={10} value={boxes[rowNo][10]} onBoxClick={() => handleClick(rowNo, 10)} />
            <PrintBox rowNo={rowNo} columnNo={11} value={boxes[rowNo][11]} onBoxClick={() => handleClick(rowNo, 11)} />
            <PrintBox rowNo={rowNo} columnNo={12} value={boxes[rowNo][12]} onBoxClick={() => handleClick(rowNo, 12)} />
            <PrintBox rowNo={rowNo} columnNo={13} value={boxes[rowNo][13]} onBoxClick={() => handleClick(rowNo, 13)} />
            <PrintBox rowNo={rowNo} columnNo={14} value={boxes[rowNo][14]} onBoxClick={() => handleClick(rowNo, 14)} />
            <PrintBox rowNo={rowNo} columnNo={15} value={boxes[rowNo][15]} onBoxClick={() => handleClick(rowNo, 15)} />
            <PrintBox rowNo={rowNo} columnNo={16} value={boxes[rowNo][16]} onBoxClick={() => handleClick(rowNo, 16)} />
            <PrintBox rowNo={rowNo} columnNo={17} value={boxes[rowNo][17]} onBoxClick={() => handleClick(rowNo, 17)} />
            <PrintBox rowNo={rowNo} columnNo={18} value={boxes[rowNo][18]} onBoxClick={() => handleClick(rowNo, 18)} />
        </div>
    );
}