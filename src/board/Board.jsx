import React from 'react';
import PropTypes from 'prop-types';
import Grid from "../components/Grid";
import { GameState } from '../constants';
import './Board.css';
import ReadOnlyCanvas from "../components/ReadOnlyCanvas";

class CollabSketchBoard extends React.Component {
    static propTypes = {
        G: PropTypes.any.isRequired,
        ctx: PropTypes.any.isRequired,
        moves: PropTypes.any.isRequired,
        playerID: PropTypes.string.isRequired,
        isActive: PropTypes.bool.isRequired,
        isMultiplayer: PropTypes.bool.isRequired,
        gameMetadata: PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);
        this.startGame = this.startGame.bind(this);
        this.isAdmin = this.isAdmin.bind(this);
        this.isActive = this.isActive.bind(this);
        this.getActivePlayers = this.getActivePlayers.bind(this);
        this.guessArt = this.guessArt.bind(this);
    }

    getActivePlayers() {
        return this.props.gameMetadata.filter(player => !!player.name);
    }

    guessArt(id, e) {
        this.props.moves.guessArt(id, e.target.value)
    }

    startGame() {
        if (this.props.isActive) {
            this.props.moves.startGame();
        }
    }

    isActive(id) {
        if (!this.props.isActive) return false;
        if (this.props.G.state !== GameState.STARTED) return false;
        return id.toString() === this.props.playerID;

    }

    isAdmin(playerID) {
        return playerID === '0';
    }

    render() {
        let body = [];
        for (let i = 0; i < 2; i++) {
            body.push(
                <div key={i}>
                    { this.isActive(i) && <Grid
                        snapshot={this.props.G.canvases[i]['snapshot']}
                        updateSnapshot={this.props.moves.updateSnapshot}
                        isActive={this.isActive}
                        playerID={this.props.playerID}
                        id={i}
                    /> }
                    { !this.isActive(i) && <ReadOnlyCanvas
                        svgText={this.props.G.canvases[i]['svg']}
                    /> }
                    <input onChange={(e) => this.guessArt(i, e)} value={this.props.G.words[i]}/>
                </div>
            )
        }

        return (
            <div>
                { this.isAdmin(this.props.playerID) && this.props.G.state === GameState.WAITING ? <button onClick={this.startGame}>Start</button>: null }
                <div className='board'>
                    {body}
                </div>
            </div>
        );
    }
}

export default CollabSketchBoard;