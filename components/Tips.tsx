"use client";

import "../styles/Tips.css"
import { useState, MouseEvent } from "react";

type SlideDirection = "next" | "prev";

const TIP_DURATION = 10000;

const tips: string[] = [
    "石を6つ直線に並べたら勝ち。縦でも横でも斜めでもいい",
    "最初の1手だけが1つ。そのあとはお互い2つずつ置いていく",
    "持ち時間は自分の手番でしか減らない。相手が考えている間に読んでおくと得をする",
    "石を置くたびに持ち時間は増える。迷い続けるより、置いてから考える方がよいこともある",
    "十字や✖形に並べると制限時間が緩和される",
];

export function Tips() {
    const [tipNo, setTipNo] = useState(0);
    const [direction, setDirection] = useState<SlideDirection>("next");
    const [switchCount, setSwitchCount] = useState(0);
    const canSwitch: boolean = tips.length > 1;

    function switchTip(nextDirection: SlideDirection): void {
        if (!canSwitch) return;
        const step = (nextDirection === "next") ? 1 : -1;
        setTipNo((tipNo + step + tips.length) % tips.length);
        setDirection(nextDirection);
        setSwitchCount(switchCount + 1);
    }

    function handleClick(event: MouseEvent<HTMLDivElement>): void {
        const rect = event.currentTarget.getBoundingClientRect();
        const clickedLeft: boolean = event.clientX < rect.left + rect.width / 2;
        switchTip(clickedLeft ? "prev" : "next");
    }

    return (
        <div className="tips-bar">
            <div className="tips-body" onClick={handleClick}>
                <div key={switchCount} className={"tips-text tips-slide-" + direction}>
                    {tips[tipNo]}
                </div>
            </div>
            <div className="tips-progress">
                {tips.map((tip, i) => (
                    <div key={tip} className="tips-progress-segment">
                        {i < tipNo && <div className="tips-progress-fill tips-progress-done" />}
                        {i === tipNo && (
                            <div key={switchCount}
                                className={"tips-progress-fill" + (canSwitch ? " tips-progress-active" : " tips-progress-done")}
                                style={{ animationDuration: TIP_DURATION + "ms" }}
                                onAnimationEnd={() => switchTip("next")}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
