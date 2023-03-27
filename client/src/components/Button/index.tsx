import { Variant } from "@types";
import { StyledButton } from "./styles";

interface ButtonProps {
    type?: "button" | "submit" | "reset";
    variant?: Variant;
    fullWidth?: boolean;
    uppercase?: boolean;
    size?: number;
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
    disabled?: boolean;
    loading?: boolean;
    iconed?: boolean;
}

function Button(props: ButtonProps) {
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
        children
    } = props;

    return (
        <StyledButton
            type={type}
            variant={variant}
            fullWidth={fullWidth}
            uppercase={uppercase}
            size={size}
            onClick={onClick}
            disabled={disabled}
            loading={loading}
            iconed={iconed}
        >
            {!loading ? children : <></>}
        </StyledButton>
    );
}

export default Button;
export type { ButtonProps };