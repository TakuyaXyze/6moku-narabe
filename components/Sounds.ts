export type SoundName = "place" | "warning" | "win" | "recovering" | "timeup" | "clapping";

const SOUND_FILES: Record<SoundName, string> = {
    place: "/sounds/place-stone.mp3",
    warning: "/sounds/warning-single.mp3",
    win: "/sounds/win.mp3",
    recovering: "/sounds/recovering.mp3",
    timeup: "/sounds/timeup.mp3",
    clapping: "/sounds/clapping.mp3",
};

export const DEFAULT_VOLUME = 0.8;

export function playSound(name: SoundName, volume: number = DEFAULT_VOLUME): void {
    const sound = new Audio(SOUND_FILES[name]);
    sound.volume = volume;
    sound.play().catch((error) => console.log("SE再生に失敗:", error));
}
