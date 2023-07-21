import { useState, useEffect } from "react";

import { Icon, Paragraph } from "@styles/layout";
import { WrapperChat } from "@types";
import { Overlay, Button } from "@components";
import { Api } from "@services";
import { useAlert } from "@providers";

import { Images } from "@styled-icons/entypo";
import { Form, CoverImageContainer, CoverImageOverlay } from "./styles";

interface EditChatProps {
    chat: WrapperChat;
}

function EditChat(props: EditChatProps) {
    const { chat: originalChat } = props;
    const alert = useAlert();

    const [chat, setChat] = useState(originalChat);
    const [loading, setLoading] = useState(false);

    const updateChat = (updates: Partial<WrapperChat>) => {
        setChat((prev) => ({ ...prev, ...updates }));
    };

    const handleUpdateChat =
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

            setLoading(true);
            Api.media
                .uploadImage(file, `chats/${chat.uid}/${file.name}`)
                .then((url) => updateChat({ cover: url }))
                .catch((err) => alert.error((err as Error).message))
                .finally(() => setLoading(false));
        });
        input.click();
    };

    useEffect(() => {
        setChat(originalChat);
    }, [originalChat]);

    return (
        <Form>
            <Overlay
                overlay={
                    <CoverImageOverlay>
                        <Button
                            variant="highlight"
                            onClick={handleChangeBackgroundImage}
                            fullWidth={false}
                            loading={loading}
                        >
                            <Icon icon={<Images />} />
                            Change image
                        </Button>
                    </CoverImageOverlay>
                }
            >
                <Paragraph>

                </Paragraph>
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
        </Form>
    );
}

export default EditChat;
