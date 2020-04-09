import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
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
        this.isCanvasOneArtist = this.isCanvasOneArtist.bind(this);
        this.isCanvasTwoArtist = this.isCanvasTwoArtist.bind(this);
        this.isPlayerGuessing = this.isPlayerGuessing.bind(this);
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

    isActive() {
        if (!this.props.isActive) return false;
        else if (this.props.G.state !== GameState.STARTED) return false;
        return true
    }

    isCanvasOneArtist() {
      if(this.isActive() && !isEmpty(this.props.ctx.activePlayers)) {
          const activePlayers = this.props.ctx.activePlayers;
          const playerId = this.props.playerID;
          return activePlayers[playerId] === 'drawCanvasOne';
      }
      return false;
    }

    isCanvasTwoArtist() {
        if(this.isActive() && !isEmpty(this.props.ctx.activePlayers)) {
            const activePlayers = this.props.ctx.activePlayers;
            const playerId = this.props.playerID;
            return activePlayers[playerId] === 'drawCanvasTwo';
        }
        return false;
    }

    isPlayerGuessing() {
        return !this.isCanvasOneArtist() && !this.isCanvasTwoArtist();
    }

    isAdmin(playerID) {
        return playerID === '0';
    }

    render() {
        let body = [
            <div key={0}>
                { this.isCanvasOneArtist() && <Grid
                    snapshot={this.props.G.canvases[0]['snapshot']}
                    updateSnapshot={this.props.moves.updateSnapshotForCanvasOne}
                    isActive={this.isActive}
                    playerID={this.props.playerID}
                    id={0}
                /> }
                { !this.isCanvasOneArtist() && <ReadOnlyCanvas
                    svgText={this.props.G.canvases[0]['svg']}
                /> }
                { this.isPlayerGuessing() && <input onChange={(e) => this.guessArt(0, e)} value={this.props.G.words[0]}/> }
            </div>,
            <div key={1}>
                { this.isCanvasTwoArtist() && <Grid
                    snapshot={this.props.G.canvases[1]['snapshot']}
                    updateSnapshot={this.props.moves.updateSnapshotForCanvasTwo}
                    isActive={this.isActive}
                    playerID={this.props.playerID}
                    id={1}
                /> }
                { !this.isCanvasTwoArtist() && <ReadOnlyCanvas
                    svgText={this.props.G.canvases[1]['svg']}
                /> }
                { this.isPlayerGuessing() && <input onChange={(e) => this.guessArt(1, e)} value={this.props.G.words[1]}/> }
            </div>
        ]

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