import React from 'react';
import PropTypes from 'prop-types';
import { GameState } from '../constants';
import LeaderBoard from "../components/LeaderBoard";
import Game from "./Game";
import WaitingRoom from "../components/WaitingRoom";
import some from "lodash/some";
import Choose from "../components/Choose";
import {artistIdFrom, playerNames} from "../game/Players";

const isPlayerChoosing = players => {
  return some(Object.values(players), player => player.turn.action === 'choose');
}

class CollabSketchBoard extends React.Component {
  static propTypes = {
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    events: PropTypes.any.isRequired,
    gameID: PropTypes.string.isRequired,
    moves: PropTypes.any.isRequired,
    playerID: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    gameMetadata: PropTypes.array.isRequired,
  };

  componentDidMount() {
    const { G, playerID, moves, gameMetadata } = this.props;
    if (!(G.players[playerID] && G.players[playerID].game.joined)) {
      moves.joinGame(playerID, gameMetadata[parseInt(playerID)]['name']);
    }
  }

  render() {
    const { G, playerID, moves:{ startGame, chooseWord, choosePlayer }, isActive, gameID } = this.props;
    switch (G.state) {
      case GameState.WAITING:
        return (
          <WaitingRoom
            G={G}
            startGame={startGame}
            isActive={isActive}
            gameID={gameID}
            playerID={playerID}
          />
        );

      case GameState.STARTED:
        return isPlayerChoosing(G.players)
          ? playerID === artistIdFrom(G.players)
            ? <Choose words={G.chooseWords} chooseWord={chooseWord} choosePlayer={choosePlayer} players={playerNames(G.players)}/>
            : <h1>Wait till selection is complete!</h1>
          : <Game {...this.props} />;

      case GameState.ENDED:
        return <LeaderBoard players={G.players} />;

      default:
        return null;
    }
  }
}

export default CollabSketchBoard;