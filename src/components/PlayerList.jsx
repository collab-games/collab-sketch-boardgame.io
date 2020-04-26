import React from 'react';
import ListGroup from "react-bootstrap/ListGroup";
import PropTypes from 'prop-types';
import UIfx from 'uifx';
import './PlayerList.css';

class PlayerList extends React.Component {
  static propTypes = {
    players: PropTypes.object.isRequired,
    currentPlayerId: PropTypes.any,
    moves: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.correctGuess = new UIfx('/ta-da.mp3');
  }

  componentDidUpdate() {
    const { players, currentPlayerId } = this.props;
    const currentPlayer = players[currentPlayerId];

    if (currentPlayer.turn.hasGuessed && !currentPlayer.turn.hasSoundPlayed) {
        this.correctGuess.play();
        this.props.moves.markSoundPlayed(currentPlayerId);
    }

  }

  renderPlayers() {
    const { players } = this.props;
    return Object.values(players)
      .sort((p1, p2) => p2.game.score - p1.game.score)
      .map((player, index) => <ListGroup.Item key={index} variant={(player.turn.hasGuessed) ? 'success' :''}>
        <span>{player.game.name}</span>
        <span className="score">{player.game.score}</span>
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
