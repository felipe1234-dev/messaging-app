import { forwardRef } from "react";
import { StyledButton, StyledButtonProps } from "./styles";

interface ButtonProps extends Partial<StyledButtonProps> {
    type?: "button" | "submit" | "reset";
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
    disabled?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const { 
        type = "button",
        variant = "primary",
        fullWidth = true,
        uppercase = false,
        size = 1,
        onClick,
        disabled = false,
        loading = false,
        iconed = false,
        noInteraction = false,
        transparent = false,
        round = false,
        children
    } = props;

    return (
        <StyledButton
            ref={ref}
            type={type}
            variant={variant}
            fullWidth={fullWidth}
            uppercase={uppercase}
            size={size}
            onClick={onClick}
            disabled={disabled}
            loading={loading}
            iconed={iconed}
            noInteraction={noInteraction}
            transparent={transparent}
            round={round}
        >
            {!loading ? children : <></>}
        </StyledButton>
    );
});

export default Button;
export type { ButtonProps };