import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import Grid from "../components/Grid";
import {GameState} from '../constants';
import './Board.css';
import ReadOnlyCanvas from "../components/ReadOnlyCanvas";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PlayerList from "../components/PlayerList";
import ChatBox from "../components/ChatBox";
import Container from "react-bootstrap/Container";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

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
      timer: 0
    };
    this.startGame = this.startGame.bind(this);
    this.isAdmin = this.isAdmin.bind(this);
    this.isActive = this.isActive.bind(this);
    this.getActivePlayers = this.getActivePlayers.bind(this);
    this.isCanvasOneArtist = this.isCanvasOneArtist.bind(this);
    this.isCanvasTwoArtist = this.isCanvasTwoArtist.bind(this);
    this.isPlayerGuessing = this.isPlayerGuessing.bind(this);
    this.endTurn = this.endTurn.bind(this);
    this.decreaseTimer = this.decreaseTimer.bind(this);
    this.timerHandler = null;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.ctx.turn > prevState.turn) {
      return {turn: nextProps.ctx.turn};
    } else return null;
  }

  getActivePlayers() {
    return this.props.G.players;
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
    if (this.isActive() && !isEmpty(this.props.ctx.activePlayers)) {
      const activePlayers = this.props.ctx.activePlayers;
      const playerId = this.props.playerID;
      return activePlayers[playerId] === 'drawCanvasOne';
    }
    return false;
  }

  isCanvasTwoArtist() {
    if (this.isActive() && !isEmpty(this.props.ctx.activePlayers)) {
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

  decreaseTimer(turn) {
    const currentTime = this.state.timer - 1;
    if (currentTime <= 0) {
      this.endTurn(turn);
      clearInterval(this.timerHandler);
    }
    this.setState({ timer: currentTime });
  }

  componentDidUpdate(prevProps, prevState) {
    const previousTurn = prevState.turn;
    const currentTurn = this.state.turn;
    if (currentTurn > previousTurn) {
      clearInterval(this.timerHandler);
      this.timerHandler = setInterval(() => this.decreaseTimer(currentTurn), 1000);
      this.setState({ timer: prevProps.G.settings.turnPeriod });
    }
  }

  componentDidMount() {
    this.props.moves.joinGame(this.props.playerID, this.props.gameMetadata[parseInt(this.props.playerID)]['name']);
    if (this.props.G.state === GameState.STARTED) {
      const serverTime = this.props.G.turn.startTime;
      const remainingTime =  this.props.G.settings.turnPeriod - Math.floor((Date.now() - serverTime)/1000);
      clearInterval(this.timerHandler);
      this.timerHandler = setInterval(() => this.decreaseTimer(this.props.ctx.turn), 1000);
      this.setState({ timer: remainingTime });
    }
  }

  renderTimer() {
    if (this.state.timer > 0) {
      return (
        <div className="count-down-timer">
        <CircularProgressbar maxValue={60} value={this.state.timer} text={this.state.timer} />
      </div>
      );
    }
  }
  render() {
    const {G, ctx, playerID, moves} = this.props;
    let body = [
      <div key={0}>
        {this.renderTimer()}
        {this.isCanvasOneArtist() ? <span>{G.word}</span> : <span>length: {G.canvasOne['chars']}</span>}
        {this.isCanvasOneArtist() && <Grid
          snapshot={G.canvasOne['snapshot']}
          updateSnapshot={moves.updateSnapshotForCanvasOne}
          isActive={this.isActive}
          playerID={playerID}
          id={0}
        />}
        {!this.isCanvasOneArtist() && <ReadOnlyCanvas
          svgText={G.canvasOne['svg']}
        />}
      </div>,
      <div key={1}>
        {this.isCanvasTwoArtist() ? <span>{G.word}</span> : <span>length: {G.canvasTwo['chars']}</span>}
        {this.isCanvasTwoArtist() && <Grid
          snapshot={G.canvasTwo['snapshot']}
          updateSnapshot={moves.updateSnapshotForCanvasTwo}
          isActive={this.isActive}
          playerID={playerID}
          id={1}
        />}
        {!this.isCanvasTwoArtist() && <ReadOnlyCanvas
          svgText={G.canvasTwo['svg']}
        />}
      </div>
    ];

    return (
      <Container fluid={true}>
        <Row>
          <Col md={{span: 10}}>
            <div>
              {this.isAdmin(playerID) && G.state === GameState.WAITING ?
                <button onClick={this.startGame}>Start</button> : null}
              {G.state === GameState.ENDED && ctx.gameover && <h1> Winner: {ctx.gameover.winner}</h1>}
              <div className='board'>
                {G.state === GameState.STARTED && body}
              </div>
            </div>
          </Col>
          <Col style={{paddingRight: 0}} md={{span: 2}}>
            <div>
              <PlayerList players={this.getActivePlayers()} currentPlayerId={playerID}/>
            </div>
            <div>
              {
                G.state === GameState.STARTED &&
                <ChatBox G={G} moves={moves} currentPlayer={G.players[playerID]}
                         isPlayerGuessing={this.isPlayerGuessing()}/>
              }
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default CollabSketchBoard;