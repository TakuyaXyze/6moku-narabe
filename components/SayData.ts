import type { GameResult } from "./ResultPopup";

//勝敗画面の下の札で、相手が言う台詞
//相手の名前ごとに、ラウンドの順に並べる。1つ目がラウンド1、2つ目がラウンド2
//win はあなたが勝ったとき、lose は負けたとき、timeup は時間切れ、draw は引き分けのときの台詞
//1つの場面に台詞を何個でも書ける。そのときは毎回その中からランダムに1つ選ぶ。空([])なら札を出さない
export type RoundSays = Record<GameResult, string[]>;

export const sayData: Record<string, RoundSays[]> = {
    "素人": [
        {
            win: ["もう並んだのか…"],
            lose: ["止めるのも修行のうちさ"],
            timeup: [""],
            draw: ["もう一度勝負だ"],
        },
    ],
    "見習い": [
        {
            win: ["まだまだ、次は逆の手番で再戦だ"],
            lose: ["止めるのも修行のうちさ"],
            timeup: ["時計も見ないとね"],
            draw: ["もう一度勝負だ"],
        },
        {
            win: ["なるほど、なかなかやるな"],
            lose: ["手番のおかげで勝てただけだったな"],
            timeup: ["時計も見ないとね"],
            draw: ["もう一度勝負だ"],
        },
    ],
    "門下生": [
        {
            win: ["この速さについてこれたのか"],
            lose: ["まだまだ甘かったな"],
            timeup: ["時間管理も技術のうちだ"],
            draw: ["もう一度勝負だ"],
        },
        {
            win: ["その速さ、本物だな"],
            lose: ["まだまだ甘かったな"],
            timeup: ["時間管理も技術のうちだ"],
            draw: ["もう一度勝負だ"],
        },
    ],
    "師範代": [
        {
            win: ["なかなかだな、隙をつかれた"],
            lose: ["その形は見えている"],
            timeup: ["時間管理も技術のうちだ"],
            draw: ["次で決着をつけよう"],
        },
        {
            win: ["予想以上の実力だった"],
            lose: ["詰めが甘いのは難点だな"],
            timeup: ["時間管理も技術のうちだ"],
            draw: ["次で決着をつけよう"],
        },
    ],
    "師範": [
        {
            win: ["なるほど、噂に聞いたとおりだ"],
            lose: ["ここまでたどり着いたのは流石だ"],
            timeup: ["時間管理も技術のうちだ"],
            draw: ["次は決着をつけよう"],
        },
        {
            win: ["見事だ。教えることはもうない"],
            lose: ["ここまでたどり着いたのは流石だ"],
            timeup: ["時間管理も技術のうちだ"],
            draw: ["次は決着をつけよう"],
        },
    ],
};

const NO_SAYS: RoundSays = { win: [], lose: [], timeup: [], draw: [] };

//書かれていない相手やラウンドでは、札を出さない
export function findSays(name: string, roundNo: number): RoundSays {
    return sayData[name]?.[roundNo - 1] ?? NO_SAYS;
}
