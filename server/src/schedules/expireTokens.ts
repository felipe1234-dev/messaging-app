import { User } from "messaging-app-globals";
import { UsersDB } from "@databases";
import { Token } from "@services";

let expiresInExecutions = 0;

async function expireTokens() {
    if (expiresInExecutions > 0) return;
    
    expiresInExecutions++;

    const onlineUsers = await UsersDB.getUsers({
        wheres: [
            ["online", "==", true]
        ]
    });

    const logoutUser = async (user: User) => {
        await UsersDB.updateUser(user.uid, {
            online: false,
            sessionEnd: new Date(),
            token: ""
        });
    };

    for (const user of onlineUsers) {
        if (!user.token) {
            await logoutUser(user);
            continue;
        }

        if (await Token.isExpired(user.token)) {
            await logoutUser(user);
            await UsersDB.updateUser(user.uid, {
                online: false,
                sessionEnd: new Date(),
                token: ""
            });
        }
    }

    expiresInExecutions = 0;
}

export default expireTokens;