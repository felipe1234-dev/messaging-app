function isLocal(): boolean {
    return window.location.href.includes("localhost");
}

export default isLocal;
