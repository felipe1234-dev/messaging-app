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
        textVariant = "primary",
        iconVariant = "primary",
        fullWidth = true,
        uppercase = false,
        size = 1,
        pt = 6, pb = 6,
        pl = 16, pr = 16,
        p,
        onClick,
        disabled = false,
        loading = false,
        iconed = false,
        noInteraction = false,
        transparent = false,
        round = false,
        selected = false,
        children
    } = props;
    
    return (
        <StyledButton
            ref={ref}
            type={type}
            variant={variant}
            textVariant={textVariant}
            iconVariant={iconVariant}
            fullWidth={fullWidth}
            uppercase={uppercase}
            size={size}
            pt={pt} pb={pb}
            pl={pl} pr={pr}
            p={p}
            onClick={onClick}
            disabled={disabled}
            loading={loading}
            iconed={iconed}
            noInteraction={noInteraction}
            transparent={transparent}
            round={round}
            selected={selected}
        >
            {!loading ? children : <></>}
        </StyledButton>
    );
});

export default Button;
export type { ButtonProps };