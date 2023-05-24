import getWebsiteURL from "../getWebsiteURL";

const baseURL = getWebsiteURL();

function passwordRecovery(props: { recoveryToken: string }) {
    const { recoveryToken } = props;

    return `
        <h1>Password recovery</h1>
        <p>Please click the link below to recover your password:</p>
        <p><a href="${baseURL}/recover-password/${recoveryToken}">
            ${baseURL}/recover-password/${recoveryToken}
        </a></p>
    `;
}

export default passwordRecovery;
