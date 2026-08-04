type Props = {
    rowNo: number;
    columnNo: number;
    value: string;
    onBoxClick: () => void;
}

export function PrintBox({ rowNo, columnNo, value, onBoxClick }: Props) {
    //1マス1マスを描画
    const countNum: number = (rowNo) * 100 + (columnNo);

    return (
        <div key={countNum} className={`stone ${value === "X" ? 'black' : ''}${value === "O" ? 'white' : ''}`}>
            <div onClick={onBoxClick}
                className="box">
                {rowNo + 1}-{columnNo + 1}
            </div>
        </div>
    );
}