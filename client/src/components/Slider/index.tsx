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

    const handleGrapThumb = (evt: React.MouseEvent<HTMLDivElement>) => {
        if (!sliderbarEl) return;

        evt.preventDefault();

        let posX = evt.clientX;

        document.onmousemove = (evt) => {
            evt.preventDefault();

            const minX = sliderbarEl.offsetLeft;
            const maxX = minX + sliderbarEl.offsetWidth;
            posX = posX - evt.clientX;

            const newPercentage = Math.max(
                0,
                Math.min(((posX - minX) / (maxX - minX)) * 100, 100)
            );
            const newValue = newPercentage * max;

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
