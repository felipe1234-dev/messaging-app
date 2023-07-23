import React from "react";
import { Icon } from "@styles/layout";
import { ShowItem } from "@styles/animations";
import { Button } from "@components";
import {
    ColorPickerContainer,
    ColorDisplay,
    ColoredCircle,
    ColorName,
} from "./styles";
import { TrashFill } from "@styled-icons/bootstrap";

interface ColorPickerProps {
    onChange: (color: string) => void;
    value: string;
    fullWidth?: boolean;
}

function ColorPicker(props: ColorPickerProps) {
    const { onChange, value, fullWidth = false } = props;

    const handleDeleteColor = () => {
        onChange("");
    };

    const handleColorChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        onChange(evt.target.value);
    };

    return (
        <ColorPickerContainer
            htmlFor="color-picker"
            fullWidth={fullWidth}
        >
            <ColorDisplay>
                <ColoredCircle color={value} />
                <ColorName color={value}>{value || "No color"}</ColorName>
            </ColorDisplay>

            {value && (
                <ShowItem>
                    <Button
                        round
                        variant="remove"
                        onClick={handleDeleteColor}
                        fullWidth={false}
                        px={12}
                    >
                        <Icon icon={<TrashFill />} />
                    </Button>
                </ShowItem>
            )}
            <input
                id="color-picker"
                type="color"
                onChange={handleColorChange}
                value={value}
            />
        </ColorPickerContainer>
    );
}

export default ColorPicker;
export type { ColorPickerProps };
