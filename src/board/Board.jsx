import React from 'react';
import PropTypes from 'prop-types';
import { GameState } from '../constants';
import LeaderBoard from "./LeaderBoard";
import PlayBoard from "./PlayBoard";
import WaitingRoom from "../components/WaitingRoom";
import Navigation from "../components/Navigation";
import "./Board.scss";

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

  renderBoard() {
    const { G, ctx, playerID, moves:{ startGame }, isActive, gameID, moves } = this.props;
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

  render() {
    return (
      <div>
        <Navigation
          G={this.props.G}
          ctx={this.props.ctx}
          moves={this.props.moves}
          playerID={this.props.playerID}
          gameID={this.props.gameID}
          isActive={this.props.isActive}
        />
        <div className="content">
          {this.renderBoard()}
        </div>
      </div>
    );
  }
}

export default CollabSketchBoard;