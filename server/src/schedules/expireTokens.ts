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

    const promises: Promise<void>[] = [];

    for (const user of onlineUsers) {
        const promise = new Promise<void>(async resolve => {
            if (!user.token || await Token.isExpired(user.token)) {
                await UsersDB.updateUser(user.uid, {
                    online: false,
                    sessionEnd: new Date(),
                    token: ""
                });
            }

            resolve();
        });

        promises.push(promise);

        if (promises.length >= 500) {
            await Promise.all(promises);
        }
    }

    expiresInExecutions = 0;
}

export default expireTokens;