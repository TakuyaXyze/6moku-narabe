type Props = {
    stageLabel: string;
    initialTime: number;
    stageTimeLimit: number;
    carriedTime: number;
    timePenalty: number;
    roundNo: number;
    attempt: number;
    playerIsBlack: boolean;
    onSelectFirstMove: (isBlack: boolean) => void;
    onStart: () => void;
}

export function EyecatchScreen({ stageLabel, initialTime, stageTimeLimit, carriedTime, timePenalty, roundNo, attempt, playerIsBlack, onSelectFirstMove, onStart }: Props) {
    const hasTimeDetail: boolean = Number.isFinite(initialTime) && (carriedTime > 0 || timePenalty > 0);
    const choosesFirstMove: boolean = roundNo === 1 && attempt === 0;

    return (
        <div className="stage-panel">
            <div className="stage-number">STAGE {stageLabel}</div>
            <div className="stage-message">
                持ち時間 {Number.isFinite(initialTime) ? Math.floor(initialTime / 1000) + "秒" : "無制限"}
            </div>
            {hasTimeDetail && (
                <div className="stage-detail">
                    <span>このステージ {Math.floor(stageTimeLimit / 1000)}秒</span>
                    {carriedTime > 0 && (
                        <span className="stage-detail-plus">＋ 繰り越し {Math.floor(carriedTime / 1000)}秒</span>
                    )}
                    {timePenalty > 0 && (
                        <span className="stage-detail-minus">− 敗北ペナルティ {Math.floor(timePenalty / 1000)}秒</span>
                    )}
                </div>
            )}
            {choosesFirstMove && (
                <div className="stage-choice">
                    <div className="stage-message">先攻・後攻を選ぶ</div>
                    <button onClick={() => onSelectFirstMove(true)}>先攻（黒）</button>
                    <button onClick={() => onSelectFirstMove(false)}>後攻（白）</button>
                </div>
            )}
            {!choosesFirstMove && (
                <div className="stage-choice">
                    <div className="stage-message">
                        {attempt > 0 ? "再挑戦" : "ラウンド" + roundNo} {playerIsBlack ? "先攻（黒）" : "後攻（白）"}
                    </div>
                    <button onClick={() => onStart()}>開始</button>
                </div>
            )}
        </div>
    );
}
