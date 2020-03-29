import React from "react";
import ReactDom from "react-dom";
import {BrowserRouter as Router, Route, browserHistory} from 'react-router-dom'
import Lobby from "./components/Lobby";

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDom.render(
    <Router>
        <div>
            {/*<Route path="/:game/:id/:secret" component={App} />*/}
            <Route exact path="/" component={Lobby} />
        </div>
    </Router>,
    document.getElementById('root')
);

