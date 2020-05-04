import React from 'react';
import PropTypes from 'prop-types';
import { GameState } from '../constants';
import LeaderBoard from "../components/LeaderBoard";
import Game from "./Game";
import WaitingRoom from "../components/WaitingRoom";

class CollabSketchBoard extends React.Component {
  static propTypes = {
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    events: PropTypes.any.isRequired,
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
    const { G, playerID, moves:{ startGame }, isActive } = this.props;
    switch (G.state) {
      case GameState.WAITING:
        return (
          <WaitingRoom
            startGameMove={ startGame }
            isActive={ isActive }
            playerID={ playerID }
            G={G}
          />
        );

      case GameState.STARTED:
        return <Game {...this.props} />;

      case GameState.ENDED:
        return <LeaderBoard players={G.players} />;

      default:
        return null;
    }
  }
}

export default CollabSketchBoard;