function JSONToURLQuery(json: { [key: string]: any }): string {
    let result: string[] = [];

    for (const [key, value] of Object.entries(json)) {
        result.push(`${key}=${encodeURIComponent(value)}`);
    }

    return result.join("&");
}

export default JSONToURLQuery;
