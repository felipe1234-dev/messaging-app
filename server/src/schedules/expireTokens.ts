import { UsersDB } from "@databases";
import { Token } from "@services";

const timeInterval = 1 * 60 * 1000;

async function expireTokens() {
    const onlineUsers = await UsersDB.getUsers({
        wheres: [["online", "==", true]],
    });

    const promises: Promise<void>[] = [];

    for (const user of onlineUsers) {
        const promise = new Promise<void>(async (resolve) => {
            if (!user.token || (await Token.isExpired(user.token))) {
                await UsersDB.updateUser(user.uid, {
                    online: false,
                    sessionEnd: new Date(),
                    token: "",
                });
            }

            resolve();
        });

        promises.push(promise);

        if (promises.length >= 500) {
            await Promise.all(promises);
            promises.length = 0;
        }
    }

    await Promise.all(promises);
    promises.length = 0;

    setTimeout(expireTokens, timeInterval);
}

export default expireTokens;
