import { Icon } from "@styles/layout";
import Badge from "../Badge";

import { Circle } from "@styled-icons/material-rounded";

interface OnlineNowProps {
    children: React.ReactNode;
}

function OnlineNow(props: OnlineNowProps) {
    const { children } = props;

    return (
        <Badge
            badge={
                <Icon
                    variant="success"
                    icon={<Circle />}
                />
            }
            mr={-5}
        >
            {children}
        </Badge>
    );
}

export default OnlineNow;
export type { OnlineNowProps };
