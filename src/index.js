import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import "@blueprintjs/core/lib/css/blueprint.css";
import {BrowserRouter, Route} from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";

const Router = () => (
    <BrowserRouter>
        <Route path='/' exact component={Dashboard}/>
        <Route path='/workspace/:name' component={App}/>
    </BrowserRouter>
);

ReactDOM.render(<Router />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
