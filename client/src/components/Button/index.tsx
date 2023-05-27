import { forwardRef } from "react";
import { StyledButton, StyledButtonProps } from "./styles";

interface ButtonProps extends Partial<StyledButtonProps> {
    type?: "button" | "submit" | "reset";
    children: React.ReactNode;
    onClick?: (
        event: React.MouseEvent<HTMLButtonElement>
    ) => void | Promise<void>;
    disabled?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const {
        type = "button",
        variant = "primary",
        textVariant = "primary",
        iconVariant = "primary",
        direction = "row",
        align = "center",
        justify = "center",
        gap = 5,
        width = "auto",
        height = "auto",
        fullWidth = true,
        uppercase = false,
        size = 1,
        pt = 6,
        pb = 6,
        pl = 16,
        pr = 16,
        py,
        px,
        p,
        borderRadius = 8,
        onClick,
        hoverDisabled = false,
        disabled = false,
        loading = false,
        iconed = false,
        noInteraction = false,
        transparent = false,
        round = false,
        selected = false,
        children,
    } = props;

    return (
        <StyledButton
            ref={ref}
            type={type}
            variant={variant}
            textVariant={textVariant}
            iconVariant={iconVariant}
            direction={direction}
            align={align}
            justify={justify}
            gap={gap}
            width={width}
            height={height}
            fullWidth={fullWidth}
            uppercase={uppercase}
            size={size}
            pt={pt}
            pb={pb}
            pl={pl}
            pr={pr}
            px={px}
            py={py}
            p={p}
            onClick={onClick}
            hoverDisabled={hoverDisabled}
            disabled={disabled}
            loading={loading}
            iconed={iconed}
            noInteraction={noInteraction}
            transparent={transparent}
            round={round}
            selected={selected}
            borderRadius={borderRadius}
        >
            {!loading ? children : <></>}
        </StyledButton>
    );
});

export default Button;
export type { ButtonProps };
