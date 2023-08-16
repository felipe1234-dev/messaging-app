import { useState } from "react";
import { User } from "messaging-app-globals";

import { Api } from "@services";
import { Avatar, Button } from "@components";
import { useAuth, useAlert, useFriends } from "@providers";

import { Paragraph } from "@styles/layout";
import { Actions, Main, Card, Info } from "./styles";

interface UserCardProps {
    user: User;
}

const actions = {
    UNFRIEND: 1,
    SEND_FRIEND_REQUEST: 2,
    DELETE_FRIEND_REQUEST: 3,
    REJECT_FRIEND_REQUEST: 4,
    ACCEPT_FRIEND_REQUEST: 5,
};

function UserCard(props: UserCardProps) {
    const { user } = props;

    const [loading, setLoading] = useState<number>();

    const auth = useAuth();
    const alert = useAlert();
    const { friendRequests } = useFriends();

    const isYou = auth.user?.uid === user.uid;
    const areFriendsWithEachOther =
        !isYou && auth.user?.friends.includes(user.uid);

    const acceptedFriendRequest = areFriendsWithEachOther
        ? friendRequests.find(
              (fr) =>
                  !!auth.user?.uid &&
                  [fr.from, fr.to].includes(auth.user.uid) &&
                  fr.accepted
          )
        : undefined;

    const friendsSince =
        acceptedFriendRequest?.acceptedAt?.toDateString() || undefined;

    const friendRequestToUserFromYou = friendRequests.find(
        (fr) =>
            fr.from === auth.user?.uid &&
            fr.to === user.uid &&
            !fr.accepted &&
            !fr.rejected
    );

    const youSentAFriendRequestToThem = !!friendRequestToUserFromYou;

    const friendRequestToYouFromUser = friendRequests.find(
        (fr) =>
            fr.from === user.uid &&
            fr.to === auth.user?.uid &&
            !fr.accepted &&
            !fr.rejected
    );

    const theySentYouAFriendRequest = !!friendRequestToYouFromUser;

    const sentToYouAt =
        friendRequestToYouFromUser?.sentAt.toDateString() || undefined;

    const addLoading = (action: number) => setLoading(action);
    const removeLoading = () => setLoading(undefined);

    const handleSendFriendRequest = () => {
        addLoading(actions.SEND_FRIEND_REQUEST);

        Api.friendRequests
            .send(user.uid)
            .catch((error) => alert.error(error.message))
            .finally(removeLoading);
    };

    const handleUndoFriendship = () => {
        addLoading(actions.UNFRIEND);

        Api.friends
            .unfriend(user.uid)
            .catch((error) => alert.error(error.message))
            .finally(removeLoading);
    };

    const handleDeleteFriendRequest = () => {
        if (!friendRequestToUserFromYou) return;

        addLoading(actions.DELETE_FRIEND_REQUEST);

        Api.friendRequests
            .delete(friendRequestToUserFromYou.uid)
            .catch((error) => alert.error(error.message))
            .finally(removeLoading);
    };

    const handleAcceptFriendRequest = () => {
        if (!friendRequestToYouFromUser) return;

        addLoading(actions.ACCEPT_FRIEND_REQUEST);

        Api.friendRequests
            .accept(friendRequestToYouFromUser.uid)
            .catch((error) => alert.error(error.message))
            .finally(removeLoading);
    };

    const handleRejectFriendRequest = () => {
        if (!friendRequestToYouFromUser) return;

        addLoading(actions.REJECT_FRIEND_REQUEST);

        Api.friendRequests
            .reject(friendRequestToYouFromUser.uid)
            .catch((error) => alert.error(error.message))
            .finally(removeLoading);
    };

    const baseButtonProps = (action: number) => ({
        fullWidth: false,
        loading: loading === action,
    });

    return (
        <Card>
            <Main>
                <Avatar
                    src={user.photo}
                    alt={user.name}
                />
                <Info>
                    <Paragraph
                        variant="highlight"
                        fontWeight={700}
                    >
                        {user.name}
                    </Paragraph>
                    {(areFriendsWithEachOther || theySentYouAFriendRequest) && (
                        <Paragraph
                            variant="secondary"
                            size={0.8}
                        >
                            {areFriendsWithEachOther
                                ? "is friends with you since " + friendsSince
                                : theySentYouAFriendRequest
                                ? "sent you a friend request at " + sentToYouAt
                                : ""}
                        </Paragraph>
                    )}
                </Info>
            </Main>
            <Actions>
                {theySentYouAFriendRequest ? (
                    <>
                        <Button
                            variant="reject"
                            onClick={handleRejectFriendRequest}
                            width="90px"
                            {...baseButtonProps(actions.REJECT_FRIEND_REQUEST)}
                        >
                            Reject
                        </Button>
                        <Button
                            variant="success"
                            onClick={handleAcceptFriendRequest}
                            width="90px"
                            {...baseButtonProps(actions.ACCEPT_FRIEND_REQUEST)}
                        >
                            Accept
                        </Button>
                    </>
                ) : youSentAFriendRequestToThem ? (
                    <Button
                        variant="cancel"
                        onClick={handleDeleteFriendRequest}
                        width="215px"
                        {...baseButtonProps(actions.DELETE_FRIEND_REQUEST)}
                    >
                        Cancel friend request
                    </Button>
                ) : areFriendsWithEachOther ? (
                    <Button
                        variant="remove"
                        onClick={handleUndoFriendship}
                        width="90px"
                        {...baseButtonProps(actions.UNFRIEND)}
                    >
                        Unfriend
                    </Button>
                ) : (
                    !isYou && (
                        <Button
                            variant="success"
                            onClick={handleSendFriendRequest}
                            width="215px"
                            {...baseButtonProps(actions.SEND_FRIEND_REQUEST)}
                        >
                            Send a friend request
                        </Button>
                    )
                )}
            </Actions>
        </Card>
    );
}

export default UserCard;
export type { UserCardProps };
