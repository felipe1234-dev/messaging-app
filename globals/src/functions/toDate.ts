function toDate(value: any): Date {
    if (value && value instanceof Object && value.toDate) {
        const date = value.toDate();
        return date;
    }
    if (value && value instanceof Object && value._seconds) {
        const date = new Date(value._seconds * 1000);
        return date;
    }
    if (value && value instanceof Object && value.seconds) {
        const date = new Date(value.seconds * 1000);
        return date;
    }
    if (value instanceof Date) {
        return value;
    }
    if (typeof value === "string" && !!value.trim()) {
        return new Date(value);
    }

    return value;
}

export default toDate;
