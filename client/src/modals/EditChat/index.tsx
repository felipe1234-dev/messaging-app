import { useState, useEffect } from "react";

import { Icon, Paragraph } from "@styles/layout";
import { WrapperChat } from "@types";
import { Overlay, Button } from "@components";
import { Api } from "@services";

import { Images } from "@styled-icons/entypo";
import { Form, CoverImageContainer, CoverImageOverlay } from "./styles";

interface EditChatProps {
    chat: WrapperChat;
}

function EditChat(props: EditChatProps) {
    const { chat: originalChat } = props;
    const [chat, setChat] = useState(originalChat);

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

            console.log("file", await file.text());

            Api.files
                .uploadImage(file, `chats/${chat.uid}/${file.name}`)
                .then((url) => {
                    console.log("url", url);
                    updateChat({ cover: url });
                })
                .catch(console.error);
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
                        >
                            <Icon icon={<Images />} />
                            Change image
                        </Button>
                    </CoverImageOverlay>
                }
            >
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
