import {combineReducers} from 'redux';
import {authReducer} from "./authReducer";
import { reducer as reducerForm } from 'redux-form';
import {noteReducer} from "./noteReducer";
import { globalReducer } from './globalReducer';

export const RootReducer = combineReducers({
    form: reducerForm,
    auth: authReducer,
    notes: noteReducer,
    globals: globalReducer
});
