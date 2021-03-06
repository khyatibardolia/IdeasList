import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import * as routes from '../src/constants/routes';
import Notes from "./components/Notes";
import AddEditNote from "./components/Notes/add-edit-notes/AddEditNote";
import DisplayNote from "./components/Notes/add-edit-notes/DisplayNote";
import {useSelector} from "react-redux";
import AuthenticateUser from "./components/authentication/AuthenticateUser";
import * as React from "react";
import PageNotFound from "./components/404/PageNotFound";

export const AppRouting = () => {

    const authToken: any = useSelector((state: any) => {
        return state?.auth?.user?.token
    });

    const authGuard = (Component: any) => () => {
        return authToken ? (
            <Component/>
        ) : (
            <Redirect to="/"/>
        );
    };

    return (<>
        <BrowserRouter>
            <Switch>
                <Route exact path={routes.LOGIN} component={AuthenticateUser}/>
                <Route exact path={routes.NOTES} component={authGuard(Notes)}/>
                <Route exact path={routes.ADDEDITNOTE} component={authGuard(AddEditNote)}/>
                <Route exact path={routes.DISPLAYNOTE} component={authGuard(DisplayNote)}/>
                <Route component={PageNotFound}/>
            </Switch>
        </BrowserRouter>
    </>)
};
