import { Container, Snackbar } from "./styles";
import { Severity } from "@types";
import { Icon } from "@styles/layout";

import { Times as ErrorIcon } from "@styled-icons/typicons";
import { Check as SuccessIcon } from "@styled-icons/entypo";
import { Warning as WarningIcon } from "@styled-icons/typicons";
import { InfoCircle as InfoIcon } from "@styled-icons/bootstrap";

interface AlertProps {
    show?: boolean;
    severity?: Severity;
    autoHideTime?: number;
    children?: React.ReactNode;
}

const icons = {
    error: <ErrorIcon />,
    success: <SuccessIcon />,
    warning: <WarningIcon />,
    info: <InfoIcon />,
};

function Alert(props: AlertProps) {
    const {
        show = false,
        autoHideTime = 500,
        severity = "error",
        children,
    } = props;

    const icon = icons[severity];

    return (
        <Container>
            <Snackbar
                severity={severity}
                autoHideTime={autoHideTime - 2 * 500}
                show={show}
            >
                <Icon icon={icon} /> {children}
            </Snackbar>
        </Container>
    );
}

export default Alert;
export type { AlertProps };
