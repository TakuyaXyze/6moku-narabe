type Props = {
    onClose: () => void;
}

//札の外側の右上に置く、閉じるボタン
export function CloseButton({ onClose }: Props) {
    return (
        <button className="close-button" aria-label="閉じる" onClick={() => onClose()}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            >
                <path d="M6 6 L18 18 M18 6 L6 18" />
            </svg>
        </button>
    );
}
