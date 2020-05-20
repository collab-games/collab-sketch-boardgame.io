import React from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import random from 'lodash/random';
import size from 'lodash/size';
import Quote from "./Quote";
import {default as quotes} from "../quotes.json";
import PlayerList from "./PlayerList";
import {MIN_PLAYERS_REQUIRED} from "../constants";
import Spinner from "react-bootstrap/Spinner";
import { PlayFill } from 'react-bootstrap-icons';
import './WaitingRoom.css';
import ShareGame from "./ShareGame";

class WaitingRoom extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.isAdmin = this.isAdmin.bind(this);
    this.getActivePlayers = this.getActivePlayers.bind(this);
    this.startGame = this.startGame.bind(this);
    this.startGameButton = this.startGameButton.bind(this);
    this.waitingInfo = this.waitingInfo.bind(this);
    this.state = {
      quote: quotes[random(quotes.length - 1)]
    }
  }

  isAdmin(playerID) {
    return playerID === '0';
  }

  getActivePlayers() {
    return this.props.G.players;
  }

  startGame(event) {
    event.preventDefault();
    if (this.props.isActive) {
      if (size(this.getActivePlayers()) >= MIN_PLAYERS_REQUIRED) {
        this.props.startGame();
      }
    }
  }

  startGameButton() {
    const canStartGame = size(this.getActivePlayers()) >= MIN_PLAYERS_REQUIRED;
    return (
      <Row className="start-game-button-container">
        <div className="start-game-button" onClick={this.startGame}>
            <PlayFill size="50" color="#495057" />
        </div>
        {canStartGame ? '': <label className="start-game-hint">min 3 players required **</label>}
      </Row>
    )
  }

  adminName() {
    const { G : { players } } = this.props;
    return players ? players[0].game.name : 'admin';
  }

  waitingInfo() {
    return (
      <Container className="waiting-info">
        <Row className="text-center">
          <Col>
          <Spinner animation="grow"  size="sm"/>
          <Spinner animation="grow"  size="sm"/>
          <Spinner animation="grow" size="sm"/>
          <Spinner animation="grow" size="sm"/>
          </Col>
        </Row>
        <Row className="text-center">
          <Col>
          <p className="waiting-text">Waiting for { this.adminName() } to start the Game !!</p>
          </Col>
        </Row>
      </Container>
      )
  }

  render() {
    const {G, playerID, gameID} = this.props;
    const { quote } = this.state;
    return (
      <div>
        <Container fluid={true}>
          <Row>
            <Col md={{span: 10}}>
              <Row>
                {this.isAdmin(playerID) ? this.startGameButton() : this.waitingInfo()}
              </Row>
              <Row>
                <Quote text={quote.quote} author={quote.author}/>
              </Row>
              <Row>
                <ShareGame gameID={gameID} />
              </Row>
            </Col>
            <Col style={{paddingRight: 0}} md={{span: 2}}>
              <div>
                <PlayerList G={G} players={this.getActivePlayers()} currentPlayerId={playerID}/>
              </div>
            </Col>
          </Row>
        </Container>

      </div>
  );
  }
  }

  export default WaitingRoom;