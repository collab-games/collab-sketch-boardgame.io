import React from "react";
import ReadOnlyCanvas from "./ReadOnlyCanvas";
import PropTypes from "prop-types";
import repeat from "lodash/repeat";
import isEmpty from "lodash/isEmpty";
import {firstCanvasPlayerIdFrom, isChoosingStage} from "../../game/Players";
import Canvas from "./Canvas";

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
      { this.isCanvasOneArtist()
        ? <p>You're drawing <span className="reveal">{G.word}</span></p>
        : <span className="conceal">{repeat('_ ', G.canvasOne['chars'])}</span>
      }
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
    const {G, moves} = this.props;
    return (
      <div className="canvas-container">
        { !isChoosingStage(G.players) && this.renderFirstWord() }
        {this.isCanvasOneArtist() && <Canvas snapshot={G.canvasOne.snapshot} updateSnapshot={moves.updateSnapshotForCanvasOne} /> }
        {!this.isCanvasOneArtist() && <ReadOnlyCanvas
          svgText={G.canvasOne['svg']}
          artistName={this.artistName()}
        />}
      </div>
    );
  }
}

export default CanvasOne;