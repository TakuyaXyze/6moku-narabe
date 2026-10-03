import { ComputerSetting } from "../computers/ComputerSetting";
import { BgmTrack } from "./Bgm";

export type StageInfo = {
    stageNo: number;
    rounds: number;
    computer: ComputerSetting;
    timeLimit: number;
    timeIncrement: number;
    field: string;
    bgm: BgmTrack;
    hints: string[];
};

export const stageInfo: StageInfo[] = [
    {
        stageNo: 1, rounds: 1, timeLimit: Number.POSITIVE_INFINITY, timeIncrement: 0, field: "morning",
        bgm: { src: "/bgm/maou_loop_bgm_ethnic33.mp3", rate: 1.5 },
        computer: { name: "素人", depth: 2, beamSize: 20, budget: 150000, sight: 1, defense: 0, orderDefense: 0, blunder: 0.5 },
        hints: [
            "持ち時間は無制限",
            "この相手は止めにこない。自分の列を伸ばすことだけ考えればいい",
        ],
    },
    {
        stageNo: 2, rounds: 2, timeLimit: 10000, timeIncrement: 5000, field: "noon",
        bgm: { src: "/bgm/maou_bgm_orchestra25.mp3", rate: 1 },
        computer: { name: "見習い", depth: 2, beamSize: 20, budget: 150000, sight: 3, defense: 0.7, orderDefense: 0.7, blunder: 0.45 },
        hints: [
            "持ち時間が設定される",
            "持ち時間は石を置くたびに追加",
            "余った持ち時間の一部は次のステージへ持ち越される",
        ],
    },
    {
        stageNo: 3, rounds: 2, timeLimit: 5000, timeIncrement: 2000, field: "sunset",
        bgm: { src: "/bgm/maou_bgm_orchestra20.mp3", rate: 1 },
        computer: { name: "門下生", depth: 2, beamSize: 20, budget: 150000, sight: 3, defense: 0.7, orderDefense: 0.7, blunder: 0.45 },
        hints: [
            "強さは見習いと同じ。違うのは持ち時間の短さだけ",
            "石を十字やX形に並べると持ち時間が増える",
        ],
    },
    {
        stageNo: 4, rounds: 2, timeLimit: 20000, timeIncrement: 5000, field: "dusk",
        bgm: { src: "/bgm/maou_bgm_orchestra21.mp3", rate: 1 },
        computer: { name: "師範代", depth: 4, beamSize: 20, budget: 50000, sight: 4, defense: 1, orderDefense: 2, blunder: 0.4 },
        hints: [
            "先読みが深い。わかりやすい形は作る前に潰される",
            "ミスをする確率は高い。相手の隙をつけるように、リーチを作り続ける",
        ],
    },
    {
        stageNo: 5, rounds: 2, timeLimit: 20000, timeIncrement: 5000, field: "hall",
        bgm: { src: "/bgm/maou_loop_bgm_fantasy12.mp3", rate: 1 },
        computer: { name: "師範", depth: 4, beamSize: 50, budget: 100000, sight: 5, defense: 1, orderDefense: 2, blunder: 0 },
        hints: [
            "この相手はなかなか間違えない",
            "相手の列を見逃さず、止め続ける",
        ],
    },
];
