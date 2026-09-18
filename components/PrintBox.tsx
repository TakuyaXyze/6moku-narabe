type Props = {
    rowNo: number;
    columnNo: number;
    value: (string | null);
    onBoxClick: () => void;
    isLastMove: boolean;
}

export function PrintBox({ rowNo, columnNo, value, onBoxClick, isLastMove }: Props) {
    //1マス1マスを描画
    const countNum: number = (rowNo) * 100 + (columnNo);

    return (
        <div key={countNum}
            className={`
                stone
                ${value === "b" ? 'black' : ''}
                ${value === "w" ? 'white' : ''}
                ${value === null ? 'empty' : ''}
                ${isLastMove === true ? 'last-move' : ''}
            `}
        >
            <div onClick={onBoxClick}
                className="box">
            </div>
        </div>
    );
}