type Props = {
    onClick: () => void;
}

export function CloseButton({ onClick }: Props) {
    return (
        <button className="close-panel" aria-label="閉じる" onClick={() => onClick()}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M6 6 L18 18 M18 6 L6 18"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />
            </svg>
        </button>
    );
}
