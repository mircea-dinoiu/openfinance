import React from 'react';
import {TextField, Toggle} from 'material-ui';
import {Button} from '@material-ui/core';
import {ButtonProgress} from 'components/loaders';
import routes from 'defs/routes';
import {createXHR} from 'utils/fetch';
import {ErrorSnackbar} from 'components/snackbars';
import {useDispatch} from 'react-redux';
import {setUsers} from 'state/actionCreators';
import {Col, Row} from 'react-grid-system';
import {useTitleWithSetter, useUsers} from '../state/hooks';
import {Redirect} from 'react-router-dom';
import {paths} from 'js/defs';

const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [rememberMe, setRememberMe] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const dispatch = useDispatch();
    const [, setTitle] = useTitleWithSetter();
    const user = useUsers();

    React.useEffect(() => {
        setTitle('Please Login');
    }, []);

    if (user) {
        return <Redirect to={paths.home} />;
    }

    const submit = async () => {
        setLoading(true);

        try {
            const response = await createXHR({
                url: routes.user.login,
                method: 'POST',
                data: new URLSearchParams({
                    remember_me: rememberMe ? 'true' : 'false',
                    email,
                    password,
                }).toString(),
            });
            const json = response.data;

            // @ts-ignore
            dispatch(setUsers(json));
        } catch (e) {
            setError(e.response.data);
            setLoading(false);
        }
    };

    const handleTextFieldKeyDown = (event) => {
        switch (event.key) {
            case 'Enter':
                submit();
                break;
            default:
                setError(null);
                break;
        }
    };

    return (
        <Row nogutter>
            {/*
            // @ts-ignore */}
            <Col
                xs={10}
                md={6}
                lg={4}
                push={{
                    xs: 1,
                    md: 3,
                    lg: 4,
                }}
            >
                <TextField
                    hintText="Type in your e-mail"
                    floatingLabelText="E-mail"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={loading}
                    fullWidth={true}
                    onKeyDown={handleTextFieldKeyDown}
                />
                <TextField
                    hintText="Type in your password"
                    floatingLabelText="Password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={loading}
                    fullWidth={true}
                    onKeyDown={handleTextFieldKeyDown}
                />
                <Toggle
                    style={{margin: '20px 0 0'}}
                    label="Remember me"
                    toggled={rememberMe}
                    onToggle={(event, toggle) => setRememberMe(toggle)}
                    disabled={loading}
                />
                <Button
                    variant="contained"
                    color="primary"
                    style={{margin: '20px 0 0'}}
                    onClick={submit}
                    disabled={loading}
                >
                    {loading ? <ButtonProgress /> : 'Login'}
                </Button>
                {error != null && <ErrorSnackbar message={error} />}
            </Col>
        </Row>
    );
};

export default Login;
