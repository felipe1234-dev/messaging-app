import { useState, useEffect } from "react";
import { StyledInput, InputContainer, IconButton } from "./styles";
import { Variant } from "@types";

interface InputProps {
    label?: string;
    type?: string;
    variant?: Variant;
    textVariant?: Variant;
    iconVariant?: Variant;
    rightIconVariant?: Variant;
    leftIconVariant?: Variant;
    placeholder?: string;
    light?: number;
    disableHover?: boolean;
    autofill?: boolean;
    disabled?: boolean;
    required?: boolean;
    fullWidth?: boolean;
    autoResize?: boolean;
    leftIcon?: React.ReactNode;
    onLeftIconClick?: (
        event: React.MouseEvent<HTMLButtonElement>
    ) => Promise<void> | void;
    rightIcon?: React.ReactNode;
    onRightIconClick?: (
        event: React.MouseEvent<HTMLButtonElement>
    ) => Promise<void> | void;
    onChange: (
        evt: React.ChangeEvent<HTMLInputElement>
    ) => Promise<void> | void;
    onEnterPress?: (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => Promise<void> | void;
    value: string | number;
}

function Input(props: InputProps) {
    const {
        type = "text",
        label = "",
        variant = "primary",
        textVariant = "primary",
        iconVariant = "primary",
        rightIconVariant,
        leftIconVariant,
        placeholder = "",
        disableHover = false,
        autofill = false,
        disabled = false,
        required = false,
        fullWidth = true,
        autoResize = false,
        light = 0,
        leftIcon,
        onLeftIconClick,
        rightIcon,
        onRightIconClick,
        onEnterPress,
        onChange,
        value,
    } = props;

    const [textAreaEl, setTextAreaEl] = useState<HTMLTextAreaElement | null>(
        null
    );

    const autocomplete = autofill ? "on" : "off";
    const inputTag = autoResize ? "textarea" : "input";

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const code =
            event.key ||
            event.code ||
            event.keyCode ||
            event.which ||
            event.charCode;

        const shiftKey = event.shiftKey;

        if ((code === "Enter" || code === 13) && !shiftKey && onEnterPress) {
            event.preventDefault();
            onEnterPress(event);
        }
    };

    useEffect(() => {
        if (!autoResize || !textAreaEl) return;

        const limit = 200;
        textAreaEl.style.height = "";
        textAreaEl.style.height =
            Math.min(textAreaEl.scrollHeight, limit) + "px";
    }, [autoResize, value, textAreaEl]);

    return (
        <InputContainer
            variant={variant}
            textVariant={textVariant}
            fullWidth={fullWidth}
            disableHover={disableHover}
            light={light}
        >
            {leftIcon && onLeftIconClick && (
                <IconButton
                    iconVariant={leftIconVariant || iconVariant}
                    type="button"
                    title="left-icon"
                    onClick={onLeftIconClick}
                >
                    {leftIcon}
                </IconButton>
            )}
            {leftIcon && !onLeftIconClick && leftIcon}
            <StyledInput
                as={inputTag}
                // @ts-ignore
                ref={(el: HTMLInputElement | HTMLTextAreaElement) => {
                    if (inputTag === "textarea")
                        setTextAreaEl(el as HTMLTextAreaElement);
                }}
                variant={variant}
                textVariant={textVariant}
                type={type}
                disabled={disabled}
                placeholder={placeholder}
                required={required}
                autoComplete={autocomplete}
                leftIcon={!!leftIcon}
                rightIcon={!!rightIcon}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                value={value}
            />
            {rightIcon && onRightIconClick && (
                <IconButton
                    iconVariant={rightIconVariant || iconVariant}
                    type="button"
                    title="right-icon"
                    onClick={onRightIconClick}
                >
                    {rightIcon}
                </IconButton>
            )}
            {rightIcon && !onRightIconClick && rightIcon}
        </InputContainer>
    );
}

export default Input;
export type { InputProps };
