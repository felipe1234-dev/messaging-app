import { Icon, IconProps } from "@styles/layout";
import { Spinner as SpinnerIcon } from "@styled-icons/icomoon";
import { SpinnerContainer } from "./styles";

interface SpinnerProps extends Omit<IconProps, "icon"> {
    speed?: string;
}

function Spinner(props: SpinnerProps) {
    const { speed = "1s", ...rest } = props;

    return (
        <SpinnerContainer speed={speed}>
            <Icon
                icon={<SpinnerIcon />}
                {...rest}
            />
        </SpinnerContainer>
    );
}

export default Spinner;
export type { SpinnerProps };
