import React from "react";
import PropTypes from "prop-types";
import PlayArea from "../components/PlayArea";

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
        <PlayArea G={G} ctx={ctx} playerID={playerID} isActive={isActive} moves={moves}/>
    )
  }
}

export default PlayBoard;
