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

import { Input, Button, Link } from "@components";
import { useAuth, useAlert } from "@providers";
import { Api } from "@services";

import { ReactComponent as ChatIcon } from "@images/Begin-chat.svg";
import { EmailOutline as EmailIcon } from "@styled-icons/evaicons-outline";
import { EyeOff2 as EyeCloseIcon } from "@styled-icons/evaicons-solid";
import { Eye as EyeOpenIcon } from "@styled-icons/fluentui-system-filled";
import { Lock as LockIcon } from "@styled-icons/boxicons-regular";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [viewPassword, setViewPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    
    const alert = useAlert();
    const { login } = useAuth();
    const navigate = useNavigate();

    const passwordIcon = viewPassword ? <EyeOpenIcon /> : <EyeCloseIcon />;
    const passwordType = viewPassword ? "text" : "password";

    const disabled = !name || !email || !password || !confirmPassword;

    const handleTogglePasswordView = () => ( 
        setViewPassword(prev => !prev)
    );

    const handleRegister = async () => {
        try {
            setLoading(true);

            if (confirmPassword !== password)
                throw new Error(
                    "The confirmed password does not match the original password. Please try again."
                );

            await Api.auth.register(name, email, password);
            await login(email, password, false);
            
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
                    Please register to continue
                </Paragraph>
            </ShowItem>
            
            <Columns>
                <Column />
                <Column xs={9} sm={4} md={0.2}>
                    <ShowItem>
                        <Rows gap={15}>
                            <Input
                                fullWidth
                                type="text"
                                placeholder="Name"
                                onChange={evt => setName(evt.target.value)}
                                value={name}
                            />
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
                            <Input
                                fullWidth
                                leftIcon={<Icon icon={<LockIcon />} size={1.5} />}
                                rightIcon={<Icon icon={passwordIcon} size={1.5} />}
                                onRightIconClick={handleTogglePasswordView}
                                type={passwordType}
                                placeholder="Confirm password"
                                onChange={evt => setConfirmPassword(evt.target.value)}
                                value={confirmPassword}
                            />
                            <Button
                                variant="primary"
                                onClick={handleRegister}
                                disabled={disabled}
                                loading={loading}
                            >
                                Register
                            </Button>
                            <Rows align="center">
                                <Link to="/login">I already have an account</Link>
                            </Rows>
                        </Rows>
                    </ShowItem>
                </Column>
                <Column />
            </Columns>
        </Container>
    );
}

export default Register;