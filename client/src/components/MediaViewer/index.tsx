import { ReactNode } from "react";
import { Media } from "messaging-app-globals";

import { Button } from "@components";
import { openLink } from "@functions";
import { Icon } from "@styles/layout";

import { DocumentPdf } from "@styled-icons/fluentui-system-regular";
import {
    FiletypePng,
    FiletypeJpg,
    FileEarmark,
    Trash,
    EyeFill,
} from "@styled-icons/bootstrap";

import { MediaViewerContainer, MediaViewerrActions } from "./styles";

interface MediaViewerProps {
    media: Media;
    onRemove?: (media: Media) => void | Promise<void>;
}

const extensionToIcon: { [extension: string]: ReactNode } = {
    pdf: <DocumentPdf />,
    png: <FiletypePng />,
    jpg: <FiletypeJpg />,
};

function MediaViewer(props: MediaViewerProps) {
    const { media, onRemove } = props;

    const icon = extensionToIcon[media.extension] || <FileEarmark />;
    const isImage = ["png", "jpg"].includes(media.extension);

    const handleRemoveMedia = () => {
        if (!onRemove) return;
        onRemove(media);
    };

    const handleOpenMedia = () => {
        if (!media.url) return;
        openLink(media.url);
    };

    const baseButtonProps = {
        round: true,
        iconed: true,
        size: 1.3,
        p: 8,
    };

    return (
        <MediaViewerContainer>
            {isImage ? (
                <img
                    draggable={false}
                    src={media.url}
                    alt={media.filename}
                />
            ) : (
                icon
            )}
            <MediaViewerrActions>
                <Button
                    {...baseButtonProps}
                    variant="info"
                    onClick={handleOpenMedia}
                >
                    <Icon icon={<EyeFill />} />
                </Button>
                {onRemove && (
                    <Button
                        {...baseButtonProps}
                        variant="remove"
                        onClick={handleRemoveMedia}
                    >
                        <Icon icon={<Trash />} />
                    </Button>
                )}
            </MediaViewerrActions>
        </MediaViewerContainer>
    );
}

export default MediaViewer;
export type { MediaViewerProps };
