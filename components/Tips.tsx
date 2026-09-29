"use client";

import "../styles/Tips.css"
import { useState, MouseEvent } from "react";

type SlideDirection = "next" | "prev";

const TIP_DURATION = 10000;

type Props = {
    tips: string[];
}

export function Tips({ tips }: Props) {
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

    if (tips.length === 0) return null;

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
