import React from "react";
import Grid from "./Grid";
import ReadOnlyCanvas from "./ReadOnlyCanvas";
import PropTypes from "prop-types";
import repeat from "lodash/repeat";
import isEmpty from "lodash/isEmpty";
import {firstCanvasPlayerIdFrom, isChoosingStage} from "../../game/Players";

class CanvasOne extends React.Component {

  static propTypes = {
    isActive: PropTypes.bool.isRequired,
    playerID: PropTypes.string.isRequired,
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    moves: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.renderFirstWord = this.renderFirstWord.bind(this);
    this.isCanvasOneArtist = this.isCanvasOneArtist.bind(this);
  }

  isCanvasOneArtist() {
    const { isActive, ctx, playerID } = this.props;
    if (isActive && !isEmpty(ctx.activePlayers)) {
      const activePlayers = ctx.activePlayers;
      return activePlayers[playerID] === 'drawCanvasOne';
    }
    return false;
  }

  renderFirstWord() {
    const { G } = this.props;
    return <div className="word">
      { this.isCanvasOneArtist() ? G.word : repeat('_ ', G.canvasOne['chars']) }
    </div>;
  }

  artistName() {
    const { G } = this.props;
    const artistId = firstCanvasPlayerIdFrom(G.players);
    if (artistId) {
      return G.players[artistId].game.name;
    }
    return null;
  }

  render() {
    const { G, moves } = this.props;
    return (
      <div>
        { !isChoosingStage(G.players) && this.renderFirstWord() }
        {this.isCanvasOneArtist() && <Grid
          snapshot={G.canvasOne['snapshot']}
          updateSnapshot={moves.updateSnapshotForCanvasOne}
        />}
        {!this.isCanvasOneArtist() && <ReadOnlyCanvas
          svgText={G.canvasOne['svg']}
          artistName={this.artistName()}
        />}
      </div>
    );
  }
}

export default CanvasOne;