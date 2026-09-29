type Props = {
    onRestart: () => void;
}

export function ClearScreen({ onRestart }: Props) {
    return (
        <div className="clear-panel">
            <div className="clear-title">ALL CLEAR</div>
            <div className="clear-message">全ステージクリアおめでとう</div>
            <button className="clear-button" onClick={() => onRestart()}>最初から</button>
        </div>
    );
}
