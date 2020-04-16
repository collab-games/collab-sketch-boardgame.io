import React from 'react';
import ListGroup from "react-bootstrap/ListGroup";
import PropTypes from 'prop-types';

class PlayerList extends React.Component {
  static propTypes = {
    players: PropTypes.object.isRequired,
  }

  renderPlayers() {
    const { players } = this.props;
    return Object.entries(players).map(([ index, player]) => <ListGroup.Item key={index}>{player.name}</ListGroup.Item>)
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
