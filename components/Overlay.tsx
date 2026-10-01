import "../styles/Overlay.css";
import { ReactNode } from "react";

type Props = {
    onClose?: () => void;       //クリックで閉じないとき(勝敗画面など)は渡さない
    children: ReactNode;
}

export function Overlay({ onClose, children }: Props) {
    return (
        <div className="overlay"
            onClick={(event) => {
                if (onClose === undefined) return;
                if ((event.target as HTMLElement).closest("button")) return;     //ボタンは各自の処理に任せる
                onClose();          //文字の上も含め、ボタン以外のどこをクリックしても閉じる
            }}
        >
            {children}
        </div>
    );
}
