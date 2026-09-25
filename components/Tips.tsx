import "../styles/Tips.css"

const TIPS_SEPARATOR = "    ／    ";

const tips: string[] = [
    "石を6つ直線に並べたら勝ち。縦でも横でも斜めでもいい",
    "最初の1手だけが1つ。そのあとはお互い2つずつ置いていく",
    "持ち時間は自分の手番でしか減らない。相手が考えている間に読んでおくと得をする",
    "石を置くたびに持ち時間は増える。迷い続けるより、置いてから考える方がよいこともある",
    "十字や✖形に並べると制限時間が緩和される",
];

export function Tips() {
    return (
        <div className="tips-bar">
            <div className="tips-text">{tips.join(TIPS_SEPARATOR)}</div>
        </div>
    );
}
