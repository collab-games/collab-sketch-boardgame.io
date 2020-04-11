import React from 'react';
import { Client } from 'boardgame.io/react';
import {SocketIO} from "boardgame.io";
import { SERVER_PORT } from '../constants';
import CollabSketch from "../game/Game";
import CollabSketchBoard from "../board/Board";
import Navbar from "react-bootstrap/Navbar";

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
        const credentials = localStorage.getItem(`player-${params.playerId}`);
        this.state = {
            ...params,
            credentials,
        };
    }

    render() {
        return (
            <div>
                <div>
                    <Navbar bg="dark" variant="dark">
                        <Navbar.Brand>Collab Sketch</Navbar.Brand>
                    </Navbar>
                </div>
                <div className="player-container">
                    <CollabSketchClient gameID={this.state.gameId} credentials={this.state.credentials}
                                        playerID={this.state.playerId + ''}/>
                </div>
            </div>
        );
    }
}

export default App;
