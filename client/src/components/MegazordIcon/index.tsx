import { Icon, IconProps } from "@styles/layout";
import { OuterWrapper, IconWrapper } from "./styles";

interface MegazordIconProps {
    icons: ({
        top?: number;
        left?: number;
        zIndex?: number;
    } & IconProps)[];
    width: string;
    height: string;
}

function MegazordIcon(props: MegazordIconProps) {
    const { icons, width, height } = props;
    const keyId = Math.round(0 + Math.random() * 1000);

    return (
        <OuterWrapper
            width={width}
            height={height}
        >
            {icons.map(
                ({ top = 0, left = 0, zIndex = 0, icon, ...iconProps }, i) => (
                    <IconWrapper
                        key={`${keyId}-${i}`}
                        top={top}
                        left={left}
                        zIndex={zIndex}
                    >
                        <Icon
                            {...iconProps}
                            icon={icon}
                        />
                    </IconWrapper>
                )
            )}
        </OuterWrapper>
    );
}

export default MegazordIcon;
export type { MegazordIconProps };
