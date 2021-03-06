import React from 'react';
import { Client } from 'boardgame.io/react';
import {SocketIO} from "boardgame.io";
import {GAME_NAME, SERVER_PORT} from '../constants';
import CollabSketch from "../game/Game";
import CollabSketchBoard from "../board/Board";
import './App.css'
import ErrorBoundary from "./Error/ErrorBoundary";

const url = window.location.protocol+'//'+window.location.hostname+(window.location.port ? ':'+window.location.port: '');

const CollabSketchClient = Client({
    game: CollabSketch,
    board: CollabSketchBoard,
    debug: false,
    multiplayer: SocketIO({
        server: (process.env.NODE_ENV === 'production') ? `${url}` : `${window.location.hostname}:${SERVER_PORT}`
    }),
});

class App extends React.Component {
    constructor(props) {
        super(props);
        const { params } = props.match;
        const credentials = localStorage.getItem(`${GAME_NAME}-${params.gameId}`);
        let secret;
        if(!credentials) {
            this.props.history.push(`/${params.gameId}`);
        } else {
            secret = JSON.parse(credentials)[params.playerId];
        }
        this.state = {
            ...params,
            secret,
        };
    }

    render() {
        return (
          <div className="player-container">
            <ErrorBoundary>
              <CollabSketchClient gameID={this.state.gameId} credentials={this.state.secret}
                                  playerID={this.state.playerId + ''}/>
            </ErrorBoundary>
          </div>
        );
    }
}

export default App;
