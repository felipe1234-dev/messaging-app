class Audio {
    public media?: MediaRecorder;
    public stream?: MediaStream;
    public chunks: Blob[];
    public recording: boolean;
    public paused: boolean;
    private audioCtx?: AudioContext;

    public onStart?: () => void | Promise<void>;
    public onData?: (chunk: Blob) => void | Promise<void>;
    public onVisualize?: (analyser: AnalyserNode) => void | Promise<void>;
    public onPause?: () => void | Promise<void>;
    public onResume?: () => void | Promise<void>;
    public onStop?: (result: Blob) => void | Promise<void>;

    constructor() {
        this.chunks = [];
        this.recording = false;
        this.paused = false;
    }

    public async init() {
        const hasSupport = Audio.checkSupport();
        if (!hasSupport) throw new Error("No support");

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });

        this.media = new MediaRecorder(stream);
        this.stream = stream;

        this.visualize(stream);

        this.media.onstart = () => {
            this.recording = true;
            if (this.onStart) this.onStart();
        };

        this.media.ondataavailable = (evt) => {
            if (!this.recording) return;
            if (this.paused) return;

            const chunk = evt.data;
            this.chunks.push(chunk);

            if (this.onData) this.onData(chunk);
        };

        this.media.onpause = () => {
            this.paused = true;
            if (this.onPause) this.onPause();
        };

        this.media.onresume = () => {
            this.paused = false;
            if (this.onResume) this.onResume();
        };

        this.media.onstop = () => {
            const result = new Blob(this.chunks, {
                type: "audio/ogg; codecs=opus",
            });

            this.recording = false;
            this.chunks = [];

            if (this.onStop) this.onStop(result);
        };

        return this;
    }

    public start() {
        if (!this.media) return;
        if (this.recording) return;
        this.media.start(1000);
    }

    public pause() {
        if (!this.media) return;
        if (this.paused) return;
        this.media.pause();
    }

    public resume() {
        if (!this.media) return;
        if (!this.paused) return;
        this.media.resume();
    }

    public stop() {
        if (!this.media) return;
        if (!this.recording) return;
        this.media.stop();
    }

    private visualize(stream: MediaStream) {
        if (!this.audioCtx) {
            this.audioCtx = new AudioContext();
        }

        const source = this.audioCtx.createMediaStreamSource(stream);
        const analyser = this.audioCtx.createAnalyser();
        analyser.fftSize = 2048;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        source.connect(analyser);

        const visualize = () => {
            requestAnimationFrame(visualize);
            analyser.getByteTimeDomainData(dataArray);
            if (this.onVisualize) this.onVisualize(analyser);
        };

        visualize();
    }

    public static checkSupport() {
        return !!(
            navigator.mediaDevices && navigator.mediaDevices.getUserMedia
        );
    }
}

export default Audio;
