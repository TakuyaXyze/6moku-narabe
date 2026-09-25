"use client";

import "../styles/GameInfo.css";

const RULES: string[] = [
    "先に石を6つ直線に並べた方が勝ち。縦・横・斜めのどれでもよい",
    "手番は1手・2手・2手・2手…と進む。最初の1手だけ1つ、それ以降はどちらも2つずつ置く",
    "石は空いている交点ならどこにでも置ける。取ったり動かしたりはしない",
    "持ち時間は自分の手番でだけ減る。相手が考えている間は減らない",
    "石を1つ置くごとに持ち時間が少し増える",
    "持ち時間が尽きたら負け",
];

type ListScreenProps = {
    title: string;
    lines: string[];
    onClose: () => void;
}

export function ListScreen({ title, lines, onClose }: ListScreenProps) {
    return (
        <div className="rule-screen">
            <div className="rule-panel">
                <div className="rule-title">{title}</div>
                <ul>
                    {lines.map((line) => <li key={line}>{line}</li>)}
                </ul>
                <button onClick={onClose}>閉じる</button>
            </div>
        </div>
    );
}

type RuleScreenProps = {
    onClose: () => void;
}

export function RuleScreen({ onClose }: RuleScreenProps) {
    return <ListScreen title="ルール" lines={RULES} onClose={onClose} />;
}
