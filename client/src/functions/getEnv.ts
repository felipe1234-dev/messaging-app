function getEnv(key: string): string | undefined {
    return process.env[`REACT_APP_${key}`];
}

export default getEnv;