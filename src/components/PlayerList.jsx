import React from 'react';
import ListGroup from "react-bootstrap/ListGroup";

class PlayerList extends React.Component {

  renderPlayers() {
      const { players } = this.props;
      return players.map((player, index) => <ListGroup.Item key={index}>{player.name}</ListGroup.Item>)
  }

  render() {
    return (
          <ListGroup>
            <ListGroup.Item variant="primary">Players</ListGroup.Item>
              {this.renderPlayers()}
          </ListGroup>
    );
  }
}

export default PlayerList;
