import configs from "@configs";
import { app } from "@databases";
import { secureUserData } from "@utils";
import { User } from "messaging-app-globals";
import HTTPReq from "./HTTPReq.class";

class Token {
    static async decode(token: string): Promise<User> {
        const decodedData = await app.auth().verifyIdToken(token);
        const user = secureUserData(new User(decodedData));
        return user;
    }

    static async encode(user: User): Promise<string> {
        const customToken = await app.auth().createCustomToken(user.uid, secureUserData(user));
        const token = await getIdToken(customToken);
        
        return token;
    }

    static async isExpired(token: string): Promise<boolean> {
        try {
            await Token.decode(token);
            return false;
        } catch (err) {
            console.log(err);
            return true;
        }
    }
}

export default Token;

async function getIdToken(customToken: string): Promise<string> {
    const resp = await HTTPReq.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${configs.database.apiKey}`,
        {
            body: {
                token: customToken,
                returnSecureToken: true
            }
        }
    );

    return resp.idToken;
}