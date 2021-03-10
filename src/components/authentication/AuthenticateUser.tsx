import React, {useState} from 'react';
import {
    Avatar,
    Button,
    CssBaseline,
    Link,
    Paper,
    Box,
    Grid,
    Typography, CircularProgress,
} from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import {useDispatch} from "react-redux";
import {Field, reduxForm, FormErrors, InjectedFormProps} from 'redux-form';
import * as routes from "../../constants/routes";
import {useHistory} from "react-router-dom";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {makeStyles} from '@material-ui/core/styles';
import {getAuthToken, loginInWithEmailAndPassword, signUpWithEmailAndPassword} from "../../service/firebase/auth";
import {userAuthenticationAction} from "../../redux/actions/authenticate";
import {createUserDocument} from "../../service/firebase/firebase";
import {RenderTextField} from '../common/fields/RenderTextField';
import Image from '../../assets/background-img.svg';
import {toast} from "react-toastify";
import { useCookies } from 'react-cookie';
import './AuthenticateUser.scss'

interface IFormInputs {
    emailId: string,
    password: string,
    displayName: string
}


const AuthenticateUser: React.FC<IFormInputs & InjectedFormProps<{}, IFormInputs>> = (props: any) => {
    const {handleSubmit} = props;
    const [isUserSigningUp, setUserSigningUp] = useState(false);
    const [loading, setLoading] = React.useState(false);
    const [cookies, setCookie] = useCookies(['user']);

    const useStyles = makeStyles((theme) => ({
        root: {
            height: '100vh',
        },
        image: {
            backgroundRepeat: 'no-repeat',
            backgroundColor:
                theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        },
        paper: {
            padding: theme.spacing(14),
            margin: theme.spacing(8, 4),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main,
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1),
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
        },
        fabProgress: {
            color: grey[500],
            marginLeft: theme.spacing(1)
        },

    }));
    const dispatch = useDispatch();
    let history = useHistory();
    const Copyright = () => {
        return (
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="https://material-ui.com/">
                    Moar
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    };

    const onSubmit = async (data: IFormInputs) => {
        setLoading(true)
        const {emailId, password, displayName} = data;
        if (isUserSigningUp) {
            try {
                const {user} = await signUpWithEmailAndPassword(emailId, password);
                const data = await createUserDocument(user, {displayName});
                const token = await getAuthToken();
                if(token) {
                    dispatch(userAuthenticationAction({data, token}));
                    setLoading(false);
                    toast.success(`Welcome to Moar! ${displayName}`);
                    setCookie('user', {data, token}, { path: '/' });
                    history.push(routes.NOTES);
                }
                return data;
            } catch (error) {
                setLoading(false);
                toast.error(error?.message);
            }
        } else {
            if (emailId && password) {
                try {
                    const {user} = await loginInWithEmailAndPassword(emailId, password);
                    const data = await createUserDocument(user);
                    const token = await getAuthToken();
                    if(token) {
                        setCookie('user', {data, token}, { path: '/' });
                        dispatch(userAuthenticationAction({data, token}));
                        setLoading(false);
                        history.push(routes.NOTES);
                    }
                   return data;
                } catch (error) {
                    setLoading(false);
                    toast.error(error?.message);
                }
            }
        }
    };

    const handleToggler = () => {
        setUserSigningUp(!isUserSigningUp)
    };

    const classes = useStyles();
    /*console.log('userData-->>>', userData)*/
    return (
        <Grid container component="main" className={`${classes.root} authentication-form`}>
            <CssBaseline/>
            <Grid item xs={false} sm={4} md={6} className={'left-img d-flex justify-content-center align-items-center'}>
                <img src={Image} className={classes.image} alt={'list_img'}/>
            </Grid>
            <Grid item xs={12} sm={8} md={6}
                  className="d-flex justify-content-center align-items-center"
                  component={Paper} elevation={6} square>
                <div className={`${classes.paper} form-grid`}>
                    <Typography className={'mb-3'} component="h1" variant="h4">
                        Welcome to Moar
                    </Typography>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {`${isUserSigningUp ? 'Sign Up' : 'Log in'}`}
                    </Typography>
                    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                        {isUserSigningUp ?
                            <Field name="displayName"
                                   component={RenderTextField}
                                   placeholder="Full Name"
                                   label="Full Name"/> : null}
                        <Field name="emailId"
                               component={RenderTextField}
                               placeholder="Email Address"
                               label="Email Address"/>
                        <Field component={RenderTextField}
                               type="password"
                               label="Password"
                               placeholder="Password"
                               name="password"/>
                        <div className={'d-flex'}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                className={classes.submit}
                            >
                                {`${isUserSigningUp ? 'Sign Up' : 'Log in'}`}
                                {loading && <CircularProgress color={'secondary'}
                                                              className={classes.fabProgress}
                                                              size={20}/>}
                            </Button>
                        </div>

                        <Grid container>
                            <Grid item>
                                <Link onClick={handleToggler} href="#" variant="body2">
                                    {`${!isUserSigningUp ? 'Don\'t have an account? Sign Up' : 'Already a member? Log in'}`}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mb={3} position={'absolute'} bottom={0}>
                    <Copyright/>
                </Box>
            </Grid>
        </Grid>
    );

};

const validate = (values: IFormInputs): FormErrors<IFormInputs> => {
    const errors: FormErrors<IFormInputs> = {};
    if (!values.emailId) {
        errors.emailId = 'Email is required.';
    }
    if (!values.password) {
        errors.password = 'Password is required.';
    }
    if (!values.displayName) {
        errors.displayName = 'Name is required.';
    }
    if (values.emailId && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.emailId)) {
        errors.emailId = 'Invalid email address'
    }
    return errors;
};

export default reduxForm<{}, IFormInputs>({
    form: 'userForm',
    enableReinitialize: true,
    destroyOnUnmount: false,
    validate
})(AuthenticateUser);
