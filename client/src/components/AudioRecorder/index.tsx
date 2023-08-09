import { useState, useEffect, useMemo, useRef } from "react";

import { useAlert } from "@providers";
import { Audio } from "@services";
import { useInterval } from "@hooks";
import { AudioInfo } from "@types";

import { Icon } from "@styles/layout";
import { AudioRecorderContainer, AudioDuration } from "./styles";

import Button from "../Button";
import AudioPlayer from "../AudioPlayer";

import { ControllerRecord } from "@styled-icons/entypo";
import { RecordStop } from "@styled-icons/fluentui-system-regular";
import { Play, Pause } from "@styled-icons/fa-solid";
import { DeleteDismiss } from "@styled-icons/fluentui-system-filled";
import { Check2 } from "@styled-icons/bootstrap";
import { getTimeCodeFromMs } from "@functions";

interface AudioRecorderProps {
    autoStart?: boolean;
    color: string;
    onStart?: () => void | Promise<void>;
    onData?: (chunk: Blob) => void | Promise<void>;
    onVisualize?: (analyser: AnalyserNode) => void | Promise<void>;
    onPause?: () => void | Promise<void>;
    onResume?: () => void | Promise<void>;
    onStop?: (result: Blob) => void | Promise<void>;
    onCancel?: (result: Blob, info: AudioInfo) => void | Promise<void>;
    onSave?: (result: Blob, info: AudioInfo) => Promise<void>;
}

function AudioRecorder(props: AudioRecorderProps) {
    const {
        autoStart = false,
        color,
        onStart,
        onData,
        onVisualize,
        onPause,
        onResume,
        onStop,
        onCancel,
        onSave,
    } = props;

    const alert = useAlert();
    const hasSupport = Audio.checkSupport();

    const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null);
    const [startTime, setStartTime] = useState(new Date());
    const [lastTime, setLastTime] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob>();
    const [audioInfo, setAudioInfo] = useState<AudioInfo>();
    const [sending, setSending] = useState(true);

    const visualizeAudio = (analyser: AnalyserNode) => {
        if (!canvasCtx || !canvasEl) return;

        const width = canvasEl.width;
        const height = canvasEl.height;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.clearRect(0, 0, width, height);

        canvasCtx.fillStyle = "rgba(0, 0, 0, 0)";
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = color;

        canvasCtx.fillRect(0, 0, width, height);
        canvasCtx.beginPath();

        const sliceWidth = (width * 1.5) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * height) / 2;

            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        canvasCtx.lineTo(canvasEl.width, canvasEl.height / 2);
        canvasCtx.stroke();

        if (onVisualize) onVisualize(analyser);
    };

    const stopAudio = (result: Blob) => {
        setAudioBlob(result);

        if (onStop) onStop(new Blob([result], { type: result.type }));
    };

    const canvasCtx = useMemo(() => {
        if (!canvasEl) return undefined;
        return canvasEl.getContext("2d");
    }, [canvasEl]);

    const audioRecorder = useMemo(() => {
        const audio = new Audio();

        audio.onStart = onStart;
        audio.onData = onData;
        audio.onPause = onPause;
        audio.onResume = onResume;
        audio.onVisualize = visualizeAudio;
        audio.onStop = stopAudio;

        return audio;
    }, [canvasCtx, canvasEl]);

    const audioDuration = useMemo(() => {
        return getTimeCodeFromMs(timeElapsed);
    }, [timeElapsed]);

    const audioURL = useMemo(() => {
        return audioBlob ? URL.createObjectURL(audioBlob) : undefined;
    }, [audioBlob]);

    const handleStart = () => {
        setStartTime(new Date());
        setLastTime(Date.now());
        setTimeElapsed(0);

        audioRecorder.start();
    };

    const handleStop = () => {
        const endTime = new Date();

        const info: AudioInfo = {
            startTime: new Date(startTime.getTime()),
            endTime,
            duration: timeElapsed,
            unit: "ms",
        };

        setAudioInfo(info);

        audioRecorder.stop();
    };

    const handlePause = () => {
        audioRecorder.pause();
    };

    const handleResume = () => {
        audioRecorder.resume();
    };

    const handleCancelAudio = () => {
        if (!audioBlob || !audioInfo) return;

        if (onCancel) {
            onCancel(new Blob([audioBlob], { type: audioBlob.type }), {
                ...audioInfo,
            });
        }

        setAudioInfo(undefined);
        setAudioBlob(undefined);
        setStartTime(new Date());
        setLastTime(0);
        setTimeElapsed(0);
    };

    const handleSaveAudio = () => {
        if (!audioBlob || !audioInfo || !onSave) return;

        setSending(true);
        onSave(new Blob([audioBlob], { type: audioBlob.type }), {
            ...audioInfo,
        })
            .catch((err) => {
                alert.error((err as Error).message);
            })
            .finally(() => {
                setSending(false);
            });
    };

    useEffect(() => {
        if (!hasSupport)
            return alert.error(
                ":( Your browser doesn't support audio recording"
            );

        audioRecorder.init().then(() => {
            if (autoStart) handleStart();
        });
    }, [hasSupport, audioRecorder, autoStart]);

    useInterval(
        () => {
            if (!audioRecorder.recording || audioBlob) return;

            const then = lastTime;
            const now = Date.now();
            const delta = now - then;

            if (!audioRecorder.paused) {
                setTimeElapsed((prev) => prev + delta);
            }

            setLastTime(now);
        },
        500,
        [lastTime, audioRecorder, audioBlob]
    );

    const baseButtonProps = {
        iconVariant: "highlight" as "highlight",
        fullWidth: false,
        transparent: true,
        round: true,
        iconed: true,
        size: 1.3,
        p: 8,
        disabled: !hasSupport,
    };

    return (
        <AudioRecorderContainer>
            {!audioBlob && <AudioDuration>{audioDuration}</AudioDuration>}

            {!audioBlob ? (
                <canvas
                    ref={(el) => setCanvasEl(el)}
                    width={500}
                    height={100}
                />
            ) : (
                audioURL &&
                audioInfo && (
                    <AudioPlayer
                        src={audioURL}
                        color={color}
                    />
                )
            )}

            {!audioBlob ? (
                <>
                    {audioRecorder.recording && (
                        <Button
                            {...baseButtonProps}
                            onClick={
                                audioRecorder.paused
                                    ? handleResume
                                    : handlePause
                            }
                        >
                            <Icon
                                icon={
                                    audioRecorder.paused ? <Play /> : <Pause />
                                }
                            />
                        </Button>
                    )}
                    <Button
                        {...baseButtonProps}
                        onClick={
                            !audioRecorder.recording ? handleStart : handleStop
                        }
                    >
                        <Icon
                            icon={
                                !audioRecorder.recording ? (
                                    <ControllerRecord />
                                ) : (
                                    <RecordStop />
                                )
                            }
                        />
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        {...baseButtonProps}
                        variant="cancel"
                        onClick={handleCancelAudio}
                        disabled={sending}
                    >
                        <Icon icon={<DeleteDismiss />} />
                    </Button>
                    <Button
                        {...baseButtonProps}
                        variant="success"
                        onClick={handleSaveAudio}
                        loading={sending}
                    >
                        <Icon icon={<Check2 />} />
                    </Button>
                </>
            )}
        </AudioRecorderContainer>
    );
}

export default AudioRecorder;
export type { AudioRecorderProps };
