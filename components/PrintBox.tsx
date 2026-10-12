import { CSSProperties } from "react";

const WIN_GLOW_STEP = 150;      //勝ちの列で、隣の石が光り始めるまでの時間(ミリ秒)

type Props = {
    rowNo: number;
    columnNo: number;
    value: (string | null);
    onBoxClick: () => void;
    isLastMove: boolean;
    winOrder: number | null;    //勝ちの列の中で何番目に光るか。列に含まれない石はnull
    isCrossMove: boolean;
    bonusNo: number;
}

export function PrintBox({ rowNo, columnNo, value, onBoxClick, isLastMove, winOrder, isCrossMove, bonusNo }: Props) {
    //1マス1マスを描画
    const countNum: number = (rowNo) * 100 + (columnNo);
    const boxKey: string = isCrossMove ? countNum + "-" + bonusNo : String(countNum);
    const winStyle = (winOrder === null) ? undefined
        : { "--win-delay": winOrder * WIN_GLOW_STEP + "ms" } as CSSProperties;

    return (
        <div key={boxKey}
            className={`
                stone
                ${value === "b" ? 'black' : ''}
                ${value === "w" ? 'white' : ''}
                ${value === null ? 'empty' : ''}
                ${isLastMove === true ? 'last-move' : ''}
                ${winOrder !== null ? 'win-move' : ''}
                ${isCrossMove === true ? 'cross-move' : ''}
            `}
            style={winStyle}
        >
            <div onClick={onBoxClick}
                className="box">
            </div>
        </div>
    );
}
