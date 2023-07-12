import { useState } from "react";
import { Avatar } from "@components";
import { Paragraph } from "@styles/layout";
import { User } from "messaging-app-globals";
import { Button } from "@components";
import { useAuth, useAlert, useFriends } from "@providers";
import { Api } from "@services";
import { Actions, Card, Info } from "./styles";

interface UserCardProps {
    user: User;
}

const actions = {
    REMOVE_FRIEND: 1,
    SEND_FRIEND_REQUEST: 2,
    CANCEL_FRIEND_REQUEST: 3,
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

    const friendRequestToUserFromYou = !!friendRequests.find(
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

        Api.friends
            .sendFriendRequest(user.uid)
            .catch((error) => alert.error(error.message))
            .finally(removeLoading);
    };

    const handleRemoveFriend = () => {
        addLoading(actions.REMOVE_FRIEND);

        Api.friends
            .removeFriend(user.uid)
            .catch((error) => alert.error(error.message))
            .finally(removeLoading);
    };

    const handleCancelFriendRequest = () => {
        addLoading(actions.CANCEL_FRIEND_REQUEST);

        Api.friends
            .cancelFriendRequest(user.uid)
            .catch((error) => alert.error(error.message))
            .finally(removeLoading);
    };

    

    const baseButtonProps = (action: number) => ({
        loading: loading === action,
    });

    return (
        <Card>
            <Info>
                <Avatar
                    src={user.photo}
                    alt={user.name}
                />
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
            <Actions>
                {theySentYouAFriendRequest ? (
                    <>
                        <Button
                            variant="reject"
                            {...baseButtonProps(actions.REJECT_FRIEND_REQUEST)}
                        >
                            Reject
                        </Button>
                        <Button
                            variant="success"
                            {...baseButtonProps(actions.ACCEPT_FRIEND_REQUEST)}
                        >
                            Accept
                        </Button>
                    </>
                ) : youSentAFriendRequestToThem ? (
                    <Button
                        variant="cancel"
                        onClick={handleCancelFriendRequest}
                        {...baseButtonProps(actions.CANCEL_FRIEND_REQUEST)}
                    >
                        Cancel friend request
                    </Button>
                ) : areFriendsWithEachOther ? (
                    <Button
                        variant="remove"
                        onClick={handleRemoveFriend}
                        {...baseButtonProps(actions.REMOVE_FRIEND)}
                    >
                        Remove friend
                    </Button>
                ) : (
                    <Button
                        variant="success"
                        onClick={handleSendFriendRequest}
                        {...baseButtonProps(actions.SEND_FRIEND_REQUEST)}
                    >
                        Send a friend request
                    </Button>
                )}
            </Actions>
        </Card>
    );
}

export default UserCard;
export type { UserCardProps };
