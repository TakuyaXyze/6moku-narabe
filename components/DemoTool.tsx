type Props = {
    stageNo: number;
    stageCount: number;
    onJump: (stageNo: number) => void;
}

export function DemoTool({ stageNo, stageCount, onJump }: Props) {
    return (
        <div className="stage-demo-tool">
            <span>デモ用</span>
            <button onClick={() => onJump(stageNo - 1)}>前のステージ</button>
            <button onClick={() => onJump(stageNo + 1)}>次のステージ</button>
            <button onClick={() => onJump(stageCount + 1)}>クリア画面</button>
        </div>
    );
}
