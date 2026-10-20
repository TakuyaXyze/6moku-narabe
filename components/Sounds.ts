export type SoundName = "place" | "warning" | "win" | "recovering" | "timeup" | "clapping" | "select";

const SOUND_FILES: Record<SoundName, string> = {
    place: "/sounds/place-stone.mp3",
    warning: "/sounds/warning-single.mp3",
    win: "/sounds/win.mp3",
    recovering: "/sounds/recovering.mp3",
    timeup: "/sounds/timeup.mp3",
    clapping: "/sounds/clapping.mp3",
    select: "/sounds/select.mp3",
};

const DEFAULT_VOLUME = 0.8;

//ほかの音より大きく聞こえる音だけ、音量を個別に下げる
const SOUND_VOLUMES: Partial<Record<SoundName, number>> = {
    select: 0.25,
};

//SEはページを開いたときに読み込んでおき、Web Audioで鳴らす。鳴らすたびにファイルを読むと、公開版では音の入りが遅れる
//音量もWeb Audioのゲインで操作する。iPhoneのSafariはaudio要素のvolumeを無視するため
//BGMとは別の出口にする。BGMをオフにすると、BGMの出口は止まるため
let audioContext: AudioContext | null = null;
const buffers = new Map<SoundName, AudioBuffer>();

function getAudioContext(): AudioContext {
    if (audioContext === null) audioContext = new AudioContext();
    return audioContext;
}

export function loadSounds(): void {
    const context = getAudioContext();
    //最初に画面を触った時点で出口を動かしておく。鳴らすときに動かし始めると、その分だけ音が遅れる
    document.addEventListener("pointerdown", () => context.resume(), { once: true });
    (Object.keys(SOUND_FILES) as SoundName[]).forEach((name) => {
        if (buffers.has(name)) return;
        fetch(SOUND_FILES[name])
            .then((response) => response.arrayBuffer())
            .then((data) => context.decodeAudioData(data))
            .then((buffer) => buffers.set(name, buffer))
            .catch((error) => console.log("SE読み込みに失敗:", error));
    });
}

export function playSound(name: SoundName, volume: number = SOUND_VOLUMES[name] ?? DEFAULT_VOLUME): void {
    const buffer = buffers.get(name);
    //読み込みが間に合わなかったときは、その場でファイルを読んで鳴らす
    if (buffer === undefined) {
        const sound = new Audio(SOUND_FILES[name]);
        sound.volume = volume;
        sound.play().catch((error) => console.log("SE再生に失敗:", error));
        return;
    }
    const context = getAudioContext();
    context.resume();       //ブラウザは、ユーザーが一度も操作していないページの音を止めている
    const gain = context.createGain();
    gain.gain.value = volume;
    gain.connect(context.destination);
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(gain);
    source.onended = () => gain.disconnect();
    source.start();
}
