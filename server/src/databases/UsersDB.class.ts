import DBAccess from "@services/DBAccess.class";
import { User, FilterParams } from "messaging-app-globals";

const userCollection = new DBAccess("users");

class UsersDB {
    public static createUser(user: User): Promise<Date> {
        return userCollection.doc(user.uid).create(user);
    }

    public static async getUsers(params: FilterParams): Promise<User[]> {
        let query = userCollection;

        if (params.wheres) {
            for (const where of params.wheres) {
                const [field, operator, value] = where;
                query = query.where(field, operator, value);
            }
        }

        if (params.startAfter) {
            query = query.startAfter(params.startAfter);
        }

        if (params.limit) {
            query = query.limit(params.limit);
        }

        const users = await query.get<User>();
        return users.map(user => new User(user));
    }

    public static async getUserByEmail(email: string): Promise<User | undefined> {
        const user = (
            await userCollection
                .where("email", "==", email)
                .where("deleted", "==", false)
                .get<User>()
        )[0];

        if (!user) return undefined;

        return new User(user);
    }

    public static async getUserByUid(uid: string): Promise<User | undefined> {
        const user = (
            await userCollection
                .where("uid", "==", uid)
                .where("deleted", "==", false)
                .get<User>()
        )[0];

        if (!user) return undefined;

        return new User(user);
    }

    public static async getUserByRefreshToken(refreshToken: string): Promise<User | undefined> {
        const user = ( 
            await userCollection
                .where("refreshToken", "==", refreshToken)
                .where("deleted", "==", false)
                .get<User>()
        )[0];

        if (!user) return undefined;
        
        return new User(user);
    }

    public static async getUserByRememberMeToken(rememberMeToken: string): Promise<User | undefined> {
        const user = ( 
            await userCollection
                .where("rememberMeToken", "==", rememberMeToken)
                .where("deleted", "==", false)
                .get<User>()
        )[0];

        if (!user) return undefined;
        
        return new User(user);
    }

    public static updateUser(uid: string, updates: Partial<User>): Promise<Date> {
        return userCollection.doc(uid).update(updates);
    }
}

export default UsersDB;