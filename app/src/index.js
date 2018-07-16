import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {
    createStore,
    applyMiddleware
} from "redux";
import reducer from "./reducers";
import thunk from 'redux-thunk'
import {
    Provider
} from 'react-redux'
import {
    BrowserRouter
} from "react-router-dom";
import {createLogger} from 'redux-logger'

window.onload = () => {
    const middleware = [thunk];

    // if (process.env.NODE_ENV !== 'production') {
        middleware.push(createLogger());
    // }

    let store = createStore(reducer, applyMiddleware(...middleware));


    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>,
        document.getElementById('root')
    );

}