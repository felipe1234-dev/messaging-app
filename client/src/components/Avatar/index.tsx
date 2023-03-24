import { StyledAvatar } from "./styles";
import { stringToAvatar } from "@functions";

interface AvatarProps {
    src?: string | string[];
    alt?: string;
}

function Avatar(props: AvatarProps) {
    const { src, alt = "Avatar" } = props;
    const multiple = src instanceof Array && src.length > 1;
    const colorAvatar = stringToAvatar(alt);

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <StyledAvatar 
            backgroundColor={colorAvatar.color}
            multiple={multiple}    
        >
            {children}
        </StyledAvatar>
    );

    if (multiple) {
        return (
            <Wrapper>
                {src.map(src => <img src={src} alt={alt} />)}
            </Wrapper>
        );
    } 

    return (
        <Wrapper>
            {src ? <img src={src as string} alt={alt} /> : colorAvatar.shortName}
        </Wrapper>
    );
}

export default Avatar;
export type { AvatarProps };