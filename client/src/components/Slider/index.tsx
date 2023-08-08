import { useState } from "react";
import { Variant } from "@types";
import { SliderContainer, Thumb, Progressbar, Sliderbar } from "./styles";

interface SliderProps {
    variant?: Variant;
    color?: string;
    onChange: (value: number) => void | Promise<void>;
    min: number;
    max: number;
    value: number;
}

function Slider(props: SliderProps) {
    const { variant = "highlight", color, onChange, min, max, value } = props;
    const [sliderbarEl, setSliderbarEl] = useState<HTMLDivElement | null>(null);

    const percentage = Math.max(
        0,
        Math.min(((value - min) / (max - min)) * 100, 100)
    );

    const baseProps = {
        variant,
        color,
        percentage,
    };

    const calculatePercentage = (posX: number) => {
        if (!sliderbarEl) return 0;

        const rect = sliderbarEl.getBoundingClientRect();
        const minX = rect.left;
        const maxX = minX + sliderbarEl.offsetWidth;

        const newPercentage = Math.max(
            0,
            Math.min(((posX - minX) / (maxX - minX)) * 100, 100)
        );

        return newPercentage;
    };

    const handleSliderbarClick = (evt: React.MouseEvent<HTMLDivElement>) => {
        if (!sliderbarEl) return;

        evt.preventDefault();

        const newPercentage = calculatePercentage(evt.clientX);
        const newValue = (newPercentage / 100) * max;

        onChange(newValue);
    };

    const handleGrapThumb = (evt: React.MouseEvent<HTMLDivElement>) => {
        if (!sliderbarEl) return;

        evt.preventDefault();

        let posX = evt.clientX;

        document.onmousemove = (evt) => {
            evt.preventDefault();

            posX = evt.clientX;

            const newPercentage = calculatePercentage(posX);
            const newValue = (newPercentage / 100) * max;

            onChange(newValue);
        };

        document.onmouseup = (evt) => {
            evt.preventDefault();
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };

    return (
        <SliderContainer>
            <Sliderbar
                ref={(el) => setSliderbarEl(el)}
                onMouseDown={handleSliderbarClick}
                {...baseProps}
            />
            <Progressbar {...baseProps} />
            <Thumb
                {...baseProps}
                onMouseDown={handleGrapThumb}
            />
        </SliderContainer>
    );
}

export default Slider;
export type { SliderProps };
