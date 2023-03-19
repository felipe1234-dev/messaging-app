import { CheckboxProps } from "../Checkbox";
import { Wrapper, Label, Slider } from "./styles";
import { Paragraph } from "@styles/layout";

interface SwitchProps extends CheckboxProps {
    icon?: React.ReactNode;
    round?: boolean;
}

function Switch(props: SwitchProps) {
    const {
        label = "",
        onChange,
        checked,
        disabled = false,
        icon = <></>,
        round = false,
        ...rest
    } = props;

    return (
        <Wrapper>
            {label && <Paragraph {...rest}>{label}</Paragraph>}
            <Label>
                <input
                    type="checkbox"
                    onChange={onChange}
                    checked={checked}
                    disabled={disabled}
                />
                <Slider round={round}>
                    {icon}
                </Slider>
            </Label>
        </Wrapper>
    );
}

export default Switch;
export type { SwitchProps };