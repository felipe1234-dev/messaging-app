function classNames(
    ...classes: (
        | string
        | {
              [className: string]: boolean;
          }
    )[]
): string {
    let result = "";

    for (const className of classes) {
        if (typeof className === "object") {
            for (const [key, value] of Object.entries(className)) {
                if (value) {
                    result += " ";
                    result += key;
                }
            }
        } else {
            result += " ";
            result += className;
        }
    }

    result = result.trim();
    result = result.replace(/\s+/g, " ");

    return result;
}

export default classNames;
