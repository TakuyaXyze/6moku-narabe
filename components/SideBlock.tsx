export type BowlState = "active" | "waiting" | null;

type Props = {
    side: "com" | "player";
    name: string;
    isBlack: boolean;
    bowlState: BowlState;
}

export function SideBlock({ side, name, isBlack, bowlState }: Props) {
    //CPU側は碁笥が上、自分側は碁笥が下
    const bowlClass: string = "goishi-box-image-" + side
        + (bowlState === null ? "" : " bowl-" + bowlState);

    const bowl = (
        <div className={bowlClass}>
            <img src={isBlack ? "goke-black.png" : "goke-white.png"}
                alt={isBlack ? "black" : "white"}
                width="96"
            />
        </div>
    );

    return (
        <div className="side-block">
            {side === "com" && bowl}
            <div className="side-name">{name}</div>
            <div className="side-stone-row">
                <span className={"side-stone " + (isBlack ? "side-black" : "side-white")} />
                {isBlack ? "先攻" : "後攻"}
            </div>
            {side === "player" && bowl}
        </div>
    );
}
