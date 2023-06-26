function timeAgo(date: Date) {
    const today = new Date();

    const millisecondsPassed = Math.round(today.getTime() - date.getTime());
    const secondsPassed = Math.round(millisecondsPassed / 1000);
    if (secondsPassed < 60) return "Just now";

    const minutesPassed = Math.round(secondsPassed / 60);
    if (minutesPassed === 1) return "1 minute ago";
    if (minutesPassed < 60) return `${minutesPassed} minutes ago`;

    const hoursPassed = Math.round(minutesPassed / 60);
    if (hoursPassed === 1) return "1 hour ago";
    if (hoursPassed < 24) return `${hoursPassed} hours ago`;

    const daysPassed = Math.round(hoursPassed / 24);
    if (daysPassed === 1) return "1 day ago";
    if (daysPassed < 7) return `${daysPassed} days ago`;

    const weeksPassed = Math.round(daysPassed / 7);
    if (weeksPassed === 1) return "1 week ago";
    if (weeksPassed < 4) return `${weeksPassed} weeks ago`;

    const yearsPassed = Math.round(today.getFullYear() - date.getFullYear());

    if (yearsPassed < 1) {
        const monthsPassed = Math.round(today.getMonth() - date.getMonth());
        if (monthsPassed === 1) return "1 month ago";
        if (monthsPassed < 12) return `${monthsPassed} months ago`;
    }

    if (yearsPassed === 1) return "1 year ago";
    return `${yearsPassed} years ago`;
}

export default timeAgo;
