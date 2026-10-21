import "../styles/Overlay.css";
import { ReactNode } from "react";

type Props = {
    onClose?: () => void;       //クリックで閉じないとき(勝敗画面など)は渡さない
    className?: string;         //幕の濃さなどを画面ごとに変えるとき
    children: ReactNode;
}

export function Overlay({ onClose, className, children }: Props) {
    return (
        <div className={"overlay" + (className === undefined ? "" : " " + className)}
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
