import { useState } from "react";

import { Container, Icon, Paragraph } from "@styles/layout";
import { Avatar, Button, Input, HorizontalScroll } from "@components";
import { useAuth } from "@providers";

import { ThreeDots as Dots, Plus } from "@styled-icons/bootstrap";
import { SearchOutline as Search } from "@styled-icons/evaicons-outline";

function Friends() {
    const { user } = useAuth();
    if (!user) return <></>;

    return (
        <HorizontalScroll
            draggable
            hideScrollbar
            scrollWithWheel
            items={user.friends.map(friend => ({
                id: friend.uid,
                Component: () => (
                    <Avatar
                        src={friend.photo}
                        alt={friend.name}
                    />
                )
            }))}
        />
    );
}

export default Friends;