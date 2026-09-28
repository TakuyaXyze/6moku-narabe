export type UndoKind = "back" | "reset";

const UNDO_MESSAGES: Record<UndoKind, string> = {
    back: "1つ前の自分の手番まで戻しますか?",
    reset: "盤面をリセットしますか?",
};

type Props = {
    kind: UndoKind;
    penalty: number | null;     //持ち時間無制限のときはnull
    onConfirm: () => void;
    onCancel: () => void;
}

export function UndoDialog({ kind, penalty, onConfirm, onCancel }: Props) {
    return (
        <div className="rule-screen">
            <div className="rule-panel undo-panel">
                <div className="undo-message">{UNDO_MESSAGES[kind]}</div>
                {penalty !== null &&
                    <div className="undo-note">制限時間が{penalty / 1000}秒減ります</div>
                }
                <div className="undo-buttons">
                    <button onClick={() => onConfirm()}>戻す</button>
                    <button onClick={() => onCancel()}>やめる</button>
                </div>
            </div>
        </div>
    );
}
