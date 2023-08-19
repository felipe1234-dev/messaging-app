/**
 * Use this instead of window.open to assure that the AdBlocker won't detect
 */
function openLink(link: string, newTab = true) {
    const a = document.createElement("a");
    a.setAttribute("href", link);
    if (newTab) a.setAttribute("target", "_blank");
    a.click();
}

export default openLink;
