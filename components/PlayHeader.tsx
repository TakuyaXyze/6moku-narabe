type Props = {
    opponentName: string;
}

export function PlayHeader({ opponentName }: Props) {
    return (
        <div className="game-header">
            <div className="stage-title">VS {opponentName}</div>
        </div>
    );
}
