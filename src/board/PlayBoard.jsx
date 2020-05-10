import React from "react";
import PropTypes from "prop-types";
import PlayArea from "../components/PlayArea";
import TurnTimer from "../components/TurnTimer";

class PlayBoard extends React.Component {
  static propTypes = {
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    moves: PropTypes.any.isRequired,
    playerID: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    gameMetadata: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { G, ctx, playerID, isActive, moves } = this.props;
    return (
      <div>
        <TurnTimer G={G} ctx={ctx} moves={moves} />
        <PlayArea G={G} ctx={ctx} playerID={playerID} isActive={isActive} moves={moves}/>
      </div>
    )
  }
}

export default PlayBoard;
