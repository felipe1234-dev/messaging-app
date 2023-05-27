import { HashMap } from "@types";

function convertToHashMap<T>(arr: T[], itemToKey: (item: T) => string): HashMap<T> {
    return arr.reduce((map, item) => {
        const key = itemToKey(item);
        map[key] = item;

        return map;
    }, {} as HashMap<T>);
}

export default convertToHashMap;