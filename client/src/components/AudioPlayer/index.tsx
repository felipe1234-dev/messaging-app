import React from "react";
import { StyledAudioPlayer, StyledAudioPlayerProps } from "./styles";

interface AudioPlayerProps
    extends Omit<React.HTMLProps<HTMLAudioElement>, "ref" | "as">,
        Partial<StyledAudioPlayerProps> {
    src: string;
    controls?: boolean;
}

function AudioPlayer(props: AudioPlayerProps) {
    const {
        src,
        controls = true,
        preload = "metadata" as "metadata",
        variant = "highlight",
        color,
        ...rest
    } = props;

    return (
        <StyledAudioPlayer
            src={src}
            controls={controls}
            preload={preload}
            variant={variant}
            color={color}
            controlsList="nodownload"
            {...rest}
        />
    );
}

export default AudioPlayer;
export type { AudioPlayerProps };
