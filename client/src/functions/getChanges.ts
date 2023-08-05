function getChanges(newObj: any, oldObj: any) {
    const changes: {
        [prop: string]: {
            oldValue: any;
            newValue: any;
        };
    } = {};

    for (const [prop, newValue] of Object.entries(newObj)) {
        const oldValue = oldObj[prop];

        if (newValue instanceof Object && oldValue instanceof Object) {
            continue;
        }

        if (oldValue === newValue) continue;

        changes[prop] = {
            oldValue,
            newValue,
        };
    }

    console.log("changes", changes);

    return changes;
}

export default getChanges;
