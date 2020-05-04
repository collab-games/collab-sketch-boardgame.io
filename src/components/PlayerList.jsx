import React from 'react';
import ListGroup from "react-bootstrap/ListGroup";
import * as R from 'ramda';
import PropTypes from 'prop-types';
import UIfx from 'uifx';
import './PlayerList.css';
import { GameState } from "../constants";

class PlayerList extends React.Component {
  static propTypes = {
    players: PropTypes.object.isRequired,
    currentPlayerId: PropTypes.any,
    G: PropTypes.any
  };

  constructor(props) {
    super(props);
    this.correctGuess = new UIfx('/ta-da.mp3');
  }

  componentDidUpdate(prevProps) {
    const { G, players, currentPlayerId } = this.props;

    if (G.state === GameState.STARTED) {
      const currentScore = R.pathOr(0, ['game', 'score'], players[currentPlayerId]);
      const previousScore = R.pathOr(0,['game', 'score'], prevProps.players[currentPlayerId]);

      if (currentScore > previousScore) {
          this.correctGuess.play();
      }

      const othersGuessed = Object.entries(players)
        .find(([key, player]) => ((key !== currentPlayerId) && player.game.score > R.pathOr(0, ['game', 'score'], prevProps.players[key])));

      if (othersGuessed) {
        this.correctGuess.play();
      }
    }
  }

  highLightCurrentPlayer(playerId) {
    return this.props.currentPlayerId === playerId ? <span>&#9733;</span> : null;
  }

  renderPlayers() {
    const { players } = this.props;

    return Object.keys(players)
      .sort((p1, p2) => players[p2].game.score - players[p1].game.score)
      .map((playerId, index) => <ListGroup.Item key={index} variant={(players[playerId].turn.hasGuessed) ? 'success' :''}>
        { this.highLightCurrentPlayer(playerId) }
        <span>{players[playerId].game.name}</span>
        <span className="score">{players[playerId].game.score}</span>
      </ListGroup.Item>);
  }

  render() {
    return (
      <ListGroup className="players-list">
        <ListGroup.Item variant="primary">Players</ListGroup.Item>
        {this.renderPlayers()}
      </ListGroup>
    );
  }
}

export default PlayerList;
