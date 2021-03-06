import React from 'react';
import './App.css';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {AppRouting} from "./AppRouting";
import 'bootstrap/dist/css/bootstrap.min.css';
import {applyMiddleware, createStore} from 'redux';
import {RootReducer} from './redux/reducers';
import ReduxPromise from 'redux-promise';
import ReduxThunk from 'redux-thunk';

const storeWithMiddleware = applyMiddleware(ReduxThunk, ReduxPromise)(createStore);

const store = storeWithMiddleware(
    RootReducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

const App = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <AppRouting/>
            </BrowserRouter>
        </Provider>
    );
};

export default App;
