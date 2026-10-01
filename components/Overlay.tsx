import "../styles/Overlay.css";
import { ReactNode } from "react";

type Props = {
    onClose?: () => void;       //外側クリックで閉じないとき(勝敗画面など)は渡さない
    children: ReactNode;
}

export function Overlay({ onClose, children }: Props) {
    return (
        <div className="overlay"
            onClick={(event) => {
                if (onClose !== undefined && event.target === event.currentTarget) onClose();
            }}
        >
            {children}
        </div>
    );
}
