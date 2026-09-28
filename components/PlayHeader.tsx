type Props = {
    stageLabel: string;
}

export function PlayHeader({ stageLabel }: Props) {
    return (
        <div className="game-header">
            <div className="stage-title">STAGE {stageLabel}</div>
        </div>
    );
}
