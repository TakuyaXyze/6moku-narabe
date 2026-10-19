import type { GameResult } from "./ResultPopup";

//勝敗画面の下の札で、相手が言う台詞
//相手の名前ごとに、ラウンドの順に並べる。1つ目がラウンド1、2つ目がラウンド2
//win はあなたが勝ったとき、lose は負けたとき、timeup は時間切れ、draw は引き分けのときの台詞
//1つの場面に台詞を何個でも書ける。そのときは毎回その中からランダムに1つ選ぶ。空([])なら札を出さない
export type RoundSays = Record<GameResult, string[]>;

export const sayData: Record<string, RoundSays[]> = {
    "素人": [
        {
            win: ["なかなかやるな"],
            lose: ["まだまだだな"],
            timeup: [],
            draw: [],
        },
    ],
    "見習い": [
        {
            win: ["なかなかやるな"],
            lose: ["まだまだだな"],
            timeup: [],
            draw: [],
        },
        {
            win: ["なかなかやるな"],
            lose: ["まだまだだな"],
            timeup: [],
            draw: [],
        },
    ],
    "門下生": [
        {
            win: ["なかなかやるな"],
            lose: ["まだまだだな"],
            timeup: [],
            draw: [],
        },
        {
            win: ["なかなかやるな"],
            lose: ["まだまだだな"],
            timeup: [],
            draw: [],
        },
    ],
    "師範代": [
        {
            win: ["なかなかやるな"],
            lose: ["まだまだだな"],
            timeup: [],
            draw: [],
        },
        {
            win: ["なかなかやるな"],
            lose: ["まだまだだな"],
            timeup: [],
            draw: [],
        },
    ],
    "師範": [
        {
            win: ["なかなかやるな"],
            lose: ["まだまだだな"],
            timeup: [],
            draw: [],
        },
        {
            win: ["なかなかやるな"],
            lose: ["まだまだだな"],
            timeup: [],
            draw: [],
        },
    ],
};

const NO_SAYS: RoundSays = { win: [], lose: [], timeup: [], draw: [] };

//書かれていない相手やラウンドでは、札を出さない
export function findSays(name: string, roundNo: number): RoundSays {
    return sayData[name]?.[roundNo - 1] ?? NO_SAYS;
}
