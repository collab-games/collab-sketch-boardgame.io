import React from "react";
import NavbarBrand from "react-bootstrap/NavbarBrand";
import {Button, NavItem} from "react-bootstrap";
import PropTypes from "prop-types";
import size from "lodash/size";
import {GameState, MIN_PLAYERS_REQUIRED} from "../constants";
import "./Navigation.scss";

class Navigation extends React.Component {
  static propTypes = {
    startGame: PropTypes.func.isRequired,
    gameState: PropTypes.number.isRequired,
    players: PropTypes.object.isRequired,
    playerID: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.renderStartGame = this.renderStartGame.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  isAdmin(playerID) {
    return playerID === '0';
  }

  getActivePlayers() {
    return this.props.players;
  }

  startGame(event) {
    event.preventDefault();
    if (this.props.isActive) {
      if (size(this.getActivePlayers()) >= MIN_PLAYERS_REQUIRED) {
        this.props.startGame();
      }
    }
  }

  renderStartGame() {
    return (
      <NavItem>
        <Button variant="warning" className="start-stop-game" onClick={this.startGame}> Start Game !! </Button>
      </NavItem>
      );
  }

  render() {
    const { playerID, gameState } = this.props;
    return (
      <nav className="navbar navigation">
        <NavbarBrand>Collab Sketch</NavbarBrand>
        {gameState === GameState.WAITING && this.isAdmin(playerID) ? this.renderStartGame() : null}
      </nav>
    );
  }
}

export default Navigation;