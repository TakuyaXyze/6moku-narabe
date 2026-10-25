import { Zen_Antique, Cormorant_Garamond } from "next/font/google";
import "../styles/ClearScreen.css";

//日本語の書体は文字の範囲が広いので、先読みはしない
const kanjiFont = Zen_Antique({ weight: "400", subsets: ["latin"], preload: false, variable: "--clear-kanji-font" });
const latinFont = Cormorant_Garamond({ weight: ["400", "600"], subsets: ["latin"], variable: "--clear-latin" });

type Props = {
    lossCount: number;
    onRestart: () => void;
}

//直前に勝利の帯(横長)が出るので、縦長の掛け軸にして場面が変わったことを見せる
//一度も負けずにクリアしたときは掛け軸だけを見せ、負けたことがあるときだけ回数と次の目標を添える
export function ClearScreen({ lossCount, onRestart }: Props) {
    return (
        <div className={"clear-screen " + kanjiFont.variable + " " + latinFont.variable}>
            <div className="clear-scroll">
                <div className="clear-latin">ALL CLEAR</div>
                <div className="clear-kanji">免許皆伝</div>
                <div className="clear-seal">六目</div>
            </div>
            {lossCount > 0 && (
                <div className="clear-result">
                    <div className="clear-loss">敗退回数 {lossCount}回</div>
                    <div className="clear-message">次は一度も負けずにクリアしよう</div>
                </div>
            )}
            <button className="clear-button" onClick={() => onRestart()}>最初から</button>
        </div>
    );
}
