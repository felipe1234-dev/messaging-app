import { useState, useEffect } from "react";
import { StyledInput, InputContainer, IconButton } from "./styles";
import { Variant } from "@types";

type OnIconClick = (
    event: React.MouseEvent<HTMLButtonElement>
) => Promise<void> | void;

interface IconWrapperProps {
    iconVariant: Variant;
    side: "left" | "right";
    title: string;
    icon: React.ReactNode;
    onClick?: OnIconClick;
}

const IconWrapper = ({
    iconVariant,
    icon,
    side,
    title,
    onClick,
}: IconWrapperProps) => (
    <>
        {onClick ? (
            <IconButton
                iconVariant={iconVariant}
                type="button"
                title={title || `${side}-icon`}
                onClick={onClick}
            >
                {icon}
            </IconButton>
        ) : (
            icon
        )}
    </>
);

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
    leftIcon?: React.ReactNode | React.ReactNode[];
    onLeftIconClick?: OnIconClick | OnIconClick[];
    rightIcon?: React.ReactNode | React.ReactNode[];
    onRightIconClick?: OnIconClick | OnIconClick[];
    rightIconTitles?: string[];
    leftIconTitles?: string[];
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
        rightIconTitles = [],
        leftIconTitles = [],
        onChange,
        onEnterPress,
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

    const leftIcons = Array.isArray(leftIcon) ? [...leftIcon] : [leftIcon];
    const onLeftIconClicks = Array.isArray(onLeftIconClick)
        ? [...onLeftIconClick]
        : [onLeftIconClick];

    const rightIcons = Array.isArray(rightIcon) ? [...rightIcon] : [rightIcon];
    const onRightIconClicks = Array.isArray(onRightIconClick)
        ? [...onRightIconClick]
        : [onRightIconClick];

    return (
        <InputContainer
            variant={variant}
            textVariant={textVariant}
            fullWidth={fullWidth}
            disableHover={disableHover}
            light={light}
        >
            {leftIcons.length > 0 &&
                leftIcons
                    .filter((icon) => !!icon)
                    .map((icon, i) => (
                        <IconWrapper
                            key={`left-icon-${i}`}
                            iconVariant={leftIconVariant || iconVariant}
                            side="left"
                            title={leftIconTitles[i]}
                            onClick={onLeftIconClicks[i]}
                            icon={icon}
                        />
                    ))}
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
            {rightIcons.length > 0 &&
                rightIcons
                    .filter((icon) => !!icon)
                    .map((icon, i) => (
                        <IconWrapper
                            key={`right-icon-${i}`}
                            iconVariant={rightIconVariant || iconVariant}
                            side="right"
                            title={rightIconTitles[i]}
                            onClick={onRightIconClicks[i]}
                            icon={icon}
                        />
                    ))}
        </InputContainer>
    );
}

export default Input;
export type { InputProps };
