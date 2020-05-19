import React from "react";
import PropTypes from "prop-types";
import PlayArea from "../components/PlayArea";
import TurnTimer from "../components/TurnTimer";
import {artistIdFrom, isChoosingStage, isChoosingPlayer} from "../game/Players";
import SelectionTimer from "../components/SelectionTimer";
import ChooseModal from "../components/ChooseModal/ChooseModal";
import { Toast } from "react-bootstrap";
import Toaster from "../components/Toaster";

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


  renderTimer() {
    const { G, ctx, moves } = this.props;
    return (
      isChoosingStage(G.players)
        ? <SelectionTimer G={G} ctx={ctx} moves={moves} />
        : <TurnTimer G={G} ctx={ctx} moves={moves} />
    );
  }

  render() {
    const { G, ctx, playerID, isActive, moves } = this.props;
    return (
      <div>
        { this.renderTimer() }
        <PlayArea G={G} ctx={ctx} playerID={playerID} isActive={isActive} moves={moves}/>
      </div>
    )
  }
}

export default PlayBoard;
