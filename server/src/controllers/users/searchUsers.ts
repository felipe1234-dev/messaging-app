import { UsersDB } from "@databases";
import {
    codes,
    secureUserData,
    operators,
    User,
    Operator,
} from "messaging-app-globals";
import { RouteController, Request } from "@typings";
import { ServerError, Unauthenticated } from "@errors";

const stringToWhere = (str: string) => {
    if (!str) return undefined;

    const operator = operators.find((operator) => str.includes(operator));
    if (!operator) return undefined;

    const [field, value] = str.split(operator);
    return [field, operator, value] as [
        field: keyof User,
        operator: Operator,
        value: User[keyof User],
    ];
};

const searchUsersController: RouteController = async (
    req: Request & {
        query: {
            where?: string;
            or?: string;
            startAfter?: string;
            limit?: string;
        };
    },
    res
) => {
    try {
        const { where, or, limit, startAfter } = req.query;
        const currentUser = req.user;
        if (!currentUser) throw new Unauthenticated("You're not authenticated");

        let query = new UsersDB();

        if (where) {
            for (const operation of where.split(",")) {
                const args = stringToWhere(operation);
                if (!args) continue;

                query = query.where(...args);
            }
        }

        if (or) {
            const operations = or.split(",");
            const firstWhere = stringToWhere(operations[0]);

            operations.shift();

            if (firstWhere) {
                query = query.or(...firstWhere);

                for (const operation of operations) {
                    const args = stringToWhere(operation);
                    if (!args) continue;

                    query = query.where(...args);
                }
            }
        }

        if (startAfter) {
            query = query.startAfter(startAfter);
        }

        if (limit) {
            query = query.limit(Number(limit));
        }

        let users = await query.get();

        const isAdmin = currentUser.admin;
        if (!isAdmin) {
            users = users.map(secureUserData);
        }

        return res.sendResponse({
            status: 200,
            code: codes.USERS_FETCHED,
            message: "Users fetched successfully",
            users,
        });
    } catch (err) {
        return res.sendResponse(err as ServerError);
    }
};

export default searchUsersController;
