import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import random from 'lodash/random';
import size from 'lodash/size';
import Quote from "./Quote";
import {default as quotes} from "../quotes.json";
import PlayerList from "./PlayerList";
import './WaitingRoom.css';
import {MIN_PLAYERS_REQUIRED} from "../constants";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";
import { Union } from 'react-bootstrap-icons';

class WaitingRoom extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.isAdmin = this.isAdmin.bind(this);
    this.getActivePlayers = this.getActivePlayers.bind(this);
    this.startGame = this.startGame.bind(this);
    this.startGameButton = this.startGameButton.bind(this);
    this.waitingInfo = this.waitingInfo.bind(this);
  }

  isAdmin(playerID) {
    return playerID === '0';
  }

  getActivePlayers() {
    return this.props.G.players;
  }

  startGame() {
    if (this.props.isActive) {
      if (size(this.getActivePlayers()) >= MIN_PLAYERS_REQUIRED) {
        this.props.startGameMove();
      }
    }
  }

  startGameButton() {
    const canStartGame = size(this.getActivePlayers()) >= MIN_PLAYERS_REQUIRED;
    return (
      <div className="start-game-button text-center">
        <Button onClick={this.startGame} disabled={ !canStartGame }>
          Start Game
        </Button>
        {canStartGame ? '': <Badge variant="light">Minimum 3 players required to play**</Badge>}

      </div>
    )
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
          <p className="waiting-text">Waiting for admin to start the Game !!</p>
          </Col>
        </Row>
      </Container>
      )
  }

  sharingInfo() {
    return (
          <div className="share-info">
            <div className="share-game-link">
              <label>ZEXEFGD</label>
            </div>
            <div className="clipboard">
              <Union size={30}/>
            </div>
          </div>
    );
  }

  render() {
    const {G, playerID} = this.props;
    const randomQuote = quotes[random(quotes.length - 1)];
    return (
      <div>
        <Container fluid={true}>
          <Row>
            <Col md={{span: 10}}>
              <Row>
                  {this.isAdmin(playerID) ? this.startGameButton() : this.waitingInfo()}
              </Row>
              <Row>
                <Quote text={randomQuote.quote} author={randomQuote.author}/>
              </Row>
              <Row>
                {this.sharingInfo()}
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