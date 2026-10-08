"use client";

import { useEffect } from "react";

export type BgmTrack = {
    src: string;
    overlap: number;    //次の周を、前の周が鳴り終わるより何秒早く鳴らし始めるか。終わりの余韻が次の頭に重なる
};

const BGM_VOLUME = 0.3;
const FADE_SECONDS = 1;
const START_DELAY = 0.05;       //鳴らし始めを予約する余裕(秒)

//音量はWeb Audioのゲインで操作する。iPhoneのSafariはaudio要素のvolumeを無視するため
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
    if (audioContext === null) audioContext = new AudioContext();
    return audioContext;
}

function fadeTo(gain: GainNode, target: number): void {
    const now = getAudioContext().currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(target, now + FADE_SECONDS);
}

//曲を切り替えるときは、前の曲をフェードアウトしながら次の曲をフェードインする
export function useBgm(track: BgmTrack | null, isOn: boolean): void {
    const src: string | null = track?.src ?? null;
    const overlap: number = track?.overlap ?? 0;

    //オフの間は音の出口ごと止める。曲の位置も、重なっている余韻もそのまま残る
    //ブラウザは、ユーザーが一度も操作していないページの音を鳴らさない。オンの間は、クリックやキー入力のたびに出口を開ける
    useEffect(() => {
        const context = getAudioContext();
        if (!isOn) {
            context.suspend();
            return;
        }
        context.resume();
        function resumeContext(): void {
            context.resume();
        }
        document.addEventListener("pointerdown", resumeContext);
        document.addEventListener("keydown", resumeContext);
        return () => {
            document.removeEventListener("pointerdown", resumeContext);
            document.removeEventListener("keydown", resumeContext);
        };
    }, [isOn])

    //同じ曲を、前の周が鳴り終わるoverlap秒前から重ねて鳴らす。開始時刻はWeb Audioの時計で予約するので、周の間隔は毎回同じになる
    useEffect(() => {
        if (src === null) return;
        const context = getAudioContext();
        const gain = context.createGain();
        gain.gain.value = 0;
        gain.connect(context.destination);

        const sources = new Set<AudioBufferSourceNode>();
        let stopped = false;

        fetch(src)
            .then((response) => response.arrayBuffer())
            .then((data) => context.decodeAudioData(data))
            .then((buffer) => {
                if (stopped) return;
                const startAt: number = context.currentTime + START_DELAY;
                const period: number = buffer.duration - overlap;
                //鳴り終わった周が2つ先の周を予約する。前の周が鳴り終わる前に次を重ねるので、常に次の周までを予約しておく
                function reserve(lap: number): void {
                    if (stopped) return;
                    const source = context.createBufferSource();
                    source.buffer = buffer;
                    source.connect(gain);
                    source.onended = () => {
                        sources.delete(source);
                        reserve(lap + 2);
                    };
                    source.start(startAt + lap * period);       //出口が止まっている間は時計も止まるので、予約はずれない
                    sources.add(source);
                }
                reserve(0);
                reserve(1);
                fadeTo(gain, BGM_VOLUME);
            })
            .catch(() => { });       //読み込めなければBGMなしで続ける

        return () => {
            stopped = true;
            fadeTo(gain, 0);
            setTimeout(() => {
                sources.forEach((source) => source.stop());
                gain.disconnect();
            }, FADE_SECONDS * 1000);
        };
    }, [src, overlap])
}
