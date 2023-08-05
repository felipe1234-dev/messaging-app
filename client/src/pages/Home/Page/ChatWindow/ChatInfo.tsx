import { Columns, Rows, Title, Icon, Paragraph } from "@styles/layout";
import { Avatar, Button, Badge } from "@components";
import { Variant } from "@types";
import { timeAgo } from "@functions";

import { useChatWindow } from "../../providers";
import { useAuth, useModal } from "@providers";
import { EditChatModal } from "@modals";

import { CameraReels, FileEarmarkImage } from "@styled-icons/bootstrap";
import { PhoneCallOutline } from "@styled-icons/evaicons-outline";
import { Images } from "@styled-icons/icomoon";
import { Circle } from "@styled-icons/material-rounded";
import { Paint } from "@styled-icons/boxicons-regular";

function ChatInfo() {
    const { chatWindow } = useChatWindow();
    const { user } = useAuth();
    const modal = useModal();

    if (!chatWindow || !user) return <></>;

    const padding = 20;
    const isGroupChat = chatWindow.isGroupChat;
    const members = chatWindow.members;
    const otherMembers = chatWindow.members.filter(
        (member) => member.uid !== user.uid
    );
    const otherMember = otherMembers[0];
    const chatTitle =
        chatWindow.title ||
        otherMembers.map((member) => member.name).join(", ") ||
        "No name";
    const chatThumbnail = chatWindow.thumbnail || otherMember?.photo;

    const baseIconButton = {
        round: true,
        iconed: true,
        transparent: true,
        variant: "secondary" as Variant,
        p: 12,
    };

    const handleEditChatBackground = () => {
        modal.show({
            header: "Edit chat",
            body: <EditChatModal chat={chatWindow} />,
        });
    };

    return (
        <Columns
            variant="primary"
            justify="space-between"
            align="center"
        >
            <Columns
                justify="space-between"
                align="center"
                width={`calc(100% - 2*${padding}px)`}
                height={`calc(100% - 2*${padding}px)`}
                p={padding}
            >
                <Columns
                    align="center"
                    justify="start"
                    width="fit-content"
                >
                    <Avatar
                        src={chatThumbnail}
                        alt={chatTitle}
                    />
                    <Rows
                        align="start"
                        justify="center"
                        width="fit-content"
                        height="100%"
                        gap={5}
                    >
                        <Title level={5}>{chatTitle}</Title>
                        {!isGroupChat &&
                            (otherMember.online ? (
                                <Badge
                                    badge={
                                        <Icon
                                            variant="success"
                                            icon={<Circle />}
                                        />
                                    }
                                    mb={-1}
                                    mr={90}
                                >
                                    <Paragraph
                                        variant="secondary"
                                        ml={20}
                                    >
                                        Online now
                                    </Paragraph>
                                </Badge>
                            ) : otherMember.sessionStart ? (
                                <Paragraph variant="secondary">
                                    Online {timeAgo(otherMember.sessionStart)}
                                </Paragraph>
                            ) : (
                                <></>
                            ))}
                    </Rows>
                </Columns>

                <Columns
                    align="center"
                    justify="center"
                    gap={5}
                    width="fit-content"
                >
                    <Button {...baseIconButton}>
                        <Icon icon={<CameraReels />} />
                    </Button>
                    <Button {...baseIconButton}>
                        <Icon icon={<PhoneCallOutline />} />
                    </Button>
                    <Button {...baseIconButton}>
                        <Icon icon={<Images />} />
                    </Button>
                    <Button {...baseIconButton}>
                        <Icon icon={<FileEarmarkImage />} />
                    </Button>
                </Columns>
                <Columns
                    align="center"
                    justify="start"
                    width="fit-content"
                >
                    <Button
                        onClick={handleEditChatBackground}
                        {...baseIconButton}
                    >
                        <Icon icon={<Paint />} />
                    </Button>
                </Columns>
            </Columns>
        </Columns>
    );
}

export default ChatInfo;
