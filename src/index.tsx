import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createBrowserHistory } from "history";
import { PersistGate } from "redux-persist/integration/react";

import App from "./containers/App";
import * as serviceWorker from "./serviceWorker";
import configureStore from "./store/configureStore";

export const history = createBrowserHistory();

const { store, persistor } = configureStore({});

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router history={history}>
        <App />
      </Router>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
