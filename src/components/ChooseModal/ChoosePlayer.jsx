import React from 'react';
import { playerNames } from "../../game/Players";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import PropTypes from "prop-types";

class ChoosePlayer extends React.Component {

  static propTypes = {
    choosePlayer: PropTypes.func.isRequired,
    players: PropTypes.object.isRequired,
    currentPlayerId: PropTypes.string.isRequired,
  };

  render() {
    const { choosePlayer, players, currentPlayerId } = this.props;
    const otherPlayers = playerNames(players).filter(player => player.playerId !== currentPlayerId);
    return (
      <div className="choose-player">
        <div className="choose-player__players"> { otherPlayers.map((player, index) =>
          <Button variant="secondary" key={index} className="choose-player__player"
                  onClick={() => choosePlayer(player.playerId)}>
            {player.playerName}
          </Button>)}
        </div>
      </div>
    );
  }
}

export default ChoosePlayer;