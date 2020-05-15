import React from 'react';
import PropTypes from 'prop-types';
import { GameState } from '../constants';
import LeaderBoard from "./LeaderBoard";
import PlayBoard from "./PlayBoard";
import WaitingRoom from "../components/WaitingRoom";
import ChooseModal from "../components/ChooseModal/ChooseModal";
import {isChoosingStage, choosingPlayerIdFrom} from "../game/Players";

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
      moves.joinGame(gameMetadata[parseInt(playerID)]['name']);
    }
  }

  render() {
    const { G, ctx, playerID, moves:{ startGame, chooseWord, choosePlayer }, isActive, gameID, moves } = this.props;
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
        return <PlayBoard G={G} ctx={ctx} moves={moves} playerID={playerID} isActive={isActive} />;

      case GameState.ENDED:
        return <LeaderBoard players={G.players} />;

      default:
        return null;
    }
  }
}

export default CollabSketchBoard;