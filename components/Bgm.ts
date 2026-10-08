"use client";

import { useEffect, useRef } from "react";

export type BgmTrack = {
    src: string;
};

const BGM_VOLUME = 0.3;
const FADE_SECONDS = 1;

//音量はWeb Audioのゲインで操作する。iPhoneのSafariはaudio要素のvolumeを無視するため
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
    if (audioContext === null) audioContext = new AudioContext();
    return audioContext;
}

function setVolume(gain: GainNode, target: number): void {
    gain.gain.cancelScheduledValues(getAudioContext().currentTime);
    gain.gain.value = target;
}

function fadeTo(gain: GainNode, target: number): void {
    const now = getAudioContext().currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(target, now + FADE_SECONDS);
}

type BgmControl = {
    resume: () => void;
    mute: () => void;
};

//曲を切り替えるときは、前の曲をフェードアウトしながら次の曲をフェードインする
export function useBgm(track: BgmTrack | null, isOn: boolean): void {
    const src: string | null = track?.src ?? null;
    const isOnRef = useRef(isOn);
    const control = useRef<BgmControl | null>(null);

    useEffect(() => {
        isOnRef.current = isOn;
        if (isOn) control.current?.resume();
        else control.current?.mute();
    }, [isOn])

    useEffect(() => {
        if (src === null) return;
        const context = getAudioContext();
        const audio = new Audio(src);
        audio.loop = true;
        const gain = context.createGain();
        gain.gain.value = 0;
        context.createMediaElementSource(audio).connect(gain).connect(context.destination);

        let stopped = false;
        let fadesIn = true;         //曲の始まりだけフェードインする

        function play(): void {
            if (stopped || !isOnRef.current) return;
            context.resume();
            audio.play()
                .then(() => {
                    if (!isOnRef.current) return;       //再生を待つ間にオフにされたとき
                    if (fadesIn) fadeTo(gain, BGM_VOLUME);
                    else setVolume(gain, BGM_VOLUME);
                    fadesIn = false;
                    if (context.state !== "running") waitForUserAction();   //再生できても音の出口が止められているとき
                })
                .catch(() => waitForUserAction());      //ブラウザに自動再生を止められたとき
        }

        function mute(): void {
            setVolume(gain, 0);
            audio.pause();
        }

        //ブラウザは、ユーザーが一度も操作していないページの音を鳴らさない。最初のクリックやキー入力を待って鳴らす
        function waitForUserAction(): void {
            document.addEventListener("pointerdown", play, { once: true });
            document.addEventListener("keydown", play, { once: true });
        }

        const ownControl: BgmControl = { resume: play, mute };
        control.current = ownControl;
        play();

        return () => {
            stopped = true;
            if (control.current === ownControl) control.current = null;
            document.removeEventListener("pointerdown", play);
            document.removeEventListener("keydown", play);
            fadeTo(gain, 0);
            setTimeout(() => {
                audio.pause();
                gain.disconnect();
            }, FADE_SECONDS * 1000);
        };
    }, [src])
}
