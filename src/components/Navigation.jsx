import React from "react";
import NavbarBrand from "react-bootstrap/NavbarBrand";
import {Button, NavItem} from "react-bootstrap";
import PropTypes from "prop-types";
import size from "lodash/size";
import {GameState, MIN_PLAYERS_REQUIRED} from "../constants";
import "./Navigation.scss";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {isChoosingStage} from "../game/Players";
import SelectionTimer from "./SelectionTimer";
import TurnTimer from "./TurnTimer";
import Form from "react-bootstrap/Form";
import Popover from "react-bootstrap/Popover";
import {FaPlayCircle} from 'react-icons/fa'
import ShareGame from "./ShareGame";

class Navigation extends React.Component {
  static propTypes = {
    G: PropTypes.object.isRequired,
    ctx: PropTypes.object.isRequired,
    moves: PropTypes.object.isRequired,
    playerID: PropTypes.string.isRequired,
    gameID: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.renderStartGame = this.renderStartGame.bind(this);
    this.startGame = this.startGame.bind(this);
    this.endGame = this.endGame.bind(this);
    this.canStartGame = this.canStartGame.bind(this);
    this.renderEndGame = this.renderEndGame.bind(this);
  }

  isAdmin(playerID) {
    return playerID === '0';
  }

  getActivePlayers() {
    return this.props.G.players;
  }

  canStartGame() {
    return this.props.G.state === GameState.WAITING && size(this.getActivePlayers()) >= MIN_PLAYERS_REQUIRED;
  }

  startGame(event) {
    event.preventDefault();
    if (this.props.isActive) {
      if (this.canStartGame()) {
        this.props.moves.startGame();
      }
    }
  }

  endGame(event) {
    event.preventDefault();
    this.props.moves.endGame();
  }

  renderStartGame() {
    return (
        <OverlayTrigger
          placement="bottom"
          overlay={ this.canStartGame()
            ? <Tooltip id="start-game-hint"> Click to Start Game!</Tooltip>
            : <Tooltip id="start-game-hint"> Minimum 3 players required!</Tooltip> }
          delay={{ show: 100, hide: 1000 }}
        >
          <Button
            disabled={!this.canStartGame()}
            variant="warning"
            className="nav-button"
            onClick={this.startGame}
          >
            Start Game <FaPlayCircle className="icon" />
          </Button>
        </OverlayTrigger>
      );
  }

  renderEndGame() {
    return (
        <Button variant="warning" className="nav-button end-game-button" onClick={this.endGame}>End Game</Button>
    );
  }

  renderInvite() {
    const popover = <Popover id="popover-basic">
        <Popover.Content>
          <ShareGame gameID={this.props.gameID} size={20} />
        </Popover.Content>
      </Popover>;
    return <OverlayTrigger overlay={popover} trigger="click" placement="left">
      <Button variant="warning" className="nav-button">Invite</Button>
    </OverlayTrigger>
  }

  renderTimer() {
    const { G, ctx, moves } = this.props;
    return isChoosingStage(G.players)
      ? <SelectionTimer G={G} ctx={ctx} moves={moves} />
      : <TurnTimer G={G} ctx={ctx} moves={moves} />
  }

  render() {
    const { playerID, G: { state } } = this.props;
      return (
        <nav className="navbar navigation">
          <NavbarBrand href="/">Collab Sketch</NavbarBrand>
          {state === GameState.STARTED && this.renderTimer()}
          <Form inline>
            {state === GameState.STARTED && this.renderInvite()}
            {state === GameState.WAITING && this.isAdmin(playerID) && this.renderStartGame()}
            {state === GameState.STARTED && this.isAdmin(playerID) && this.renderEndGame()}
          </Form>
        </nav>
      );
  }
}

export default Navigation;