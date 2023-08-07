function getTimeCodeFromMs(ms: number) {
    const s = Math.round(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);

    const twoDigits = (n: number) => String(n).padStart(2, "0");

    if (h < 1) return `${m}:${twoDigits(s)}`;
    return `${h}:${twoDigits(m)}:${twoDigits(s)}`;
}

export default getTimeCodeFromMs;
