import { Variant } from "@types";
import { StyledInput, InputContainer, IconButton } from "./styles";

interface InputProps {
    label?: string;
    type?: string;
    variant?: Variant;
    placeholder?: string;
    autofill?: boolean;
    disabled?: boolean;
    required?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    onLeftIconClick?: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
    rightIcon?: React.ReactNode;
    onRightIconClick?: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
    onChange: (evt: React.ChangeEvent<HTMLInputElement>) => Promise<void> | void;
    onEnterPress?: (event: React.KeyboardEvent<HTMLInputElement>) => Promise<void> | void;
    value: string | number;
}

function Input(props: InputProps) {
    const {
        type = "text",
        label = "",
        variant = "primary",
        placeholder = "",

        autofill = false,
        disabled = false,
        required = false,
        fullWidth = true,

        leftIcon,
        onLeftIconClick,

        rightIcon,
        onRightIconClick,

        onEnterPress,

        onChange,
        value
    } = props;

    const autocomplete = autofill ? "on" : "off";

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const code = event.key || event.code || event.keyCode || event.which || event.charCode;
        
        if ((code === "Enter" || code === 13) && onEnterPress) {
            onEnterPress(event);
        }
    };

    return (
        <InputContainer
            variant={variant}
            fullWidth={fullWidth}
        >
            {(leftIcon && onLeftIconClick) && (
                <IconButton type="button" title="left-icon" onClick={onLeftIconClick}>
                    {leftIcon}
                </IconButton>
            )}
            {(leftIcon && !onLeftIconClick) && leftIcon}
            <StyledInput
                variant={variant}
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
            {(rightIcon && onRightIconClick) && (
                <IconButton type="button" title="right-icon" onClick={onRightIconClick}>
                    {rightIcon}
                </IconButton>
            )}
            {(rightIcon && !onRightIconClick) && rightIcon}
        </InputContainer>
    );
}

export default Input;
export type { InputProps };