import { Avatar } from "@components";
import { Paragraph } from "@styles/layout";
import { User } from "messaging-app-globals";
import { Button } from "@components";
import { useAuth, useFriends } from "@providers";
import { Actions, Card, Info } from "./styles";

interface UserCardProps {
    user: User;
}

function UserCard(props: UserCardProps) {
    const { user } = props;
    const auth = useAuth();
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
                        <Button variant="reject">Reject</Button>
                        <Button variant="success">Accept</Button>
                    </>
                ) : youSentAFriendRequestToThem ? (
                    <Button variant="cancel">Cancel friend request</Button>
                ) : areFriendsWithEachOther ? (
                    <Button variant="remove">Remove friend</Button>
                ) : (
                    <></>
                )}
            </Actions>
        </Card>
    );
}

export default UserCard;
export type { UserCardProps };
