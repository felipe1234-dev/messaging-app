import { useState } from "react";

import { Container, Divider } from "@styles/layout";
import { useFriends } from "@providers";
import { useAsyncEffect } from "@hooks";
import { UserCard } from "@components";
import { HashMap } from "@types";
import { Api } from "@services";
import { User } from "messaging-app-globals";

import RequestCount from "./RequestCount";

export const padding = 25;

function FriendRequests() {
    const [users, setUsers] = useState<HashMap<User>>({});
    const { unasweredFriendRequests } = useFriends();

    useAsyncEffect(async () => {
        const users: { [uid: string]: User } = {};

        for (const friendRequest of unasweredFriendRequests) {
            const user = await Api.users.byUid(friendRequest.from);
            if (!user) continue;
            users[user.uid] = user;
        }

        setUsers(users);
    }, [unasweredFriendRequests]);

    return (
        <Container
            variant="secondary"
            direction="column"
            justify="start"
            align="start"
            width="460px"
            height="100%"
            gap={0}
        >
            <RequestCount />
            <Divider
                light={0.08}
                thickness={0.5}
            />
            <Container
                variant="secondary"
                direction="column"
                align="start"
                justify="start"
            >
                {unasweredFriendRequests
                    .filter((friendRequest) => !!users[friendRequest.from])
                    .map((friendRequest) => (
                        <UserCard
                            key={friendRequest.uid}
                            user={users[friendRequest.from]}
                        />
                    ))}
            </Container>
        </Container>
    );
}

export default FriendRequests;
