import "../styles/StageScreen.css";
import type { MenuScreen } from "./GameMenu";

type Props = {
    stageLabel: string;
    opponentName: string;
    initialTime: number;
    stageTimeLimit: number;
    carriedTime: number;
    timePenalty: number;
    roundNo: number;
    attempt: number;
    playerIsBlack: boolean;
    hasHint: boolean;
    onSelectFirstMove: (isBlack: boolean) => void;
    onStart: () => void;
    onOpenMenuScreen: (screen: MenuScreen) => void;
}

export function StageScreen({ stageLabel, opponentName, initialTime, stageTimeLimit, carriedTime, timePenalty, roundNo, attempt, playerIsBlack, hasHint, onSelectFirstMove, onStart, onOpenMenuScreen }: Props) {
    const hasTimeDetail: boolean = Number.isFinite(initialTime) && (carriedTime > 0 || timePenalty > 0);
    const choosesFirstMove: boolean = roundNo === 1 && attempt === 0;

    return (
        <div className="stage-screen">
            <div className="stage-screen-header">
                <div className="stage-screen-title">六目並べ</div>
                <button className="stage-screen-rule-button"
                    onClick={() => onOpenMenuScreen("rule")}
                >ルール説明</button>
            </div>
            <div className="stage-screen-info">
                <div className="stage-screen-label">
                    STAGE {stageLabel}
                </div>
                <div className="stage-screen-opponent-name">
                    対戦相手: {opponentName}
                </div>
                <div className="stage-screen-time">
                    持ち時間 {Number.isFinite(initialTime) ? Math.floor(initialTime / 1000) + "秒" : "無制限"}
                </div>
                {hasTimeDetail && (
                    <div className="stage-screen-time-detail">
                        <span>このステージ {Math.floor(stageTimeLimit / 1000)}秒</span>
                        {carriedTime > 0 && (
                            <span className="stage-screen-time-plus">＋ 繰り越し {Math.floor(carriedTime / 1000)}秒</span>
                        )}
                        {timePenalty > 0 && (
                            <span className="stage-screen-time-minus">− 敗北ペナルティ {Math.floor(timePenalty / 1000)}秒</span>
                        )}
                    </div>
                )}
                <button className="stage-screen-hint-button"
                    onClick={() => onOpenMenuScreen("hint")}
                    disabled={!hasHint}
                >ステージのヒント</button>
            </div>
            <div className="stage-screen-start">
                {choosesFirstMove && (
                    <>
                        <button className="stage-screen-start-button" onClick={() => onSelectFirstMove(true)}>
                            先手で対局開始 <span className="goishi-black" />
                        </button>
                        <button className="stage-screen-start-button" onClick={() => onSelectFirstMove(false)}>
                            後手で対局開始 <span className="goishi-white" />
                        </button>
                    </>
                )}
                {!choosesFirstMove && (
                    <>
                        <div className="stage-screen-start-message">
                            {attempt > 0 ? "再挑戦" : "ラウンド" + roundNo}
                        </div>
                        <button className="stage-screen-start-button" onClick={() => onStart()}>
                            {playerIsBlack ? "先手" : "後手"}で開始 <span className={playerIsBlack ? "goishi-black" : "goishi-white"} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
