import React from "react";
import ReactDOM from "react-dom";

import 'rsuite/dist/styles/rsuite-dark.css'
import { Notification } from 'rsuite';
import App from "./App";

import store from "./state/store";
import { Provider } from "react-redux";
Notification.info('Hello World')

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById("react-root")
);
