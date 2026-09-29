"use client";

import "../styles/GameInfo.css";
import { CloseButton } from "./CloseButton";

const RULES: string[] = [
    "先に石を6つ直線に並べた方が勝ち。縦・横・斜めのどれでもよい",
    "手番は1手・2手・2手・2手…と進む。最初の1手だけ1つ、それ以降はどちらも2つずつ置く",
    "石は空いている交点ならどこにでも置ける。取ったり動かしたりはしない",
    "持ち時間は自分の手番でだけ減る。相手が考えている間は減らない",
    "石を1つ置くごとに持ち時間が少し増える",
    "持ち時間が尽きたら負け",
];

type Props = {
    onClose: () => void;
}

export function RuleScreen({ onClose }: Props) {
    return (
        <div className="rule-screen"
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div className="rule-panel">
                <CloseButton onClick={onClose} />
                <div className="rule-title">ルール</div>
                <ul>
                    {RULES.map((rule) => <li key={rule}>{rule}</li>)}
                </ul>
            </div>
        </div>
    );
}
