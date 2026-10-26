import { useSyncExternalStore } from "react";

type Props = {
    stageNo: number;
    stageCount: number;
    onJump: (stageNo: number) => void;
}

//確認用。URLに debug=demo を付けたときだけ出す
//サーバーで描くときは出さず、ブラウザで描き直すときにURLを読む。URLは途中で変わらないので変化の通知はない
export function DemoTool({ stageNo, stageCount, onJump }: Props) {
    const isShown: boolean = useSyncExternalStore(
        () => () => { },
        () => window.location.search.includes("debug=demo"),
        () => false,
    );

    if (!isShown) return null;
    return (
        <div className="stage-demo-tool">
            <span>デモ用</span>
            <button onClick={() => onJump(stageNo - 1)}>前のステージ</button>
            <button onClick={() => onJump(stageNo + 1)}>次のステージ</button>
            <button onClick={() => onJump(stageCount + 1)}>クリア画面</button>
        </div>
    );
}
