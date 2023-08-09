import styled, { css } from "styled-components";
import { Variant } from "@types";

interface StyledAudioPlayerProps {
    variant: Variant;
    color?: string;
}

const StyledAudioPlayer = styled.audio<StyledAudioPlayerProps>`
    ${({ variant, color, theme }) => {
        const bgColor = color || theme.background[variant];

        return css`
            &::-webkit-media-controls-panel {
                background-color: ${bgColor};
                outline: none;
                border: none;
            }

            &::-webkit-media-controls-mute-button,
            &::-webkit-media-controls-play-button,
            &::-webkit-media-controls-timeline-container,
            &::-webkit-media-controls-current-time-display,
            &::-webkit-media-controls-time-remaining-display,
            &::-webkit-media-controls-timeline,
            &::-webkit-media-controls-volume-slider-container,
            &::-webkit-media-controls-volume-slider,
            &::-webkit-media-controls-seek-back-button,
            &::-webkit-media-controls-seek-forward-button,
            &::-webkit-media-controls-fullscreen-button,
            &::-webkit-media-controls-rewind-button,
            &::-webkit-media-controls-return-to-realtime-button,
            &::-webkit-media-controls-toggle-closed-captions-button {
                filter: invert(100%);
                outline: none;
                border: none;
            }
        `;
    }}
`;

export { StyledAudioPlayer };
export type { StyledAudioPlayerProps };
