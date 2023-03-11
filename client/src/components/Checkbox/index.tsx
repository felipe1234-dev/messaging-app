import { Paragraph, ParagraphProps } from "@styles/layout";
import { Label, Checkmark } from "./styles";

interface CheckboxProps extends ParagraphProps {
    label?: string;
    onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
    checked: boolean;
    disabled?: boolean;
}

function Checkbox(props: CheckboxProps) {
    const { 
        label = "",
        onChange, 
        checked, 
        disabled = false,
        ...rest
    } = props;

    return (
        <Label disabled={disabled}>
            {label && <Paragraph {...rest}>{label}</Paragraph>}
            <input 
                type="checkbox" 
                onChange={onChange}
                checked={checked}
                disabled={disabled}
            />
            <Checkmark />
        </Label>
    );
}

export default Checkbox;
export type { CheckboxProps };