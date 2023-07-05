import {
    codes,
    FilterParams,
    secureUserData,
    operators,
} from "messaging-app-globals";
import { UsersDB } from "@databases";
import { RouteController, Request } from "@typings";
import { ServerError, Unauthorized } from "@errors";

const searchUsersController: RouteController = async (
    req: Request & {
        params: {
            where?: string;
            startAfter?: string;
            limit?: string;
        };
    },
    res
) => {
    try {
        const { where, limit, startAfter } = req.params;
        const currentUser = req.user;
        if (!currentUser) throw new Unauthorized("You're not authenticated");

        const filterParams: FilterParams = {};

        if (limit) {
            filterParams.limit = Number(limit);
        }

        if (startAfter) {
            filterParams.startAfter = startAfter;
        }

        if (where) {
            filterParams.wheres = where
                .split(",")
                .reduce((wheres, operation) => {
                    const operator = operators.find((operator) =>
                        operation.includes(operator)
                    );
                    if (!operator) return wheres;

                    const [field, value] = operation.split(operator);
                    wheres.push([field, operator, value]);

                    return wheres;
                }, [] as Required<FilterParams>["wheres"]);
        }

        let users = await UsersDB.getUsers(filterParams);

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
