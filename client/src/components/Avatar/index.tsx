import { StyledAvatar } from "./styles";
import { stringToAvatar } from "@functions";
import { Variant } from "@types";

interface AvatarProps {
    src?: string | string[];
    alt?: string | string[];
    multiple?: boolean;
    size?: number;
    borderVariant?: Variant;
    borderWidth?: number;
    borderStyle?: string;
    borderOffset?: number;
}

interface SingleAvatarProps extends AvatarProps {
    src?: string;
    alt?: string;
    multiple?: false;
}

interface MultipleAvatarProps extends AvatarProps {
    src?: string[];
    alt?: string[];
    multiple?: true;
}

function SingleAvatar(props: SingleAvatarProps) {
    const {
        src,
        alt = "Avatar",
        size = 1,
        borderVariant = "highlight",
        borderWidth = 0,
        borderStyle = "solid",
        borderOffset = 0,
    } = props;
    const colorAvatar = stringToAvatar(alt);

    return (
        <StyledAvatar
            backgroundColor={colorAvatar.color}
            size={size}
            multiple={false}
            borderVariant={borderVariant}
            borderWidth={borderWidth}
            borderStyle={borderStyle}
            borderOffset={borderOffset}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt}
                />
            ) : (
                colorAvatar.shortName
            )}
        </StyledAvatar>
    );
}

function MultipleAvatar(props: MultipleAvatarProps) {
    const {
        src: srcs = [],
        alt: alts = [],
        size = 1,
        borderVariant = "highlight",
        borderWidth = 0,
        borderStyle = "solid",
        borderOffset = 0,
    } = props;
    const colorAvatar = stringToAvatar(alts[0]);

    return (
        <StyledAvatar
            multiple
            size={size}
            backgroundColor={colorAvatar.color}
            borderVariant={borderVariant}
            borderWidth={borderWidth}
            borderStyle={borderStyle}
            borderOffset={borderOffset}
        >
            {alts?.map((alt, i) => {
                const src = srcs[i];
                const colorAvatar = stringToAvatar(alt);

                return src ? (
                    <img
                        src={src}
                        alt={alt}
                    />
                ) : (
                    colorAvatar.shortName
                );
            })}
        </StyledAvatar>
    );
}

function Avatar(props: AvatarProps) {
    if (isSingleAvatarProps(props)) {
        return <SingleAvatar {...props} />;
    } else if (isMultipleAvatarProps(props)) {
        return <MultipleAvatar {...props} />;
    } else {
        return <></>;
    }
}

export default Avatar;
export type { AvatarProps, SingleAvatarProps, MultipleAvatarProps };

function isAvatarProps(obj: any): obj is AvatarProps {
    return (
        obj instanceof Object &&
        (typeof obj.src === "string" ||
            obj.src instanceof Array ||
            obj.src === undefined) &&
        (typeof obj.alt === "string" ||
            obj.alt instanceof Array ||
            obj.alt === undefined) &&
        (obj.size === undefined || typeof obj.size === "number") &&
        (obj.multiple === undefined || typeof obj.multiple === "boolean") &&
        (typeof obj.borderVariant === "string" ||
            obj.borderVariant === undefined) &&
        (typeof obj.borderWidth === "number" ||
            obj.borderWidth === undefined) &&
        (typeof obj.borderOffset === "number" ||
            obj.borderOffset === undefined) &&
        (typeof obj.borderStyle === "string" || obj.borderStyle === undefined)
    );
}

function isSingleAvatarProps(obj: any): obj is SingleAvatarProps {
    return (
        typeof obj.src === "string" &&
        typeof obj.alt === "string" &&
        (obj.multiple === false || obj.multiple === undefined) &&
        isAvatarProps(obj)
    );
}

function isMultipleAvatarProps(obj: any): obj is MultipleAvatarProps {
    return (
        obj.src instanceof Array &&
        obj.alt instanceof Array &&
        obj.multiple === true &&
        isAvatarProps(obj)
    );
}
