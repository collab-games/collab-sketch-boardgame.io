import React from 'react';
import ListGroup from "react-bootstrap/ListGroup";
import * as R from 'ramda';
import PropTypes from 'prop-types';
import UIfx from 'uifx';
import {FaTrophy} from 'react-icons/fa';
import './PlayerList.scss';
import { GameState } from "../constants";

class PlayerList extends React.Component {
  static propTypes = {
    players: PropTypes.object.isRequired,
    currentPlayerId: PropTypes.any,
    G: PropTypes.any
  };

  constructor(props) {
    super(props);
    this.correctGuessTone = new UIfx('/you-guess.mp3');
    this.otherGuessTone = new UIfx('/other-guess.mp3');
  }

  componentDidUpdate(prevProps) {
    const { G, players, currentPlayerId } = this.props;

    if (G.state === GameState.STARTED) {
      const currentScore = R.pathOr(0, ['game', 'score'], players[currentPlayerId]);
      const previousScore = R.pathOr(0,['game', 'score'], prevProps.players[currentPlayerId]);

      if (currentScore > previousScore) {
          this.correctGuessTone.play();
      }

      const othersGuessed = Object.entries(players)
        .find(([key, player]) => ((key !== currentPlayerId) && player.game.score > R.pathOr(0, ['game', 'score'], prevProps.players[key])));

      if (othersGuessed) {
        this.otherGuessTone.play();
      }
    }
  }

  isCurrentPlayer(playerId) {
    return this.props.currentPlayerId === playerId;
  }

  renderPlayers() {
    const { players } = this.props;

    return Object.keys(players)
      .sort((p1, p2) => players[p2].game.score - players[p1].game.score)
      .map((playerId, index) =>
        <ListGroup.Item
          key={index}
          className={this.isCurrentPlayer(playerId)?"current":""}
          variant={(players[playerId].turn.hasGuessed) ? 'success' :''}
        >
          <span >{players[playerId].game.name}</span>
          <span className="score">{players[playerId].game.score}</span>
        </ListGroup.Item>);
  }

  render() {
    return (
      <section id="leader-board">
        <h2 className="players-list__header"> <FaTrophy className="icon"/> <span>Leader Board</span> <FaTrophy className="icon"/> </h2>
        <ListGroup className="players-list">
          {this.renderPlayers()}
        </ListGroup>
      </section>
    );
  }
}

export default PlayerList;
