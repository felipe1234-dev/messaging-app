import { StyledAvatar } from "./styles";
import { stringToAvatar } from "@functions";

interface SingleAvatarProps {
    src?: string;
    alt?: string;
    multiple?: false;
    size?: number;
}

function isSingleAvatarProps(obj: any): obj is SingleAvatarProps {
    return (
        typeof obj.src === "string" && 
        typeof obj.alt === "string" && 
        (obj.multiple === false || obj.multiple === undefined)
    );
}

function SingleAvatar(props: SingleAvatarProps) {
    const { 
        src, 
        alt = "Avatar",
        size = 1
    } = props;
    const colorAvatar = stringToAvatar(alt);

    return (
        <StyledAvatar
            backgroundColor={colorAvatar.color}
            size={size}
            multiple={false} 
        >
            {src ? <img src={src} alt={alt} /> : colorAvatar.shortName}
        </StyledAvatar>
    );
}

interface MultipleAvatarProps {
    src?: string[];
    alt?: string[];
    multiple?: true;
    size?: number;
}

function isMultipleAvatarProps(obj: any): obj is MultipleAvatarProps {
    return (
        obj.src instanceof Array && 
        obj.alt instanceof Array && 
        obj.multiple === true
    );
}

function MultipleAvatar(props: MultipleAvatarProps) {
    const { 
        src: srcs = [], 
        alt: alts = [],
        size = 1
    } = props;
    const colorAvatar = stringToAvatar(alts[0]);

    return (
        <StyledAvatar
            backgroundColor={colorAvatar.color}
            size={size}
            multiple
        >
            {alts?.map((alt, i) => {
                const src = srcs[i];
                const colorAvatar = stringToAvatar(alt);

                return src ? <img src={src} alt={alt} /> : colorAvatar.shortName;
            })}
        </StyledAvatar>
    );
}

type AvatarProps = SingleAvatarProps | MultipleAvatarProps;

function Avatar(props: AvatarProps) {
    if (isSingleAvatarProps(props)) {
        return <SingleAvatar {...props} />
    } else if (isMultipleAvatarProps(props)) {
        return <MultipleAvatar {...props} />
    } else {
        return <></>;
    }
}

export default Avatar;
export type { AvatarProps, SingleAvatarProps, MultipleAvatarProps };