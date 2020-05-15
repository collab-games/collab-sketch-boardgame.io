import React from 'react';
import { playerNames } from "../../game/Players";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";

class ChoosePlayer extends React.Component {

  render() {
    const { choosePlayer, players, currentPlayerId } = this.props;
    const otherPlayers = playerNames(players).filter(player => player.playerId !== currentPlayerId);
    return (
      <Col md={{span: 12}} className="choose-player">
        <p className="choose-player__label">Choose Player</p>
        <div className="choose-player__players"> { otherPlayers.map((player, index) =>
          <Button variant="secondary" key={index} className="choose-player__player"
                  onClick={() => choosePlayer(player.playerId)}>
            {player.playerName}
          </Button>)}
        </div>
      </Col>
    );
  }
}

export default ChoosePlayer;