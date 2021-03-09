import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import * as routes from '../src/constants/routes';
import Notes from "./components/Notes";
import AddEditNote from "./components/Notes/add-edit-notes/AddEditNote";
import {useDispatch, useSelector} from "react-redux";
import AuthenticateUser from "./components/authentication/AuthenticateUser";
import * as React from "react";
import PageNotFound from "./components/404/PageNotFound";
import {useEffect} from "react";
import { withCookies } from 'react-cookie';
import {userAuthenticationAction} from "./redux/actions/authenticate";

const AppRouting = (props: any) => {
    const {cookies} = props;
    const dispatch = useDispatch();
    const authToken: any = useSelector((state: any) => {
        return state?.auth?.user?.token
    });
    useEffect(() => {
        if(cookies.get('user')) {
            dispatch(userAuthenticationAction(cookies.get('user')));
        }
    }, [cookies, dispatch]);

    const authGuard = (Component: any) => () => {
        return authToken || cookies.get('user')?.token ? (
            <Component/>
        ) : (
            <Redirect to="/"/>
        );
    };

    return (<>
        <BrowserRouter {...props}>
            <Switch>
                <Route exact path={routes.LOGIN} component={AuthenticateUser}/>
                <Route exact path={routes.NOTES} component={authGuard(Notes)}/>
                <Route exact path={`${routes.ADDNOTE}`} component={authGuard(AddEditNote)}/>
                <Route exact path={`${routes.EDITNOTE}`} component={authGuard(AddEditNote)}/>
                <Route component={PageNotFound}/>
            </Switch>
        </BrowserRouter>
    </>)
};
export default withCookies(AppRouting)
