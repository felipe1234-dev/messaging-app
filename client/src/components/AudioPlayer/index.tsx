import { useState, useEffect, useMemo } from "react";

import { getTimeCodeFromMs } from "@functions";
import { useInterval, useForceUpdate } from "@hooks";

import { Icon } from "@styles/layout";
import { AudioPlayerContainer, AudioTime } from "./styles";

import { Play, Pause } from "@styled-icons/fa-solid";

import Button from "../Button";
import Slider from "../Slider";

interface AudioPlayerProps {
    src: string;
    sliderColor?: string;
    duration: number;
}

function AudioPlayer(props: AudioPlayerProps) {
    const { src, sliderColor, duration } = props;

    const [audio, setAudio] = useState<HTMLAudioElement>();
    const { forceUpdate } = useForceUpdate();

    useEffect(() => {
        setAudio(new Audio(src));
    }, [src]);

    useInterval(() => forceUpdate(), 500);

    const currentTime = useMemo(
        () => (audio?.currentTime || 0) * 1000,
        [audio?.currentTime]
    );
    const paused = useMemo(() => !!audio?.paused, [audio?.paused]);

    const time = useMemo(
        () =>
            getTimeCodeFromMs(
                currentTime !== undefined && currentTime !== 0
                    ? currentTime
                    : duration
            ),
        [currentTime, duration]
    );

    if (!audio) return <></>;

    const handlePlayAudio = () => {
        audio.play();
    };

    const handlePauseAudio = () => {
        audio.pause();
    };

    const handleChangeCurrentTime = (value: number) => {
        audio.currentTime = value;
    };

    return (
        <AudioPlayerContainer>
            <Button
                round
                iconed
                transparent
                iconVariant="highlight"
                onClick={paused ? handlePlayAudio : handlePauseAudio}
                p={8}
            >
                <Icon icon={paused ? <Play /> : <Pause />} />
            </Button>
            <Slider
                variant="highlight"
                color={sliderColor}
                onChange={handleChangeCurrentTime}
                value={currentTime}
                min={0}
                max={duration}
            />
            <AudioTime>{time}</AudioTime>
        </AudioPlayerContainer>
    );
}

export default AudioPlayer;
export type { AudioPlayerProps };
