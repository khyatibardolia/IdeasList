import React from 'react';
import './App.scss';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import AppRouting from "./AppRouting";
import 'bootstrap/dist/css/bootstrap.min.css';
import {applyMiddleware, createStore} from 'redux';
import {RootReducer} from './redux/reducers';
import ReduxPromise from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {CookiesProvider} from 'react-cookie';

const storeWithMiddleware = applyMiddleware(ReduxThunk, ReduxPromise)(createStore);

const store = storeWithMiddleware(
    RootReducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

const App = () => {
    return (<>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <CookiesProvider>
                <Provider store={store}>
                    <BrowserRouter>
                        <AppRouting/>
                    </BrowserRouter>
                </Provider>
            </CookiesProvider></>
    );
};

export default App;
