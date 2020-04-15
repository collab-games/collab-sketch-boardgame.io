import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import Timer from 'easytimer.js';
import Grid from "../components/Grid";
import { GameState } from '../constants';
import './Board.css';
import ReadOnlyCanvas from "../components/ReadOnlyCanvas";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PlayerList from "../components/PlayerList";
import Container from "react-bootstrap/Container";

class CollabSketchBoard extends React.Component {
    static propTypes = {
        G: PropTypes.any.isRequired,
        ctx: PropTypes.any.isRequired,
        events: PropTypes.any.isRequired,
        moves: PropTypes.any.isRequired,
        playerID: PropTypes.string.isRequired,
        isActive: PropTypes.bool.isRequired,
        isMultiplayer: PropTypes.bool.isRequired,
        gameMetadata: PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            turn: props.ctx.turn,
        }
        this.startGame = this.startGame.bind(this);
        this.isAdmin = this.isAdmin.bind(this);
        this.isActive = this.isActive.bind(this);
        this.getActivePlayers = this.getActivePlayers.bind(this);
        this.guessArt = this.guessArt.bind(this);
        this.isCanvasOneArtist = this.isCanvasOneArtist.bind(this);
        this.isCanvasTwoArtist = this.isCanvasTwoArtist.bind(this);
        this.isPlayerGuessing = this.isPlayerGuessing.bind(this);
        this.endTurn = this.endTurn.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.ctx.turn > prevState.turn){
            return { turn: nextProps.ctx.turn };
        }
        else return null;
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

    endTurn(turn) {
        this.props.moves.endTurn(turn);
    }

    componentDidUpdate(prevProps, prevState) {
        const previousTurn = prevState.turn;
        const currentTurn = this.state.turn;
        if( currentTurn > previousTurn) {
            const timer = new Timer();
            timer.start({
                countdown: true,
                startValues: {
                    seconds: this.props.G.settings.turnPeriod
                }
            });
            timer.addEventListener('targetAchieved', this.endTurn.bind(this, currentTurn));
        }
    }

    componentDidMount() {
        this.props.moves.joinGame(this.props.playerID, this.props.gameMetadata[parseInt(this.props.playerID)]['name']);
    }

    render() {
        let body = [
            <div key={0}>
                {this.isCanvasOneArtist()?<span>{this.props.G.players[this.props.playerID]}</span>:<span>length: {this.props.G.canvasOne['chars']}</span>}
                { this.isCanvasOneArtist() && <Grid
                    snapshot={this.props.G.canvasOne['snapshot']}
                    updateSnapshot={this.props.moves.updateSnapshotForCanvasOne}
                    isActive={this.isActive}
                    playerID={this.props.playerID}
                    id={0}
                /> }
                { !this.isCanvasOneArtist() && <ReadOnlyCanvas
                    svgText={this.props.G.canvasOne['svg']}
                /> }
                { this.isPlayerGuessing() && <input onChange={(e) => this.guessArt(0, e)} value={this.props.G.words[0]}/> }
            </div>,
            <div key={1}>
                {this.isCanvasTwoArtist()?<span>{this.props.G.players[1]}</span>:<span>length: {this.props.G.canvasTwo['chars']}</span>}
                { this.isCanvasTwoArtist() && <Grid
                    snapshot={this.props.G.canvasTwo['snapshot']}
                    updateSnapshot={this.props.moves.updateSnapshotForCanvasTwo}
                    isActive={this.isActive}
                    playerID={this.props.playerID}
                    id={1}
                /> }
                { !this.isCanvasTwoArtist() && <ReadOnlyCanvas
                    svgText={this.props.G.canvasTwo['svg']}
                /> }
                { this.isPlayerGuessing() && <input onChange={(e) => this.guessArt(1, e)} value={this.props.G.words[1]}/> }
            </div>
        ];

        return (
            <Container fluid={true}>
                <Row>
                    <Col md={{ span: 10 }}>
                        <div>
                            { this.isAdmin(this.props.playerID) && this.props.G.state === GameState.WAITING ? <button onClick={this.startGame}>Start</button>: null }
                            <div className='board'>
                                {body}
                            </div>
                        </div>
                    </Col>
                    <Col style={{paddingRight:0}} md={{ span: 2 }}>
                        <PlayerList players={this.getActivePlayers()} />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default CollabSketchBoard;