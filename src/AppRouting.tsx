import {BrowserRouter, Route} from 'react-router-dom';
import * as routes from '../src/constants/routes';
import Login from "./components/authentication/AuthenticateUser";
import Notes from "./components/Notes";
import AddEditNote from "./components/Notes/add-edit-notes/AddEditNote";
import DisplayNote from "./components/Notes/add-edit-notes/DisplayNote";

export const AppRouting = () => {
    return (<>
        <BrowserRouter basename='/'>
            <Route exact path={routes.LOGIN} component={Login}/>
            <Route exact path={routes.NOTES} component={Notes}/>
            <Route exact path={routes.ADDEDITNOTE} component={AddEditNote}/>
            <Route exact path={routes.DISPLAYNOTE} component={DisplayNote}/>
        </BrowserRouter>
    </>)
};
