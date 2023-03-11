import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Container,
    Title,
    Paragraph,
    Icon,
    Rows,
    Columns,
    Column
} from "@styles/layout";
import { ShowItem } from "@styles/animations";

import { Input, Button, Checkbox, Link } from "@components";
import { useAuth, useAlert } from "@providers";

import { ReactComponent as ChatIcon } from "@images/Begin-chat.svg";
import { EmailOutline as EmailIcon } from "@styled-icons/evaicons-outline";
import { EyeOff2 as EyeCloseIcon } from "@styled-icons/evaicons-solid";
import { Eye as EyeOpenIcon } from "@styled-icons/fluentui-system-filled";
import { Lock as LockIcon } from "@styled-icons/boxicons-regular";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [viewPassword, setViewPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const alert = useAlert();
    const { login } = useAuth();
    const navigate = useNavigate();

    const passwordIcon = viewPassword ? <EyeOpenIcon /> : <EyeCloseIcon />;
    const passwordType = viewPassword ? "text" : "password";

    const disabled = !email || !password;

    const handleTogglePasswordView = () => ( 
        setViewPassword(prev => !prev)
    );

    const handleLogin = async () => {
        try {
            setLoading(true);

            await login(email, password, rememberMe);
            alert.success("Login successful");
            
            setTimeout(() => navigate("/"), 3000);
        } catch (error) {
            alert.error((error as Error).message);
        } finally {
            setTimeout(() => setLoading(false), 3000);
        }
    };

    return (
        <Container pt={15} pb={15} justify="start">
            <ShowItem>
                <Title level={3}>
                    Chatify
                </Title>
            </ShowItem>
            <Icon
                icon={<ChatIcon />}
                variant="highlight"
                size={21}
            />
            <ShowItem>
                <Paragraph variant="secondary" size={1.2}>
                    Please login to continue
                </Paragraph>
            </ShowItem>
            
            <Columns>
                <Column />
                <Column xs={9} sm={4} md={0.2}>
                    <ShowItem>
                        <Rows gap={15}>
                            <Input
                                fullWidth
                                leftIcon={<Icon icon={<EmailIcon />} size={1.5} />}
                                type="email"
                                placeholder="Email"
                                onChange={evt => setEmail(evt.target.value)}
                                value={email}
                            />
                            <Input
                                fullWidth
                                leftIcon={<Icon icon={<LockIcon />} size={1.5} />}
                                rightIcon={<Icon icon={passwordIcon} size={1.5} />}
                                onRightIconClick={handleTogglePasswordView}
                                type={passwordType}
                                placeholder="Password"
                                onChange={evt => setPassword(evt.target.value)}
                                value={password}
                            />
                            <Rows align="end">
                                <Checkbox 
                                    variant="primary"
                                    label="Remember me"
                                    onChange={evt => setRememberMe(evt.target.checked)}
                                    checked={rememberMe}
                                />
                            </Rows>
                            <Button
                                variant="primary"
                                onClick={handleLogin}
                                disabled={disabled}
                                loading={loading}
                            >
                                Login
                            </Button>
                            <Rows align="center">
                                <Link to="/register">I don't have an account</Link>
                            </Rows>
                        </Rows>
                    </ShowItem>
                </Column>
                <Column />
            </Columns>
        </Container>
    );
}

export default Login;