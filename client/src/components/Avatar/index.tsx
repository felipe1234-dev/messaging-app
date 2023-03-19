import { StyledAvatar } from "./styles";
import { stringToAvatar } from "@functions";

interface AvatarProps {
    src?: string;
    alt?: string;
}

function Avatar(props: AvatarProps) {
    const { src, alt = "Avatar" } = props;
    const colorAvatar = stringToAvatar(alt);

    return (
        <StyledAvatar backgroundColor={colorAvatar.color}>
            {src ? <img src={src} alt={alt} /> : colorAvatar.shortName}
        </StyledAvatar>
    );
}

export default Avatar;
export type { AvatarProps };