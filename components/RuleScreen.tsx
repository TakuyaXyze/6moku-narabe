"use client";

import "../styles/GameInfo.css";
import { Overlay } from "./Overlay";

const RULES: string[] = [
    "先に石を6つ縦・横・斜めいずれかの直線で並べた方が勝ち",
    "手番は1手・2手・2手・2手…と進む。先手の1手目だけ1つ、それ以降はどちらも2つずつ置く",
    "石は空いている交点ならどこにでも置ける。取ったり動かしたりはしない",
    "持ち時間は自分の手番でだけ減る。相手が考えている間は減らない",
    "石を1つ置くごとに持ち時間が少し増える",
];

const CREDITS: string[] = [
    "音楽：魔王魂",
    "効果音：効果音ラボ",
];

type Props = {
    onClose: () => void;
}

export function RuleScreen({ onClose }: Props) {
    return (
        <Overlay onClose={onClose}>
            <div className="rule-panel">
                <div className="rule-title">ルール</div>
                <ul>
                    {RULES.map((rule) => <li key={rule}>{rule}</li>)}
                </ul>
                <div className="rule-title rule-credit-title">使用素材</div>
                <ul>
                    {CREDITS.map((credit) => <li key={credit}>{credit}</li>)}
                </ul>
            </div>
        </Overlay>
    );
}
