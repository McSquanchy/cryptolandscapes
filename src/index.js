import React from "react";
import ReactDOM from "react-dom";

import 'rsuite/dist/styles/rsuite-dark.css'
import App from "./App";
import './index.css'

import store from "./state/store";
import { Provider } from "react-redux";

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById("react-root")
);
