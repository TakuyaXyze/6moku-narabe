import { CSSProperties } from "react";

export const WIN_GLOW_STEP = 150;      //勝ちの列で、隣の石が光り始めるまでの時間(ミリ秒)

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
    const winStyle = (winOrder === null) ? undefined
        : { "--win-delay": winOrder * WIN_GLOW_STEP + "ms" } as CSSProperties;

    return (
        <div
            className={`
                stone
                ${value === "b" ? 'black' : ''}
                ${value === "w" ? 'white' : ''}
                ${value === null ? 'empty' : ''}
                ${isLastMove === true ? 'last-move' : ''}
                ${winOrder !== null ? 'win-move' : ''}
            `}
            style={winStyle}
        >
            {/*十字ボーナスの点滅は石と分けて置く。ボーナスが続いたときは、この部品だけを作り直して点滅を最初から始める
            石ごと作り直すと、勝ちの列の光も最初からやり直してしまう*/}
            {isCrossMove &&
                <div key={bonusNo} className="cross-glow" />
            }
            <div onClick={onBoxClick}
                className="box">
            </div>
        </div>
    );
}
