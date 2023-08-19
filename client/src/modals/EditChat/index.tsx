import { useState, useEffect } from "react";

import { Api } from "@services";
import { WrapperChat } from "@types";
import { Overlay, Button, Input, ColorPicker } from "@components";
import { useAlert, useModal } from "@providers";
import { Icon, Paragraph } from "@styles/layout";

import { Images } from "@styled-icons/entypo";
import {
    Form,
    CoverImageContainer,
    CoverImageOverlay,
    Actions,
} from "./styles";

interface EditChatProps {
    chat: WrapperChat;
}

function EditChat(props: EditChatProps) {
    const { chat: originalChat } = props;
    const alert = useAlert();
    const modal = useModal();

    const [chat, setChat] = useState(originalChat);
    const [loadingBgImage, setLoadingBgImage] = useState(false);
    const [saving, setSaving] = useState(false);

    const updateChat = (updates: Partial<WrapperChat>) => {
        setChat((prev) => ({ ...prev, ...updates }));
    };

    const handleChatChange =
        (prop: keyof WrapperChat) =>
        (evt: React.ChangeEvent<HTMLInputElement>) => {
            updateChat({ [prop]: evt.target.value });
        };

    const handleChangeBackgroundImage = () => {
        const input = document.createElement("input");

        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/png, image/gif, image/jpeg");
        input.addEventListener("change", async () => {
            const file = (input.files || [])[0];
            if (!file) return;

            setLoadingBgImage(true);
            Api.media
                .upload(file, `chats/${chat.uid}/cover/${file.name}`)
                .then(({ url }) => updateChat({ cover: url }))
                .catch((err) => alert.error((err as Error).message))
                .finally(() => setLoadingBgImage(false));
        });
        input.click();
    };

    const handleChangeColor = (color: string) => {
        updateChat({ color });
    };

    const handleSaveChanges = () => {
        setSaving(true);

        const { title, cover, color } = chat;

        Api.chats
            .update(chat.uid, {
                title,
                cover,
                color,
            })
            .then(() => {
                modal.hide();
                alert.success("Chat updated successfully");
            })
            .catch((err) => alert.error((err as Error).message))
            .finally(() => setSaving(false));
    };

    useEffect(() => {
        setChat(originalChat);
    }, [originalChat]);

    return (
        <Form>
            <Paragraph>Title:</Paragraph>
            <Input
                variant="secondary"
                placeholder="Chat title"
                onChange={handleChatChange("title")}
                value={chat.title}
                light={0.05}
            />

            <Paragraph>Color:</Paragraph>
            <ColorPicker
                fullWidth
                onChange={handleChangeColor}
                value={chat.color || ""}
            />

            <Overlay
                lockOverlay={loadingBgImage}
                overlay={
                    <CoverImageOverlay>
                        <Button
                            variant="highlight"
                            onClick={handleChangeBackgroundImage}
                            fullWidth={false}
                            loading={loadingBgImage}
                            width="163px"
                        >
                            <Icon icon={<Images />} />
                            Change image
                        </Button>
                    </CoverImageOverlay>
                }
            >
                <Paragraph mb={10}>Change chat cover image:</Paragraph>
                <CoverImageContainer>
                    {chat.cover ? (
                        <img
                            src={chat.cover}
                            alt="Chat cover image"
                        />
                    ) : (
                        <Paragraph variant="primary">
                            No cover image selected
                        </Paragraph>
                    )}
                </CoverImageContainer>
            </Overlay>

            <Actions>
                <Button
                    variant="success"
                    onClick={handleSaveChanges}
                    fullWidth={false}
                    loading={saving}
                    width="163px"
                >
                    Save changes
                </Button>
            </Actions>
        </Form>
    );
}

export default EditChat;
