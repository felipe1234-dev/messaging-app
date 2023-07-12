import { UsersDB } from "@databases";
import { Token } from "@services";

const timeInterval = 1 * 60 * 1000;

async function expireTokens() {
    const usersDB = new UsersDB();

    const onlineUsers = await usersDB.where("online", "==", true).get();

    const promises: Promise<void>[] = [];

    for (const user of onlineUsers) {
        const promise = new Promise<void>(async (resolve) => {
            if (!user.token || (await Token.isExpired(user.token))) {
                await usersDB.uid(user.uid).update({
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
