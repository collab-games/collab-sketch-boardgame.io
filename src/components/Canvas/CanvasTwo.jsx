import React from "react";
import Grid from "./Grid";
import ReadOnlyCanvas from "./ReadOnlyCanvas";
import PropTypes from "prop-types";
import repeat from "lodash/repeat";
import isEmpty from "lodash/isEmpty";
import { isChoosingStage, secondCanvasPlayerIdFrom } from "../../game/Players";

class CanvasTwo extends React.Component {

  static propTypes = {
    isActive: PropTypes.bool.isRequired,
    playerID: PropTypes.string.isRequired,
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    moves: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.renderSecondWord = this.renderSecondWord.bind(this);
    this.isCanvasTwoArtist = this.isCanvasTwoArtist.bind(this);
  }

  isCanvasTwoArtist() {
    const { isActive, ctx, playerID } = this.props;
    if (isActive && !isEmpty(ctx.activePlayers)) {
      const activePlayers = ctx.activePlayers;
      return activePlayers[playerID] === 'drawCanvasTwo';
    }
    return false;
  }

  renderSecondWord() {
    const { G } = this.props;
    return <div className="word">
      { this.isCanvasTwoArtist() ? G.word : repeat('_ ', G.canvasTwo['chars'])}
    </div>;
  }

  artistName() {
    const { G } = this.props;
    const artistId = secondCanvasPlayerIdFrom(G.players);
    if (artistId) {
      return G.players[artistId].game.name;
    }
    return null;
  }

  render() {
    const { G, moves } = this.props;
    return (
      <div>
        { !isChoosingStage(G.players) && this.renderSecondWord() }
        {this.isCanvasTwoArtist() && <Grid
          snapshot={G.canvasTwo['snapshot']}
          updateSnapshot={moves.updateSnapshotForCanvasTwo}
          id={1}
        />}
        {!this.isCanvasTwoArtist() && <ReadOnlyCanvas
          svgText={G.canvasTwo['svg']}
          artistName={this.artistName()}
        />}
      </div>
    );
  }
}

export default CanvasTwo;