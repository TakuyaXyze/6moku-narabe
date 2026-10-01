import { CloseButton } from "./CloseButton";
import { Overlay } from "./Overlay";

export type UndoKind = "back" | "reset";

const UNDO_MESSAGES: Record<UndoKind, string> = {
    back: "1つ前の自分の手番まで戻しますか?",
    reset: "盤面をリセットしますか?",
};

type Props = {
    kind: UndoKind;
    penalty: number | null;     //持ち時間無制限のときはnull
    shortage: string | null;    //戻せないときの理由。戻せるときはnull
    warning: string | null;     //戻す前に知らせておく注意。無いときはnull
    onConfirm: () => void;
    onCancel: () => void;
}

export function UndoDialog({ kind, penalty, shortage, warning, onConfirm, onCancel }: Props) {
    const canUndo: boolean = shortage === null;
    return (
        <Overlay onClose={onCancel}>
            <div className="rule-panel undo-panel">
                <CloseButton onClick={onCancel} />
                <div className="undo-message">{canUndo ? UNDO_MESSAGES[kind] : "これ以上戻せません"}</div>
                {!canUndo &&
                    <div className="undo-note">{shortage}</div>
                }
                {canUndo && penalty !== null &&
                    <div className="undo-note">制限時間が{penalty / 1000}秒減ります</div>
                }
                {canUndo && warning !== null &&
                    <div className="undo-note undo-warning">{warning}</div>
                }
                <div className="undo-buttons">
                    {canUndo &&
                        <button onClick={() => onConfirm()}>戻す</button>
                    }
                    <button onClick={() => onCancel()}>{canUndo ? "やめる" : "閉じる"}</button>
                </div>
            </div>
        </Overlay>
    );
}
