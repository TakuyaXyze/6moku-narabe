import { Zen_Antique, Cormorant_Garamond } from "next/font/google";
import "../styles/ClearScreen.css";

//日本語の書体は文字の範囲が広いので、先読みはしない
const kanjiFont = Zen_Antique({ weight: "400", subsets: ["latin"], preload: false, variable: "--clear-kanji-font" });
const latinFont = Cormorant_Garamond({ weight: ["400", "600"], subsets: ["latin"], variable: "--clear-latin" });

//一度も負けずにクリアしたときだけ、別の言葉で祝う
const PERFECT_MESSAGE = "一度も負けずに全ステージクリア\nおめでとう";
const CLEAR_MESSAGE = "全ステージクリアおめでとう\n次は一度も負けずにクリアを目指そう";

type Props = {
    lossCount: number;
    onRestart: () => void;
}

//直前に勝利の帯(横長)が出るので、縦長の掛け軸にして場面が変わったことを見せる
export function ClearScreen({ lossCount, onRestart }: Props) {
    return (
        <div className={"clear-screen " + kanjiFont.variable + " " + latinFont.variable}>
            <div className="clear-scroll">
                <div className="clear-latin">ALL CLEAR</div>
                <div className="clear-kanji">免許皆伝</div>
                <div className="clear-seal">六目</div>
            </div>
            <div className="clear-message">{(lossCount === 0) ? PERFECT_MESSAGE : CLEAR_MESSAGE}</div>
            <button className="clear-button" onClick={() => onRestart()}>最初から</button>
        </div>
    );
}
