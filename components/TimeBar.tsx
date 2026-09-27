const TIME_BAR_FULL = 60000;
const TIME_BAR_YELLOW_RATIO = 0.4;
const TIME_BAR_RED_RATIO = 0.2;
const COUNTDOWN_TIME = 10000;

type Props = {
    remainingTime: number;
    bonusTime: number;
}

export function TimeBar({ remainingTime, bonusTime }: Props) {
    const shownTime: number = Math.max(remainingTime, 0);
    const timeBarRatio: number = Math.min(shownTime / TIME_BAR_FULL, 1);
    const timeBarColor: string = (timeBarRatio >= TIME_BAR_YELLOW_RATIO) ? "time-bar-green"
        : ((timeBarRatio >= TIME_BAR_RED_RATIO) ? "time-bar-yellow" : "time-bar-red");
    const isHurrying: boolean = shownTime <= COUNTDOWN_TIME;
    const timeCount: string = isHurrying ? (shownTime / 1000).toFixed(1) : String(Math.ceil(shownTime / 1000));

    return (
        <div className="remaining-time">
            <div className="time-bar">
                <div className={"time-bar-fill " + timeBarColor}
                    style={{ width: (timeBarRatio * 100) + "%" }}
                />
            </div>
            <div className={isHurrying ? "time-count time-count-hurry" : "time-count"}>{timeCount}</div>
            {bonusTime > 0 &&
                <div className="time-bonus">+{bonusTime / 1000}</div>
            }
        </div>
    );
}
