import React from "react";
import ReactDom from "react-dom";
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Lobby from "./components/Lobby";
import App from "./components/App";

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDom.render(
    <Router>
        <div>
            <Route path="/:gameId/:playerId" component={App} />
            <Route exact path="/" component={Lobby} />
        </div>
    </Router>,
    document.getElementById('root')
);

