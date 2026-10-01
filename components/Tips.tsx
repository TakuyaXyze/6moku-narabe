"use client";

import "../styles/Tips.css"
import { useState, useRef, MouseEvent, PointerEvent } from "react";

type SlideDirection = "next" | "prev";

const TIP_DURATION = 10000;
const DRAG_THRESHOLD = 5;      //これ以上動いたらクリックではなくドラッグとみなす(px)

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

    const scrollArea = useRef<HTMLDivElement>(null);
    const dragStart = useRef<{ x: number; scrollLeft: number } | null>(null);
    const isDragged = useRef(false);

    function isOnScrollbar(event: MouseEvent<HTMLDivElement>): boolean {
        const target = event.target as HTMLElement;
        return target.classList.contains("tips-scroll") && event.nativeEvent.offsetY > target.clientHeight;
    }

    //文があふれているときだけ、マウスのドラッグで横スクロールする(タッチはブラウザ標準のスクロール)
    function handlePointerDown(event: PointerEvent<HTMLDivElement>): void {
        isDragged.current = false;
        const area = scrollArea.current;
        if (event.pointerType !== "mouse" || area === null) return;
        if (area.scrollWidth <= area.clientWidth) return;
        if (isOnScrollbar(event)) return;
        dragStart.current = { x: event.clientX, scrollLeft: area.scrollLeft };
        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event: PointerEvent<HTMLDivElement>): void {
        const area = scrollArea.current;
        if (dragStart.current === null || area === null) return;
        const dx = event.clientX - dragStart.current.x;
        if (Math.abs(dx) > DRAG_THRESHOLD) isDragged.current = true;
        if (isDragged.current) area.scrollLeft = dragStart.current.scrollLeft - dx;
    }

    function handlePointerUp(): void {
        dragStart.current = null;
    }

    function handleClick(event: MouseEvent<HTMLDivElement>): void {
        if (isDragged.current) {            //ドラッグの後のクリックでは切り替えない
            isDragged.current = false;
            return;
        }
        if (isOnScrollbar(event)) return;   //スクロールバーの操作では切り替えない
        const rect = event.currentTarget.getBoundingClientRect();
        const clickedLeft: boolean = event.clientX < rect.left + rect.width / 2;
        switchTip(clickedLeft ? "prev" : "next");
    }

    if (tips.length === 0) return null;

    return (
        <div className="tips-bar">
            <div className="tips-body"
                onClick={handleClick}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                <div key={switchCount} className={"tips-text tips-slide-" + direction}>
                    <div className="tips-scroll" ref={scrollArea}>
                        <div className="tips-scroll-content">{tips[tipNo]}</div>
                    </div>
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
