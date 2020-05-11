import React from "react";
import PropTypes from "prop-types";
import PlayArea from "../components/PlayArea";
import TurnTimer from "../components/TurnTimer";
import {artistIdFrom, isChoosingStage} from "../game/Players";
import SelectionTimer from "../components/SelectionTimer";
import ChooseModal from "../components/ChooseModal";

const isChoosingPlayer = (players, playerId) => isChoosingStage(players) && playerId === artistIdFrom(players)

class PlayBoard extends React.Component {
  static propTypes = {
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    moves: PropTypes.any.isRequired,
    playerID: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { G, ctx, playerID, isActive, moves } = this.props;
    return (
      <div>
        <ChooseModal
          words={G.chooseWords}
          chooseWord={moves.chooseWord}
          choosePlayer={moves.choosePlayer}
          players={G.players}
          currentPlayerId={playerID}
          show={isChoosingPlayer(G.players, playerID)}
        />
        {
          isChoosingStage(G.players)
            ? <SelectionTimer G={G} ctx={ctx} moves={moves} />
            : <TurnTimer G={G} ctx={ctx} moves={moves} />
        }
        <PlayArea G={G} ctx={ctx} playerID={playerID} isActive={isActive} moves={moves}/>
      </div>
    )
  }
}

export default PlayBoard;
