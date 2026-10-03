"use client";

import { useEffect } from "react";

export type BgmTrack = {
    src: string;
    rate: number;       //再生速度。音程は保ったまま速さだけ変わる
};

const BGM_VOLUME = 0.3;
const FADE_SECONDS = 1;

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
export function useBgm(track: BgmTrack | null): void {
    const src: string | null = track?.src ?? null;
    const rate: number = track?.rate ?? 1;

    useEffect(() => {
        if (src === null) return;
        const context = getAudioContext();
        const audio = new Audio(src);
        audio.loop = true;
        audio.defaultPlaybackRate = rate;
        audio.playbackRate = rate;
        const gain = context.createGain();
        gain.gain.value = 0;
        context.createMediaElementSource(audio).connect(gain).connect(context.destination);

        let stopped = false;

        function start(): void {
            if (stopped) return;
            context.resume();
            audio.play()
                .then(() => {
                    fadeTo(gain, BGM_VOLUME);
                    if (context.state !== "running") waitForUserAction();   //再生できても音の出口が止められているとき
                })
                .catch(() => waitForUserAction());      //ブラウザに自動再生を止められたとき
        }

        //ブラウザは、ユーザーが一度も操作していないページの音を鳴らさない。最初のクリックやキー入力を待って鳴らす
        function waitForUserAction(): void {
            document.addEventListener("pointerdown", start, { once: true });
            document.addEventListener("keydown", start, { once: true });
        }

        start();

        return () => {
            stopped = true;
            document.removeEventListener("pointerdown", start);
            document.removeEventListener("keydown", start);
            fadeTo(gain, 0);
            setTimeout(() => {
                audio.pause();
                gain.disconnect();
            }, FADE_SECONDS * 1000);
        };
    }, [src, rate])
}
